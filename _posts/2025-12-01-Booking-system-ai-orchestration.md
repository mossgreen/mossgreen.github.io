---
title: "AI Orchestration Deep Dive: From No-Agent to Multi-Agent and Beyond"
tags:
  - LLM
  - OpenAI SDK
  - Bedrock
  - AI Agent
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

Explores seven architectural patterns, from AI as a service (no agent) to multi-agents, and more.

## The Use Case

A tennis court booking system with two functions:

1. **check_availability** — Given date/time, return open slots
2. **book** — Reserve the selected slot, return confirmation

All 7 patterns implement these same 2 functions. The difference: **who decides which function to call and when**.

---

## Pattern A: Lambda → Bedrock (AI as Service, no agent)

**Style:** None — AI just generates/responds

### Architecture

```
User → API Gateway → Lambda → Bedrock → Lambda → DB → User
```

You control everything. Bedrock is just a text utility—no decision-making. It performs **discriminative tasks only**: parsing, classifying, extracting. The reasoning happens in your code.

### Pseudo Code

```python
# Lambda handler - YOU control all logic
# Two functions: check_availability, book

def check_availability(date, time):
    return db.query_available_slots(date, time)

def book(slot_id, user_id):
    return db.reserve_slot(slot_id, user_id)


def handler(event):
    user_input = event["body"]
    session = get_session(event)  # your state store
    
    # Use Bedrock to parse natural language
    prompt = f"Extract intent and params from: {user_input}"
    parsed = bedrock.invoke_model(prompt)
    # e.g., {intent: "check", date: "2025-12-04", time: "15:00"}
    
    # YOU decide which function to call
    if parsed["intent"] == "check":
        slots = check_availability(parsed["date"], parsed["time"])
        session["available_slots"] = slots
        return f"Available slots: {slots}"
    
    elif parsed["intent"] == "book":
        result = book(parsed["slot_id"], session["user_id"])
        return f"Booked! Confirmation: {result}"
    
    else:
        return "Please tell me if you want to check availability or book."
```

**Key point:** Bedrock parses text. **Your code** decides which function to call.

### Handling Multi-Turn Conversations

What if booking requires multiple inputs: date, time, slot?

**You manage the state:**

```
User: "Book a court for tomorrow"
                ↓
             Lambda
                ├──→ Bedrock parse → {date: "2025-12-04", time: ?, slot: ?}
                ├──→ Check: missing time, slot
                ↓
System: "What time would you like?"

User: "3pm"
                ↓
             Lambda
                ├──→ Bedrock parse → {time: "15:00"}
                ├──→ Merge state → {date: "2025-12-04", time: "15:00", slot: ?}
                ├──→ DB: get available slots
                ↓
System: "Slot A and B are available. Which one?"

User: "Slot A"
                ↓
             Lambda
                ├──→ Merge state → {date: "2025-12-04", time: "15:00", slot: "A"}
                ├──→ All fields complete → DB book
                ↓
System: "Booked! Court A, Dec 4 at 3pm"
```

**You need to:**
1. Store conversation state (DynamoDB, session, etc.)
2. Check what's missing after each parse
3. Prompt user for missing fields
4. Merge new input into existing state

**This is where Pattern A gets painful** — you're coding a state machine manually.

Pattern B/C/D handle this naturally. Agents track context and ask follow-ups automatically.

### Pros
- Full control
- Predictable behavior
- Easy to debug

### Cons
- Rigid — every flow must be coded
- No reasoning capability
- **Multi-turn conversations require manual state management**

### When to Use
- Fixed, predictable workflows
- AI only needed for text generation/formatting
- You want full control over logic
- **Single-turn or simple interactions**

---

## Pattern B: Bedrock Agent → Lambda (Agent Style)

**Style:** Agent — autonomous reasoning + action loop

### Architecture

```
User → Bedrock Agent → [Decides] → Lambda (Action Group) → DB
                     ↑___________ observes result ___________|
```

Bedrock Agent reasons about what to do, picks actions, executes, and loops until done.

### Pseudo Code

```python
# Agent definition (configured in Bedrock console/API)

agent_config = {
    "instruction": "You help users book tennis courts.",
    "action_groups": [
        {
            "name": "BookingActions",
            "lambda_arn": "arn:aws:lambda:...:booking-handler",
            "actions": [
                {
                    "name": "check_availability",
                    "description": "Check available tennis court slots",
                    "parameters": {
                        "date": "string"
                    }
                },
                {
                    "name": "book_slot",
                    "description": "Book a specific slot",
                    "parameters": {
                        "slot_id": "string",
                        "user_id": "string"
                    }
                }
            ]
        }
    ]
}

# Lambda handles the actual DB work
def booking_handler(event):
    action = event["actionGroup"]
    params = event["parameters"]
    
    if action == "check_availability":
        return db.query_slots(params["date"])
    elif action == "book_slot":
        return db.book(params["slot_id"], params["user_id"])


# Invocation - agent handles the rest
response = bedrock_agent.invoke(
    agent_id="xxx",
    session_id="user-session",
    input_text="Book me a court for tomorrow at 3pm"
)
# Agent autonomously: checks availability → picks slot → books → confirms
```

### Pros
- Handles ambiguity ("tomorrow at 3pm" → agent figures it out)
- Multi-step reasoning built-in
- Less code for complex flows

### Cons
- Less predictable
- Debugging is harder
- Vendor lock-in (AWS)

### When to Use
- Multi-step tasks with user intent interpretation
- You want AWS-native solution
- Acceptable latency for agent reasoning

---

## Pattern C: OpenAI Function Call → Lambda (Function Call Style)

**Style:** Function Call — AI suggests, YOU execute and control loop

### Architecture

```
User → Your Code → OpenAI API → [suggests function] → Your Code → Lambda → DB
            ↑______________________ you decide next step __________________|
```

OpenAI suggests which function to call. You execute it and decide what happens next.

### How the Loop Works

```
User: "Book a court for tomorrow at 3pm"

Loop 1:
┌─────────────────────────────────────────────────────────────┐
│ messages = [{role: "user", content: "Book a court..."}]     │
│                          ↓                                  │
│ OpenAI API (with tools defined)                             │
│                          ↓                                  │
│ Response: tool_calls = [{name: "check_availability",        │
│                          args: {date: "2025-12-04"}}]       │
│                          ↓                                  │
│ Has tool_calls? YES → YOU execute invoke_lambda()           │
│                          ↓                                  │
│ Append to messages:                                         │
│   - assistant msg (with tool_call)                          │
│   - tool result: [{slot_id: "A", time: "3pm"}, ...]        │
│                          ↓                                  │
│ Continue loop                                               │
└─────────────────────────────────────────────────────────────┘

Loop 2:
┌─────────────────────────────────────────────────────────────┐
│ messages = [user msg, assistant tool_call, tool result]     │
│                          ↓                                  │
│ OpenAI API (sees availability result)                       │
│                          ↓                                  │
│ Response: tool_calls = [{name: "book_slot",                 │
│                          args: {slot_id: "A"}}]             │
│                          ↓                                  │
│ Has tool_calls? YES → YOU execute invoke_lambda()           │
│                          ↓                                  │
│ Append to messages:                                         │
│   - assistant msg (with tool_call)                          │
│   - tool result: {confirmation: "Booked!"}                  │
│                          ↓                                  │
│ Continue loop                                               │
└─────────────────────────────────────────────────────────────┘

Loop 3:
┌─────────────────────────────────────────────────────────────┐
│ messages = [user, tool_call, result, tool_call, result]     │
│                          ↓                                  │
│ OpenAI API (sees booking confirmed)                         │
│                          ↓                                  │
│ Response: tool_calls = None                                 │
│           content = "Your court is booked for..."           │
│                          ↓                                  │
│ Has tool_calls? NO → return content → EXIT LOOP             │
└─────────────────────────────────────────────────────────────┘
```

**Who controls what:**

| What | Who |
|------|-----|
| Which function to call | AI suggests |
| Actually calling the function | **You** |
| Continue or stop loop | **You** |
| What to do with result | **You** |

### Pseudo Code

```python
# YOU control the loop

def handle_booking_request(user_input):
    messages = [{"role": "user", "content": user_input}]
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "check_availability",
                "description": "Check available slots",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {"type": "string"}
                    }
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "book_slot",
                "description": "Book a slot",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "slot_id": {"type": "string"}
                    }
                }
            }
        }
    ]
    
    # Loop controlled by YOU
    while True:
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            tools=tools
        )
        
        msg = response.choices[0].message
        
        # No function call? Done.
        if not msg.tool_calls:
            return msg.content
        
        # YOU execute the function
        for tool_call in msg.tool_calls:
            fn_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            
            # YOU call Lambda and decide what to do with result
            result = invoke_lambda(fn_name, args)
            
            messages.append(msg)
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            })
        
        # YOU decide: continue loop or break?
```

### Pros
- Fine-grained control over execution
- Can add validation/logging between steps
- Portable — not locked to one vendor

### Cons
- More code to write
- You manage the loop logic

### When to Use
- Need control between AI decisions
- Want to add custom validation/logic per step
- Building portable, vendor-agnostic solution

---

## Pattern D: OpenAI Agent → Lambda (Agent Style)

**Style:** Agent — SDK handles reasoning + execution autonomously

### Architecture

```
User → OpenAI Agent SDK → [Reasons + Acts autonomously] → Lambda → DB
```

The SDK manages the loop. You define tools; it handles execution.

### Pseudo Code

```python
from openai import OpenAI
from openai.agents import Agent, Tool

client = OpenAI()

# Define tools
def check_availability(date: str) -> dict:
    """Check available tennis court slots"""
    return invoke_lambda("check_availability", {"date": date})

def book_slot(slot_id: str, user_id: str) -> dict:
    """Book a specific slot"""
    return invoke_lambda("book_slot", {"slot_id": slot_id, "user_id": user_id})

# Create agent with tools
agent = Agent(
    name="BookingAgent",
    instructions="You help users book tennis courts. Check availability first, then book.",
    tools=[check_availability, book_slot]
)

# Run - SDK handles the loop autonomously
result = agent.run("Book me a court for tomorrow at 3pm")
print(result.final_output)
# Agent autonomously reasons, calls tools, loops until done
```

### Pros
- Clean, minimal code
- SDK handles complexity
- Good balance of power and simplicity

### Cons
- Less control than function call pattern
- Depends on SDK behavior

### When to Use
- Want agent capabilities without managing loops
- Trust SDK to handle execution
- Rapid prototyping

---

## Pattern E: OpenAI Workflow → Lambda (Workflow Style)

**Style:** Workflow — deterministic steps with AI reasoning within each step

### Architecture
```
User → OpenAI Workflow → [Step 1] → Lambda → [Step 2] → Lambda → Result
                            ↓           ↓
                        AI reasoning   AI reasoning
                        (constrained)  (constrained)
```

You define the sequence explicitly. AI handles reasoning **within** each step, but cannot change the step order. 

Note: Lambda is used as the execution example throughout. You can substitute with inline functions, HTTP services, or any callable.


### How It Differs from Agents

| Aspect | Agent (Pattern D) | Workflow (Pattern E) |
|--------|-------------------|----------------------|
| Step order | AI decides | **You define** |
| Can skip steps | Yes | No |
| Can reorder | Yes | No |
| AI role | Full autonomy | **Constrained per step** |

### Pseudo Code
```python
from agents import Agent

availability_agent = Agent(
    name="AvailabilityChecker",
    instructions="Extract date/time and check availability.",
    tools=[check_availability_lambda]
)

booking_agent = Agent(
    name="BookingAgent", 
    instructions="Book the selected slot.",
    tools=[book_slot_lambda]
)

@workflow
def booking_workflow(user_input: str):
    # Step 1: Always check availability first (deterministic)
    availability_result = availability_agent.run(user_input)
    
    # Custom logic between steps
    if not availability_result.slots:
        return "No slots available."
    
    # Step 2: Then book (deterministic order)
    confirmation = booking_agent.run(
        f"Book from: {availability_result.slots}"
    )
    return confirmation
```

### Pros
- **Predictable sequence** — you define step order explicitly
- **AI flexibility within steps** — handles ambiguity per step
- **Easier debugging** — know exactly which step failed
- **Custom logic between steps** — validation, logging, branching

### Cons
- Less flexible than full agents (can't dynamically reorder)
- Requires upfront workflow design
- May be overkill for simple cases

### When to Use
- Known step sequence, but need AI reasoning within each
- Want predictability of workflows + flexibility of agents
- Compliance or audit requirements need deterministic flow
- Need to add business logic between AI steps

---

## Pattern F: OpenAI Manager → Bedrock Sub-Agents (Multi-Agent)

**Style:** Multi-Agent — hierarchical delegation

### Architecture

```
User → Manager Agent (OpenAI) → [Decides which specialist]
                    ↓
        ┌──────────┴──────────┐
        ↓                     ↓
  Availability Agent     Booking Agent
     (Bedrock)             (Bedrock)
        ↓                     ↓
     Lambda                Lambda
        ↓                     ↓
       DB                    DB
```

Manager routes to specialists. Each specialist handles its domain:
- **Availability Agent** — handles `check_availability`
- **Booking Agent** — handles `book_slot`

### Pseudo Code

```python
from openai.agents import Agent

# Sub-agents (Bedrock-based specialists)
def invoke_availability_agent(task: str) -> str:
    """Delegate to availability specialist - checks open slots"""
    response = bedrock_agent.invoke(
        agent_id="availability-agent-id",
        input_text=task
    )
    return response["output"]

def invoke_booking_agent(task: str) -> str:
    """Delegate to booking specialist - reserves slots"""
    response = bedrock_agent.invoke(
        agent_id="booking-agent-id",
        input_text=task
    )
    return response["output"]

# Manager agent
manager = Agent(
    name="ManagerAgent",
    instructions="""
    You route user requests to the right specialist:
    - Checking availability → availability agent
    - Making a reservation → booking agent

    For a complete booking flow:
    1. First route to availability agent to get open slots
    2. Then route to booking agent to reserve the chosen slot

    Synthesize responses before returning to user.
    """,
    tools=[invoke_availability_agent, invoke_booking_agent]
)

# Run
result = manager.run("Book me a court for tomorrow at 3pm")
# Manager: calls availability agent → gets slots → calls booking agent → confirms
```

### Bedrock Sub-Agent Configurations

```python
# Availability Agent (Bedrock)
availability_agent_config = {
    "instruction": "You check tennis court availability. Return available slots.",
    "action_groups": [
        {
            "name": "AvailabilityActions",
            "lambda_arn": "arn:aws:lambda:...:availability-handler",
            "actions": [
                {
                    "name": "check_availability",
                    "description": "Check available slots for date/time",
                    "parameters": {
                        "date": "string",
                        "time": "string"
                    }
                }
            ]
        }
    ]
}

# Booking Agent (Bedrock)
booking_agent_config = {
    "instruction": "You book tennis court slots. Confirm reservations.",
    "action_groups": [
        {
            "name": "BookingActions",
            "lambda_arn": "arn:aws:lambda:...:booking-handler",
            "actions": [
                {
                    "name": "book_slot",
                    "description": "Reserve a specific slot",
                    "parameters": {
                        "slot_id": "string",
                        "user_id": "string"
                    }
                }
            ]
        }
    ]
}
```

### Pros
- Separation of concerns
- Each agent can be optimized for its domain
- Scales to complex systems

### Cons
- Higher complexity
- Multiple points of failure
- Cost (multiple agent invocations)

### When to Use
- Multiple distinct domains
- Need specialized agents per domain
- Building complex, enterprise-scale systems

---

## Pattern G: OpenAI Manager → Lambda-Wrapped Agents (Multi-Agent + Isolation)

**Style:** Multi-Agent — hierarchical delegation with agent isolation

### Architecture

```
User → OpenAI Manager → [Routes]
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Lambda A                Lambda B
(Availability Agent)    (Booking Agent)
    ↓                       ↓
Agent logic             Agent logic
(Bedrock)               (Claude)
    ↓                       ↓
   DB                      DB
```

Manager routes to Lambdas. Each Lambda wraps its own agent.

### Difference from Pattern E

| Aspect           | E: Direct              | F: Lambda-Wrapped        |
|------------------|------------------------|--------------------------|
| Manager calls    | Bedrock Agent directly | Lambda                   |
| Agent runs in    | Bedrock (managed)      | Lambda (your infra)      |
| Vendor mix       | Same vendor per agent  | Mix vendors freely       |
| Custom logic     | Before/after agent call| Full control per Lambda  |

### Pseudo Code

```python
from openai.agents import Agent

# Lambda A: Availability Agent (uses Bedrock)
# deployed as separate Lambda function
def availability_lambda_handler(event):
    task = event["task"]

    # Pre-processing (custom logic)
    task = sanitize_input(task)

    # Agent logic (Bedrock)
    response = bedrock_agent.invoke(
        agent_id="availability-agent-id",
        input_text=task
    )

    # Post-processing (custom logic)
    return format_availability_response(response["output"])

# Lambda B: Booking Agent (uses Claude)
def booking_lambda_handler(event):
    task = event["task"]

    # Agent logic (Claude)
    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{"role": "user", "content": task}],
        tools=[{
            "name": "book_slot",
            "description": "Reserve a tennis court slot",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slot_id": {"type": "string"},
                    "user_id": {"type": "string"}
                }
            }
        }]
    )

    # Execute tool if called
    if response.stop_reason == "tool_use":
        tool_result = db.book(
            response.content[1].input["slot_id"],
            response.content[1].input["user_id"]
        )
        return {"confirmation": tool_result}

    return response.content[0].text

# Manager agent — calls Lambdas, not agents directly
def invoke_availability_lambda(task: str) -> str:
    """Delegate to availability Lambda"""
    return lambda_client.invoke("availability-lambda", {"task": task})

def invoke_booking_lambda(task: str) -> str:
    """Delegate to booking Lambda"""
    return lambda_client.invoke("booking-lambda", {"task": task})

manager = Agent(
    name="ManagerAgent",
    instructions="""
    Route user requests to the right specialist Lambda:
    - Checking availability → availability Lambda
    - Making a reservation → booking Lambda

    For a complete booking:
    1. First call availability Lambda to get open slots
    2. Then call booking Lambda to reserve the chosen slot

    Synthesize responses before returning to user.
    """,
    tools=[invoke_availability_lambda, invoke_booking_lambda]
)

# Run
result = manager.run("Book me a court for tomorrow at 3pm")
```

### Pros
- Mix agent vendors (Bedrock for availability, Claude for booking)
- Full control over each agent's environment
- Add custom pre/post processing per agent
- Better isolation and independent scaling

### Cons
- Most complex to set up
- More infrastructure to manage
- Higher latency (Lambda cold starts + agent calls)

### When to Use
- Need to mix AI vendors per domain
- Require custom logic before/after each agent
- Want independent scaling/deployment per agent
- Enterprise systems with strict isolation requirements

---

## Side-by-Side Comparison

| Pattern | Style | Control | Complexity | Predictability | Cost |
| --- | --- | --- | --- | --- | --- |
| A | AI as Service(no agent) | Full | Low | High | Low |
| B | Agent | Low | Medium | Low | Medium |
| C | Function Call | High | Medium | Medium | Medium |
| D | Agent | Medium | Low | Low | Medium |
| E | Workflow | High | Medium | High | Medium |
| F | Multi-Agent | Low | High | Low | High |
| G | Multi-Agent | Medium | Highest | Low | High |


---
## Decision Guide

### The Spectrum
```
Control ←————————————————————————→ Autonomy

    A       C       E       D       B       F/G
    |       |       |       |       |        |
  Manual  Loop   Workflow  Agent  Managed  Multi-
  Code   Control  Steps    SDK    Agent    Agent
```

### When to Use What

**Choose Pattern A if:**
- Your workflow is fixed and predictable
- You only need AI for text generation
- You want maximum control and debuggability

**Choose Pattern B if:**
- You're AWS-native
- Need multi-step reasoning
- Want managed agent infrastructure

**Choose Pattern C if:**
- You need control between AI decisions
- Want to add custom validation per step
- Building vendor-agnostic solution

**Choose Pattern D if:**
- Want agent power with minimal code
- Trust SDK to manage execution
- Rapid development is priority

**Choose Pattern E if:**
- You have a known step sequence but need AI within each step
- Want predictability of workflows + flexibility of agents
- Need to add business logic between AI steps
- Compliance or audit requirements need deterministic flow

**Choose Pattern F if:**
- Multiple domains require specialists
- Building enterprise-scale system
- Can handle the complexity

**Choose Pattern G if:**
- Need to mix AI vendors (Bedrock + Claude + OpenAI)
- Require custom logic before/after each agent
- Want independent scaling per agent
- Strict isolation requirements

---

## Deeper Insight

### How AI's Role Evolves

| Pattern | AI Task |
|---------|---------|
| **A** | Discriminative only — parse, classify, extract |
| **B–G** | Discriminative + Generative — reason, plan, respond |

In Pattern A, AI just converts messy input to structured data. You could *theoretically* replace the LLM with a simpler NLU tool.

In Patterns B–G, the AI must **think**:
- "What's missing? I should ask."
- "Two slots available. I should present options."
- "Booking failed. I should explain and suggest alternatives."

This shift from **parsing** to **reasoning** is why agent patterns feel more powerful — but also less predictable.

### The Workflow Sweet Spot

Pattern E occupies a unique middle ground. It gives you:
- **Deterministic step order** (like A/C)
- **AI reasoning per step** (like D/B)
- **Custom logic between steps** (unique advantage)

When you need predictable sequences but still want AI flexibility within each step, Pattern E is your answer.

---

## Conclusion

There's no silver bullet. Start simple (A or C), add workflow structure when you need predictable sequences with AI flexibility (E), graduate to agents for full autonomy (B or D), and scale to multi-agent (F or G) only when complexity demands it.