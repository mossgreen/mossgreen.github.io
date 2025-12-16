---
title: "Choosing the Right LLM for Generative vs Discriminative Tasks"
tags:
  - LLM
  - AI Agent
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

Choosing the wrong model for the wrong task leads to unstable systems, wasted compute, and unpredictable behavior. 

## 1. Introduction

Modern LLMs are powerful, but not every task needs the same kind of model. Some tasks need precise, predictable answers. Others need flexible reasoning and long-form generation. As AI agents become more common, understanding this difference becomes essential.

This blog explains the two task types, why they matter, and how to choose the right model for each.

---

## 2. What: Generative vs Discriminative Tasks

### 2.1 Generative Tasks

Generative tasks produce open-ended output. The model creates something new based on context and instructions.

**Examples:**
- Writing content (emails, documentation, marketing copy)
- Code generation
- Summarization
- Reasoning through complex problems
- Multi-step planning

**Agent context:** Agents use generative models for planning sequences, reasoning about goals, and generating tool call parameters. When an agent decides *how* to accomplish a task, it's doing generative work.

### 2.2 Discriminative Tasks

Discriminative tasks produce constrained output. The model selects from a defined set of options or makes a binary decision.

**Examples:**
- Intent classification
- Sentiment analysis
- Routing (which tool, which workflow, which agent)
- Safety/content filtering
- Entity extraction with fixed schemas

**Agent context:** Agents rely on discriminative steps for critical control flow—detecting user intent, choosing which tool to invoke, deciding whether to continue or stop. These are gatekeeping decisions.

### 2.3 Comparison Table

| Dimension | Generative Tasks | Discriminative Tasks |
|-----------|------------------|----------------------|
| **Output type** | Open-ended text, code, plans | Labels, categories, structured choices |
| **Accuracy expectation** | Subjective quality; "good enough" often acceptable | High precision required; errors are visible |
| **Reasoning depth** | Deep, multi-step reasoning often needed | Shallow pattern matching usually sufficient |
| **Latency tolerance** | Higher (users expect generation to take time) | Lower (routing should be fast) |
| **Model size preference** | Larger models perform better | Smaller models often sufficient |
| **Sensitivity to upgrades** | Upgrades usually beneficial | Upgrades can break behavior |
| **Role in agents** | Planning, reasoning, content creation | Intent detection, tool selection, control flow |

---

## 3. Why: Why This Distinction Matters

### 3.1 Why User Expectations Differ

User expectations differ fundamentally between these task types.

For **generative tasks**, users want creativity, depth, and adaptability. A better model means better output. There's tolerance for variation—two different good answers are both acceptable.

For **discriminative tasks**, users want consistency and correctness. The same input should produce the same output. Variation is a bug, not a feature.

**Agent context:** Agents need both. Deterministic routing ensures the right tool gets called. Flexible reasoning ensures the tool gets used intelligently. Mixing these requirements causes problems.

### 3.2 Why It Matters for Model Choice

Four factors drive model selection:

| Factor | Generative Priority | Discriminative Priority |
|--------|---------------------|------------------------|
| **Accuracy** | Quality ceiling matters | Precision/recall matter |
| **Stability** | Less critical | Critical |
| **Cost** | Higher spend acceptable for quality | Minimize cost at scale |
| **Latency** | Moderate tolerance | Low tolerance |

**Agent context:** 
A wrong discriminative decision cascades. If intent detection fails, the wrong tool gets called. If safety classification fails, harmful content passes through. These aren't graceful degradations—they're system failures.

Weak generative reasoning produces different failures: shallow plans, missing edge cases, poor tool parameter generation. The agent works, but poorly.

### 3.3 Consequences of Mixing Them

**Using large generative models for classification:**
- Overkill compute cost
- Unpredictable output format (the model may "explain" instead of classify)
- Behavior changes with model upgrades
- Higher latency for simple decisions

**Using small discriminative models for reasoning:**
- Shallow, brittle plans
- Poor handling of edge cases
- Weak multi-step reasoning
- Inability to recover from unexpected situations

**Agent failure examples:**
- A support agent using GPT-4 for intent routing sees behavior drift after an API update. Tickets get misrouted. Customer satisfaction drops.
- A code agent using a small model for planning generates single-step solutions. It can't decompose complex tasks. Users abandon it for hard problems.

### 3.4 Trade-offs Summary

| Concern | Discriminative Approach | Generative Approach |
|---------|------------------------|---------------------|
| **Stability** | High (fine-tuned, version-locked) | Variable (improves but changes) |
| **Cost per call** | Low | High |
| **Reasoning capability** | Limited | Strong |
| **Upgrade impact** | Risky (may break) | Beneficial (usually improves) |
| **Agent impact if wrong** | Cascading failures | Quality degradation |

---

## 4. How: Choosing the Right LLM Strategy

### 4.1 For Discriminative Tasks

**Recommended approach:**
- Use small, fine-tuned models
- Version-lock to prevent drift
- Consider self-hosting for control and cost
- Optimize for latency

**Model options:**
- Small instruction-tuned models (Phi, Gemma, small Llama)
- Claude Haiku or GPT-4o-mini for simple classification

**Agent applications:**
- Intent detection at conversation start
- Tool/function routing
- Safety and content filtering
- Workflow branching decisions

**Implementation notes:**
- Constrain output format strictly (enum values, JSON schema)
- Use logit bias or structured output modes when available
- Test extensively for edge cases
- Monitor for drift over time

### 4.2 For Generative Tasks

**Recommended approach:**
- Use large, capable frontier models
- Embrace upgrades (they usually help)
- Invest in prompt engineering
- Accept higher cost for quality

**Model options:**
- Claude Opus/Sonnet for complex reasoning
- GPT-4o for general generation
- Gemini Pro for multimodal tasks
- Open-weight models (Llama 3, Mixtral) for self-hosted needs

**Agent applications:**
- Multi-step planning
- Complex reasoning chains
- Content generation
- Tool parameter synthesis
- Error recovery and replanning

**Implementation notes:**
- Provide rich context and examples
- Use chain-of-thought prompting for complex tasks
- Implement output validation (the model generates, you verify)
- Build feedback loops for continuous improvement

### 4.3 System-Level Approaches

Real systems combine both task types. Three patterns work well:

**Pattern 1: Task-based routing**

Route requests to different models based on detected task type. A classifier (discriminative) determines which model (generative or discriminative) handles the request.

**Pattern 2: Cascading models**

Start with a small model. Escalate to larger models only when confidence is low or complexity is high. Saves cost while maintaining quality.

**Pattern 3: Layered agent architecture**

```
┌─────────────────────────────────────────────┐
│              User Request                   │
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Layer 1: Discriminative Router             │
│  (Small, fast, fine-tuned)                  │
│  - Intent classification                    │
│  - Tool selection                           │
│  - Safety filtering                         │
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│  Layer 2: Generative Reasoner               │
│  (Large, capable, frontier model)           │
│  - Planning                                 │
│  - Parameter generation                     │
│  - Content creation                         │
│  - Error handling                           │
└─────────────────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────┐
│              Tool Execution                 │
└─────────────────────────────────────────────┘
```

This separation keeps routing fast and stable while preserving reasoning quality where it matters.

### 4.4 Decision Framework

Use this quick reference when designing your system:

| Task Characteristic | Recommended Model Type | Example Models |
|--------------------|----------------------|----------------|
| Fixed output categories | Small discriminative | Haiku, GPT-4o-mini |
| High volume, low complexity | Small discriminative | Distilled classifiers |
| Requires explanation | Large generative | Sonnet, GPT-4o |
| Multi-step reasoning | Large generative | Opus, GPT-4 |
| Latency-critical routing | Small discriminative | Self-hosted small LLM |
| Creative content | Large generative | Frontier models |
| Safety filtering | Small discriminative | Fine-tuned classifier |
| Complex planning | Large generative | Frontier models |

---

## 5. Conclusion

The core principle is simple:

- **Discriminative tasks** → Small, stable, fine-tuned models. Optimize for consistency, speed, and cost.
- **Generative tasks** → Large, capable frontier models. Optimize for quality and reasoning depth.

Mixing them wastes resources and creates fragile systems. Using GPT-4 for intent classification is expensive and unstable. Using a small model for complex planning produces shallow results.

For AI agents, this separation is structural. Agents are pipelines of decisions and generations. The discriminative layer handles control flow—fast, deterministic, predictable. The generative layer handles reasoning—deep, flexible, creative.

Build systems that respect this distinction. Your agents will be more reliable, your costs more predictable, and your results more consistent.

---

*The right model for the right task. That's the principle. Everything else is implementation.*
