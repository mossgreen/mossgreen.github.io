---
title: "Deploying an AI Agent to AWS: OpenAI Agents SDK + FastAPI + Lambda"
tags:
  - LLM
  - OpenAI SDK
  - Bedrock
  - AI Agent
  - Terraform
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Deploy a production-ready AI agent to AWS Lambda using OpenAI Agents SDK, FastAPI, and Terraform.


> This post is a **short, focused implementation summary** of *Pattern E (Single Agent)* from my AI orchestration series.  
>  
> - Full conceptual background:  
>   https://mossgreen.github.io/Booking-system-ai-orchestration/  
> - Full implementation:  
>   https://github.com/mossgreen/ai-orchestration-patterns/tree/main/pattern-e-single-agent  
> - Terraform deployment:  
>   https://github.com/mossgreen/ai-orchestration-patterns/tree/main/terraform/pattern_e  

## Architecture Overview

Here's what we're building:

```
┌──────────┐       ┌─────────────────┐       ┌──────────────┐
│   User   │──────▶│  API Gateway    │──────▶│   Lambda     │
└──────────┘       └─────────────────┘       │              │
                                             │  ┌────────┐  │
                                             │  │FastAPI │  │
                                             │  └────┬───┘  │
                                             │       │      │
                                             │  ┌────▼───┐  │
                                             │  │ Agent  │  │
                                             │  │  SDK   │  │
                                             │  └────┬───┘  │
                                             │       │      │
                                             │  ┌────▼─────┐│
                                             │  │ Booking  ││
                                             │  │ Service  ││
                                             │  └──────────┘│
                                             └──────────────┘
```

**Flow:**
1. User sends message to API Gateway
2. Gateway triggers Lambda (via Mangum adapter)
3. FastAPI routes to agent
4. Agent autonomously:
    - Calls check_availability if needed
    - Calls book_slot if ready
    - Asks clarifying questions
5. Returns final response

## The Code

We'll build the agent in four layers:

1. **Tools** - Functions the agent can call (`check_availability`, `book_slot`)
2. **Agent** - OpenAI Agents SDK instance with tools and instructions
3. **FastAPI** - REST API wrapper around the agent
4. **Lambda Handler** - Mangum adapter to run FastAPI on AWS Lambda

### 1. Define Tools with @function_tool

The `@function_tool` decorator tells the agent what functions it can call:

```python
from agents import function_tool
from shared import create_booking_service

booking_service = create_booking_service()

@function_tool
def check_availability(date: str, time: Optional[str] = None) -> str:
    """
    Check available tennis court slots for a given date.

    Args:
        date: Date in YYYY-MM-DD format (e.g., "2024-12-15")
        time: Optional specific time in HH:MM format (e.g., "14:00")

    Returns:
        Available slots or a message if none found
    """
    slots = booking_service.check_availability(date, time)

    if not slots:
        return f"No available slots found for {date}"

    result = f"Available slots for {date}:\n"
    for slot in slots:
        result += f"  - {slot.court} at {slot.time} (ID: {slot.slot_id})\n"

    return result


@function_tool
def book_slot(slot_id: str) -> str:
    """
    Book a specific tennis court slot.

    Args:
        slot_id: The slot ID from check_availability results

    Returns:
        Booking confirmation or error message
    """
    try:
        booking = booking_service.book(slot_id)
        return (
            f"Booking confirmed!\n"
            f"  Booking ID: {booking.booking_id}\n"
            f"  Court: {booking.court}\n"
            f"  Date: {booking.date}\n"
            f"  Time: {booking.time}"
        )
    except Exception as e:
        return f"Booking failed: {e}"
```

**Key points:**
- Docstrings become the agent's understanding of what each tool does
- Return strings (agents work best with text, not complex objects)
- Type hints help the agent understand parameters

### 2. Create the Agent

```python
from agents import Agent, Runner
from datetime import datetime

def get_instructions(context, agent) -> str:
    """Generate dynamic instructions with current datetime."""
    now = datetime.now()
    current_datetime = now.strftime("%Y-%m-%d %H:%M (%A)")

    return f"""You are a helpful tennis court booking assistant.

CURRENT DATETIME: {current_datetime}

WORKFLOW:
- When a user wants to book, FIRST check availability for their preferred date/time
- Present the available options clearly
- If they confirm a slot, book it using the slot_id
- Always confirm the booking details

GUIDELINES:
- Convert relative dates ("tomorrow", "next Monday") to YYYY-MM-DD format
- If no time is specified, show all available slots for that day
- Be concise but friendly

IMPORTANT: You control the conversation flow. Decide autonomously when to check availability vs when to book."""

# Create the agent
booking_agent = Agent(
    name="Tennis Court Booking Agent",
    instructions=get_instructions,
    tools=[check_availability, book_slot],
)
```

**Why dynamic instructions?**
The agent needs to know the current date to convert "tomorrow" to "2024-12-16". Using a function instead of a string keeps this fresh.

### 3. Wrap with FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Pattern E: Single Agent")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Send a message to the booking agent."""
    try:
        result = await Runner.run(booking_agent, request.message)
        return ChatResponse(response=result.final_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health() -> dict:
    return {"status": "healthy", "pattern": "E"}
```

**Why FastAPI?**
- Async-native (matches OpenAI Agents SDK)
- Auto-generates OpenAPI docs
- Works seamlessly with Mangum for Lambda

### 4. Lambda Adapter

```python
# lambda_handler.py
from mangum import Mangum
from .api import app

handler = Mangum(app, lifespan="off")
```

That's it. 3 lines to make FastAPI work on Lambda.

## AWS Deployment

### Prerequisites

**Required tools:**
- Python 3.12+
- UV (package manager)
- Docker (for Lambda builds)
- AWS CLI configured
- Terraform 1.5+

### Step 1: Project Structure

```
pattern-e-single-agent/
├── src/
│   ├── agent.py           # Agent definition + tools
│   ├── api.py             # FastAPI wrapper
│   ├── lambda_handler.py  # Mangum adapter
│   ├── models.py          # Pydantic models
│   └── settings.py        # Configuration
├── pyproject.toml         # Dependencies
└── sequence.puml          # Architecture diagram
```

### Step 2: Define Dependencies

**pyproject.toml:**
```toml
[project]
name = "pattern-e-single-agent"
requires-python = ">=3.11"
dependencies = [
    "openai-agents>=0.0.3",
    "fastapi>=0.115.0",
    "uvicorn>=0.32.0",
    "mangum>=0.19.0",
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
]
```

### Step 3: Build Lambda Package

```bash
# Build with Docker (ensures Linux compatibility)
python scripts/package_lambda.py pattern-e-single-agent

# Output: pattern-e-single-agent/dist/lambda.zip (~79MB)
```

**Why Docker?**
Python packages with C extensions (like pydantic) need to be compiled for Linux x86_64 (Lambda's runtime), not macOS.

### Step 4: Deploy with Terraform

**terraform/pattern_e/main.tf:**
```hcl
resource "aws_lambda_function" "main" {
    function_name = "ai-patterns-pattern-e"
    handler       = "src.lambda_handler.handler"
    runtime       = "python3.12"
    filename      = "../../pattern-e-single-agent/dist/lambda.zip"

    timeout     = 60
    memory_size = 512

    environment {
        variables = {
            OPENAI_API_KEY = var.openai_api_key
        }
    }
}

resource "aws_apigatewayv2_api" "api" {
    name          = "ai-patterns-pattern-e"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
    api_id           = aws_apigatewayv2_api.api.id
    integration_type = "AWS_PROXY"
    integration_uri  = aws_lambda_function.main.invoke_arn
}
```

**Deploy:**
```bash
cd terraform/pattern_e
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: add your OpenAI API key

terraform init
terraform apply
```

**Output:**
```hcl
api_endpoint = "https://abc123.execute-api.us-east-1.amazonaws.com"
```

### Step 5: Test

```bash
# Health check
curl https://abc123.execute-api.us-east-1.amazonaws.com/health

# Chat
curl -X POST https://abc123.execute-api.us-east-1.amazonaws.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What courts are available tomorrow at 3pm?"}'
```

**Response:**
```json
{
  "response": "Here are the available courts for tomorrow at 3pm:\n- Court A (ID: 2024-12-16_CourtA_1500)\n- Court B (ID: 2024-12-16_CourtB_1500)\n- Court C (ID: 2024-12-16_CourtC_1500)\n\nWould you like to book one of these?"
}
```

## When to Use This Pattern

| Use Case                                       | Recommended?                     |
|------------------------------------------------|----------------------------------|
| Customer support bot (unpredictable questions) | ✅ Perfect fit                   |
| Booking system (check → book workflow)         | ✅ Good (if users ask questions) |
| Data extraction (fixed schema)                 | ❌ Use function calling instead  |
| Multi-step research (needs reasoning)          | ✅ Perfect fit                   |
| Simple Q&A (no tools needed)                   | ❌ Overkill, use basic chat      |

**Rule of thumb:** If you can't write the workflow as a flowchart, use agents.

## Trade-offs

### Pros

| Benefit           | Why It Matters                              |
|-------------------|---------------------------------------------|
| Less code         | No manual loop management                   |
| Better UX         | Agent adapts to user's conversational style |
| Easier to extend  | Add tools with @function_tool, done         |
| Natural reasoning | LLM decides when to call what               |

### Cons

| Drawback         | Impact                                        |
|------------------|-----------------------------------------------|
| Less control     | Can't enforce "always check before booking"   |
| Higher latency   | Multiple LLM calls (reasoning loops)          |
| Higher cost      | More tokens per request than function calling |
| Debugging harder | Agent's internal reasoning is opaque          |

### Cost Comparison

**Function calling (Pattern D):**
- Average: 2-3 LLM calls per booking
- ~$0.002 per request (GPT-4o-mini)

**Agent (Pattern E):**
- Average: 3-5 LLM calls per booking
- ~$0.004 per request (GPT-4o-mini)

**When it's worth it:** User asks clarifying questions → agent's natural flow saves engineering time.

## Next Steps

1. Try the live demo: https://ok1ro2wdf1.execute-api.us-east-1.amazonaws.com/health
2. Clone the repo: https://github.com/mossgreen/ai-orchestration-patterns
3. Read the blog series: https://mossgreen.github.io/Booking-system-ai-orchestration/

**What's next?**
- Pattern F: Multi-Agent (Manager routes to specialists)
- Pattern G: Multi-Agent Multi-Process (Each agent = separate Lambda)
- Pattern H: AWS Bedrock Agents (Fully managed)

## Conclusion

Deploying an AI agent to AWS doesn't require complex orchestration frameworks. With OpenAI Agents SDK + FastAPI + Lambda, you get:

- Production-ready API in ~150 lines of code
- Serverless scaling (0 → 1000s RPS)
- <100ms cold start (with provisioned concurrency)

The key insight: Agents aren't magic. They're just LLMs with autonomy over their reasoning loop. Use them when the workflow is conversational, not deterministic.

**Remember:** No magic. Start simple, add complexity only when needed.
