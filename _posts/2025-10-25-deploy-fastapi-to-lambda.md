---
title: The Fastest Way to Deploy Your AI Agent to AWS Lambda
tags:
  - AWS
  - Lambda
  - Python
  - FastApi
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

You've built an AI agent. You need it to get to the cloud in 10 minutes.

## Why Lambda for AI Agents

AI agents calling external LLM APIs (OpenAI, Bedrock, Anthropic) share a key trait: they're computationally lightweight. The LLM provider does the heavy lifting. Your agent just orchestrates.

This makes Lambda ideal:

- **Zero idle cost** — pay only for actual requests
- **Auto-scaling** — handles spikes without capacity planning
- **No operations** — no servers to maintain

## The Problem

A deployment artifact comes from three inputs:

```
Artifact = Build(SourceCode, Dependencies, Environment)
```

| Input | Description |
|-------|-------------|
| SourceCode | Your Python files |
| Dependencies | Packages from lockfile |
| Environment | OS where `pip install` runs |

When you `pip install` on macOS, pip downloads macOS binaries. Packages with C extensions (`pydantic-core`, `numpy`, `orjson`) contain platform-specific code.

Copy these to Lambda's Amazon Linux → **crash**.

**Root cause**: Environment is treated as implicit, assumed identical between dev and prod.

## The Solution: Clean Room Pattern

Make Environment a constant by building inside Lambda's environment:

```
Artifact = Build(SourceCode, Dependencies, Lambda_Linux)
```

AWS publishes official Lambda images. Build inside them:

```bash
public.ecr.aws/lambda/python:3.12
```

If it builds in this container, it runs on Lambda. Guaranteed.

## Architecture

```
┌─────────────────────────────────────┐
│            AWS Lambda               │
├─────────────────────────────────────┤
│     Mangum (ASGI → Lambda)          │
├─────────────────────────────────────┤
│     FastAPI (HTTP Interface)        │
├─────────────────────────────────────┤
│     Agent + OpenAI SDK              │
└─────────────────────────────────────┘
```

| Component | Role |
|-----------|------|
| **FastAPI** | HTTP interface, request validation, OpenAPI docs |
| **Mangum** | Adapts ASGI to Lambda event format |
| **OpenAI SDK** | Unified LLM interface (supports OpenAI + Bedrock) |

## Project Structure

```
my-agent/
├── app/
│   ├── __init__.py
│   ├── main.py        # FastAPI + Lambda handler
│   ├── agent.py       # Agent logic
│   └── config.py      # Configuration
├── pyproject.toml
├── uv.lock
├── build.sh
└── terraform/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── terraform.tfvars   # Secrets (git-ignored)
```

## Implementation

### Configuration

```python
# app/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    openai_base_url: str | None = None  # Set for Bedrock
    model_name: str = "gpt-4o-mini"


settings = Settings()
```

### Agent

Minimal RAG pattern — replace in-memory store with vector DB in production.

```python
# app/agent.py
from openai import OpenAI
from .config import settings

client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
)

KNOWLEDGE_BASE = [
    "Founded in 2020.",
    "Pricing: Free, Pro ($29/mo), Enterprise.",
    "Support: 9am-5pm EST, Mon-Fri.",
]


def retrieve(query: str, top_k: int = 2) -> list[str]:
    return KNOWLEDGE_BASE[:top_k]


def answer(question: str) -> str:
    context = "\n".join(f"- {c}" for c in retrieve(question))
    response = client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": f"Answer based on:\n{context}"},
            {"role": "user", "content": question},
        ],
        max_tokens=500,
    )
    return response.choices[0].message.content
```

### API

```python
# app/main.py
from fastapi import FastAPI
from mangum import Mangum
from pydantic import BaseModel
from .agent import answer

app = FastAPI(title="AI Agent")


class Query(BaseModel):
    question: str


class Response(BaseModel):
    answer: str


@app.post("/query", response_model=Response)
def query(q: Query) -> Response:
    return Response(answer=answer(q.question))


@app.get("/health")
def health():
    return {"status": "healthy"}


# Lambda entry point
handler = Mangum(app, lifespan="off")
```

### Build Script

Implements the Clean Room Pattern:

```bash
#!/bin/bash
# build.sh
set -e

rm -rf package deployment.zip requirements.txt

# Export dependencies
uv export --frozen --no-dev --no-editable -o requirements.txt

# Build in Lambda environment (Clean Room)
docker run --rm \
    -v "$(pwd)":/var/task \
    -w /var/task \
    public.ecr.aws/lambda/python:3.12 \
    bash -c "pip install -r requirements.txt -t package/ -q"

# Package
cd package && zip -rq ../deployment.zip . && cd ..
zip -rq deployment.zip app/

rm -rf package requirements.txt
echo "Created deployment.zip ($(du -h deployment.zip | cut -f1))"
```

### Terraform

**Main configuration:**

```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.aws_region
}

# IAM Role
resource "aws_iam_role" "lambda" {
  name = "${var.function_name}-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function
resource "aws_lambda_function" "agent" {
  filename         = "${path.module}/../deployment.zip"
  function_name    = var.function_name
  role             = aws_iam_role.lambda.arn
  handler          = "app.main.handler"
  runtime          = "python3.12"
  timeout          = 30
  memory_size      = 256
  source_code_hash = filebase64sha256("${path.module}/../deployment.zip")

  environment {
    variables = {
      OPENAI_API_KEY  = var.openai_api_key
      OPENAI_BASE_URL = var.openai_base_url
      MODEL_NAME      = var.model_name
    }
  }
}

# Public URL
resource "aws_lambda_function_url" "agent" {
  function_name      = aws_lambda_function.agent.function_name
  authorization_type = "NONE"
}
```

**Variables:**

```hcl
# terraform/variables.tf
variable "aws_region"       { default = "us-west-2" }
variable "function_name"    { default = "ai-agent" }
variable "openai_api_key"   { sensitive = true }
variable "openai_base_url"  { default = "" }
variable "model_name"       { default = "gpt-4o-mini" }
```

**Outputs:**

```hcl
# terraform/outputs.tf
output "endpoint" {
  value = aws_lambda_function_url.agent.function_url
}
```

**Secrets (git-ignored):**

```hcl
# terraform/terraform.tfvars
openai_api_key = "sk-..."
```

**Deploy:**

```bash
cd terraform
terraform init
terraform apply
```

## Switching to Bedrock

The OpenAI SDK supports Bedrock through compatible API endpoints.

**Update `terraform.tfvars`:**

```hcl
openai_api_key  = "your-bedrock-api-key"
openai_base_url = "https://bedrock-runtime.us-west-2.amazonaws.com/openai/v1"
model_name      = "anthropic.claude-3-haiku-20240307-v1:0"
```

**Add Bedrock permissions to `main.tf`:**

```hcl
resource "aws_iam_role_policy" "bedrock" {
  name = "${var.function_name}-bedrock"
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["bedrock:InvokeModel"]
      Resource = "*"
    }]
  })
}
```

No code changes required — same agent, different provider.

## Zip vs Container

| Approach | Size Limit | Cold Start | Use When |
|----------|------------|------------|----------|
| **Zip** | 250 MB | Fast (~100-500ms) | API-calling agents (most cases) |
| **Container** | 10 GB | Slower (~500ms-2s) | Bundled ML models, heavy deps |

Typical AI agent deployment: **<20 MB**. Zip is the right choice.

## Summary

| Step | Action |
|------|--------|
| 1 | Structure code: `app/` for logic, root for infra |
| 2 | Build in Clean Room: `docker run` with Lambda image |
| 3 | Deploy with Terraform: `terraform apply` |
| 4 | Switch providers: update `terraform.tfvars` |