---
title: "AI Orchestration Deep Dive: From No-Agent to Multi-Agent and Beyond"
og_image: /assets/images/ai-orchestration-cover.png
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

Explores eight architectural patterns, from AI as a service to workflows, and multi-agents and isolated agents.

## The Use Case

A tennis court booking system with two functions:

1. **check_availability** — Given date/time, return open slots
2. **book** — Reserve the selected slot, return confirmation

All 8 patterns implement these same 2 functions. The difference: **who decides which function to call and when**.

---

## Pattern A: AI as Service (No Agent)

**Style:** None — AI just generates/responds

**Runtime:** Shared

### Architecture

```
User → API Gateway → Lambda → LLM → Lambda → DB → User
```

You control everything. The LLM is just a text utility—no decision-making. It performs **discriminative tasks only**: parsing, classifying, extracting. The reasoning happens in your code.

### Pseudo Code

```python
from openai import OpenAI

client = OpenAI()

# Two functions: check_availability, book
def check_availability(date, time):
    return db.query_available_slots(date, time)

def book(slot_id, user_id):
    return db.reserve_slot(slot_id, user_id)


# Lambda handler - YOU control all logic
def handler(event):
    user_input = event["body"]
    session = get_session(event)  # your state store
    
    # Use LLM to parse natural language
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract intent and params. Return JSON: {intent, date, time, slot_id}"},
            {"role": "user", "content": user_input}
        ]
    )
    parsed = json.loads(response.choices[0].message.content)
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

**Key point:** LLM parses text. **Your code** decides which function to call.

### Handling Multi-Turn Conversations

What if booking requires multiple inputs: date, time, slot?

**You manage the state:**

```
User: "Book a court for tomorrow"
                ↓
             Lambda
                ├──→ LLM parse → {date: "2025-12-04", time: ?, slot: ?}
                ├──→ Check: missing time, slot
                ↓
System: "What time would you like?"

User: "3pm"
                ↓
             Lambda
                ├──→ LLM parse → {time: "15:00"}
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

Patterns B–G handle this more naturally.

### Pros

- Full control
- Predictable behavior
- Easy to debug

### Cons

- Rigid — every flow must be coded
- No reasoning capability
- Multi-turn conversations require manual state management

### When to Use

- Fixed, predictable workflows
- AI only needed for text parsing/formatting
- You want full control over logic
- Single-turn or simple interactions

---

## Pattern B: Workflow (Shared Runtime)

**Style:** Workflow — Predefined sequence of steps

**Runtime:** Shared — all steps run in one process

### Architecture

```
User → Step 1 → Step 2 → Step 3 → Response
         │        │        │
         ↓        ↓        ↓
        LLM      LLM      LLM
      (any)    (any)    (any)
```

Steps execute in a **predefined order**. No dynamic routing — the sequence is fixed. Each step can use any LLM vendor for its specific task.

### Difference from AI as Service (Pattern A)

| Pattern A (AI as Service) | Pattern B (Workflow) |
|---------------------------|----------------------|
| Single LLM call for parsing | Multiple steps, each can use LLM |
| You code the state machine | Steps are clearly separated |
| All logic intertwined | Each step is isolated and testable |

### Pseudo Code

```python
from openai import OpenAI
import anthropic

openai_client = OpenAI()
claude_client = anthropic.Anthropic()

# Step 1: Parse input (using OpenAI)
def parse_input(user_input: str) -> dict:
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": """
                Extract booking details from user input.
                Return JSON: {date, time, preferences}
                If information is missing, set as null.
            """},
            {"role": "user", "content": user_input}
        ]
    )
    return json.loads(response.choices[0].message.content)


# Step 2: Check availability (direct DB call)
def get_availability(parsed: dict) -> list:
    slots = db.query_slots(parsed["date"], parsed.get("time"))
    return slots


# Step 3: Select best slot (using Claude)
def select_slot(slots: list, preferences: dict) -> dict:
    response = claude_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Select the best slot based on preferences. Slots: {slots}, Preferences: {preferences}. Return JSON: {{slot_id, reason}}"
        }]
    )
    return json.loads(response.content[0].text)


# Step 4: Make booking (direct DB call)
def make_booking(slot_id: str, user_id: str) -> dict:
    return db.reserve(slot_id, user_id)


# Step 5: Generate confirmation (using OpenAI)
def generate_confirmation(booking: dict) -> str:
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Generate a friendly booking confirmation message."},
            {"role": "user", "content": f"Booking details: {booking}"}
        ]
    )
    return response.choices[0].message.content


# Workflow: Fixed sequence
def booking_workflow(user_input: str, user_id: str) -> str:
    # Step 1: Parse (OpenAI)
    parsed = parse_input(user_input)
    
    # Step 2: Check availability (DB)
    slots = get_availability(parsed)
    
    if not slots:
        return "Sorry, no slots available for that date/time."
    
    # Step 3: Select best slot (Claude)
    selection = select_slot(slots, parsed.get("preferences", {}))
    
    # Step 4: Book (DB)
    booking = make_booking(selection["slot_id"], user_id)
    
    # Step 5: Confirm (OpenAI)
    return generate_confirmation(booking)


# Run
response = booking_workflow("Book me a court for tomorrow at 3pm", "user-123")
```

### Pros

- Predictable execution flow
- Easy to debug (fixed sequence)
- Each step is isolated and testable
- Simple to understand
- Custom logic between steps
- Can use multiple AI vendors in same workflow

### Cons

- Inflexible — can't skip steps
- May be inefficient for simple queries
- Must handle all cases in predefined flow

### When to Use

- Well-defined, sequential processes
- Compliance/audit requirements (need to know exact flow)
- Each step has clear input/output
- Predictability over flexibility

---

## Pattern C: Workflow (Independent Runtime)

**Style:** Workflow — Predefined sequence of steps

**Runtime:** Independent — each step runs in its own service

### Architecture

```
User → Service 1 → Service 2 → Service 3 → Response
          │           │           │
          ↓           ↓           ↓
       Agent A     Agent B     Agent C
       (any vendor)
```

Same predefined sequence as Pattern B, but each step runs in its own service (Lambda, container, etc.). Enables independent deployment and scaling.

### Difference from Pattern B

| Pattern B (Shared Runtime) | Pattern C (Independent Runtime) |
|----------------------------|--------------------------------|
| All steps in one process | Each step in its own service |
| Deploy together | Deploy independently |
| Shared memory | Pass data via events/API |
| Fast | Network latency |
| Single failure point | Step failure is isolated |

### Pseudo Code

```python
# Service 1: Parse Input (using OpenAI)
# Deployed as Lambda, container, or separate service
def parse_service_handler(event):
    user_input = event["input"]
    
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract booking details. Return JSON: {date, time, preferences}"},
            {"role": "user", "content": user_input}
        ]
    )
    
    return {"parsed": json.loads(response.choices[0].message.content)}


# Service 2: Check Availability (using Claude)
# Deployed separately
def availability_service_handler(event):
    parsed = event["parsed"]
    
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{
            "role": "user",
            "content": f"Check availability for: {parsed}"
        }],
        tools=[{
            "name": "check_availability",
            "description": "Check available slots for date/time",
            "input_schema": {
                "type": "object",
                "properties": {
                    "date": {"type": "string"},
                    "time": {"type": "string"}
                },
                "required": ["date"]
            }
        }]
    )
    
    # Execute tool and return
    if response.stop_reason == "tool_use":
        tool_input = response.content[1].input
        slots = db.query_slots(tool_input["date"], tool_input.get("time"))
        return {"available_slots": slots}
    
    return {"available_slots": []}


# Service 3: Book Slot (using Bedrock)
# Deployed separately
def booking_service_handler(event):
    slots = event["available_slots"]
    user_id = event["user_id"]
    
    if not slots:
        return {"error": "No slots available"}
    
    # Use Bedrock to select best slot
    bedrock = boto3.client("bedrock-runtime")
    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [{
                "role": "user",
                "content": f"Select the best slot from: {slots}. Return JSON: {{slot_id}}"
            }]
        })
    )
    
    result = json.loads(response["body"].read())
    selected = json.loads(result["content"][0]["text"])
    
    # Execute booking
    booking = db.reserve(selected["slot_id"], user_id)
    return {"confirmation": booking}


# Orchestrator (Step Functions, or simple coordinator service)
def workflow_orchestrator(user_input: str, user_id: str) -> str:
    # Step 1: Call parse service
    parsed = invoke_service("parse-service", {"input": user_input})
    
    # Step 2: Call availability service
    availability = invoke_service("availability-service", parsed)
    
    # Step 3: Call booking service
    result = invoke_service("booking-service", {**availability, "user_id": user_id})
    
    return result["confirmation"]
```

### Pros

- Step failure doesn't crash the whole flow
- Can deploy/update steps independently
- Mix AI vendors freely per step
- Better for large teams (each team owns a step)
- Custom pre/post processing per step
- Easier to debug (isolate which step failed)

### Cons

- More infrastructure to manage
- Network latency between steps
- Data passing overhead
- More complex deployment and monitoring

### When to Use

- Steps have different scaling requirements
- Want independent deployment per step
- Large team with ownership boundaries
- Compliance requires step-level isolation

---

## Pattern D: Function Calling (You Control the Loop)

**Style:** Function Call — LLM suggests, YOU execute and control loop

**Runtime:** Shared

### Architecture

```
User → Your Code → OpenAI SDK → [suggests function] → Your Code → DB
            ↑______________________ you decide next step ___________|
```

OpenAI SDK suggests which function to call. You execute it and decide what happens next.

### Difference from Workflow (Pattern B/C)

| Workflow (B, C) | Function Calling (D) |
|-----------------|----------------------|
| You define the sequence | LLM suggests which function |
| Fixed steps, always same order | Dynamic based on context |
| Predictable | More flexible |
| No loop | Loop until LLM says "done" |

### How the Loop Works

```
User: "Book a court for tomorrow at 3pm"

Loop 1:
┌─────────────────────────────────────────────────────────────┐
│ messages = [{role: "user", content: "Book a court..."}]     │
│                          ↓                                  │
│ OpenAI SDK (with tools defined)                             │
│                          ↓                                  │
│ Response: tool_calls = [{name: "check_availability",        │
│                          args: {date: "2025-12-04"}}]       │
│                          ↓                                  │
│ Has tool_calls? YES → YOU execute check_availability()      │
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
│ OpenAI SDK (sees availability result)                       │
│                          ↓                                  │
│ Response: tool_calls = [{name: "book_slot",                 │
│                          args: {slot_id: "A"}}]             │
│                          ↓                                  │
│ Has tool_calls? YES → YOU execute book_slot()               │
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
│ OpenAI SDK (sees booking confirmed)                         │
│                          ↓                                  │
│ Response: tool_calls = None                                 │
│           content = "Your court is booked for..."           │
│                          ↓                                  │
│ Has tool_calls? NO → return content → EXIT LOOP             │
└─────────────────────────────────────────────────────────────┘
```

**Who controls what:**

| What | Who |
| --- | --- |
| Which function to call | LLM suggests |
| Actually calling the function | **You** |
| Continue or stop loop | **You** |
| What to do with result | **You** |

### Pseudo Code

```python
from openai import OpenAI

client = OpenAI()

# Your functions - direct DB calls
def check_availability(date: str, time: str = None) -> dict:
    return db.query_slots(date, time)

def book_slot(slot_id: str, user_id: str) -> dict:
    return db.reserve(slot_id, user_id)

# YOU control the loop
def handle_booking_request(user_input: str, user_id: str) -> str:
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
                        "date": {"type": "string"},
                        "time": {"type": "string"}
                    },
                    "required": ["date"]
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
                    },
                    "required": ["slot_id"]
                }
            }
        }
    ]
    
    # Loop controlled by YOU
    while True:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools
        )
        
        msg = response.choices[0].message
        
        # No function call? Done.
        if not msg.tool_calls:
            return msg.content
        
        # Process each tool call
        messages.append(msg)
        
        for tool_call in msg.tool_calls:
            fn_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            
            # YOU execute the function directly
            if fn_name == "check_availability":
                result = check_availability(args["date"], args.get("time"))
            elif fn_name == "book_slot":
                result = book_slot(args["slot_id"], user_id)
            else:
                result = {"error": "Unknown function"}
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result)
            })
        
        # Loop continues until LLM returns no tool_calls
```

### Pros

- More flexible than fixed workflows
- LLM can adapt to different user intents
- Can add validation/logging between steps
- You still control execution

### Cons

- Less predictable than workflows
- More code to write
- You manage the loop logic

### When to Use

- User intents vary and can't be fixed to one sequence
- Need flexibility but want to keep control
- Want to add custom validation/logic per step
- Building vendor-agnostic solution

---

## Pattern E: Single Agent

**Style:** Agent — Autonomous reasoning + execution

**Runtime:** Shared

### Architecture

```
User → Agent → [Reasons + Acts autonomously] → DB
         ↑_____________ loops until done _______|
```

The agent manages the loop autonomously. You define tools and instructions; it decides what to do and when to stop.

This pattern uses the **OpenAI Agents SDK** (not the basic OpenAI SDK used in Patterns A–D).

### Difference from Function Calling (Pattern D)

| Pattern D (Function Calling) | Pattern E (Single Agent) |
|------------------------------|--------------------------|
| You control the loop | Agent controls the loop |
| You decide when to stop | Agent decides when done |
| More control | More autonomous |
| `openai` library | `openai-agents` library |

### Difference from Workflow (Pattern B/C)

| Workflow (B, C) | Single Agent (E) |
|-----------------|------------------|
| Fixed step sequence | Agent decides order |
| Always runs all steps | May skip steps |
| Predictable | Flexible |
| You define flow | Agent reasons about flow |

### Pseudo Code

```python
from agents import Agent, Runner, function_tool

# Define tools using decorators
@function_tool
def check_availability(date: str, time: str = None) -> dict:
    """Check available tennis court slots for a given date and optional time."""
    return db.query_slots(date, time)

@function_tool
def book_slot(slot_id: str, user_id: str) -> dict:
    """Book a specific tennis court slot."""
    return db.reserve(slot_id, user_id)

# Create agent with tools
agent = Agent(
    name="BookingAgent",
    instructions="""
    You help users book tennis courts.
    
    When a user wants to book:
    1. First check availability for their requested date/time
    2. Present available options
    3. Book their chosen slot
    4. Confirm the booking
    
    Always be helpful and confirm details before booking.
    """,
    tools=[check_availability, book_slot]
)

# Run - Agent handles the loop autonomously
result = Runner.run(agent, "Book me a court for tomorrow at 3pm")
print(result.final_output)
# Agent autonomously: reasons → calls tools → loops → responds
```

### How it works internally

```
User: "Book me a court for tomorrow at 3pm"
                    ↓
            Agent receives input
                    ↓
    ┌──────────────────────────────────┐
    │         Agent Loop               │
    │  ┌─────────────────────────────┐ │
    │  │ 1. Reason: "Need to check   │ │
    │  │    availability first"      │ │
    │  │ 2. Call: check_availability │ │
    │  │ 3. Observe: slots A, B, C   │ │
    │  │ 4. Reason: "Should book     │ │
    │  │    slot A at 3pm"           │ │
    │  │ 5. Call: book_slot          │ │
    │  │ 6. Observe: confirmed       │ │
    │  │ 7. Reason: "Done, respond"  │ │
    │  └─────────────────────────────┘ │
    └──────────────────────────────────┘
                    ↓
        "Your court is booked! Court A, 
         tomorrow at 3pm. Confirmation #123"
```

### Pros

- Clean, minimal code
- Agent handles complexity
- Good balance of power and simplicity
- Handles multi-turn naturally

### Cons

- Less control than Pattern D
- Depends on agent framework behavior
- Less predictable execution path

### When to Use

- Want agent capabilities without managing loops
- Trust the agent framework to handle execution
- Rapid prototyping
- Simple to moderately complex tasks

---

## Pattern F: Multi-Agent (Shared Runtime)

**Style:** Multi-Agent — Manager routes dynamically to specialists

**Runtime:** Shared — all agents run in one process

### Architecture

```
User → Manager Agent → [Decides which specialist]
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Availability Agent      Booking Agent
    ↓                       ↓
   DB                      DB
```

Manager **dynamically decides** which specialist to call based on user input. All agents run in the same process.

### Difference from Single Agent (Pattern E)

| Single Agent (E) | Multi-Agent (F) |
|------------------|-----------------|
| One agent, multiple tools | Multiple specialized agents |
| Agent does everything | Agents have focused domains |
| Simpler | Better separation of concerns |

### Difference from Workflow (Pattern B/C)

| Workflow (B, C) | Multi-Agent (F, G) |
|-----------------|-------------------|
| Fixed: Step 1 → 2 → 3 | Dynamic: Manager decides |
| Always runs all steps | May skip agents |
| Predictable | Flexible |

### Pseudo Code

```python
from agents import Agent, Runner, function_tool

# --- Tool definitions ---

@function_tool
def check_availability(date: str, time: str = None) -> dict:
    """Check available tennis court slots."""
    return db.query_slots(date, time)

@function_tool
def book_slot(slot_id: str, user_id: str) -> dict:
    """Book a specific slot."""
    return db.reserve(slot_id, user_id)

# --- Specialist Agents ---

availability_agent = Agent(
    name="AvailabilityAgent",
    instructions="""
    You are a specialist in checking tennis court availability.
    Use the check_availability tool to find open slots.
    Return a clear summary of available options.
    """,
    tools=[check_availability]
)

booking_agent = Agent(
    name="BookingAgent",
    instructions="""
    You are a specialist in booking tennis courts.
    Use the book_slot tool to reserve courts.
    Always confirm the booking details.
    """,
    tools=[book_slot]
)

# --- Handoff functions ---

@function_tool
def handoff_to_availability(task: str) -> str:
    """Delegate to availability specialist for checking open slots."""
    result = Runner.run(availability_agent, task)
    return result.final_output

@function_tool
def handoff_to_booking(task: str) -> str:
    """Delegate to booking specialist for reserving a slot."""
    result = Runner.run(booking_agent, task)
    return result.final_output

# --- Manager Agent ---

manager_agent = Agent(
    name="ManagerAgent",
    instructions="""
    You are a manager that routes user requests to specialists.
    
    Available specialists:
    - Availability specialist: for checking open slots
    - Booking specialist: for reserving slots
    
    For a complete booking:
    1. First handoff to availability specialist
    2. Then handoff to booking specialist
    
    Synthesize responses before returning to user.
    """,
    tools=[handoff_to_availability, handoff_to_booking]
)

# --- Run ---

result = Runner.run(manager_agent, "Book me a court for tomorrow at 3pm")
print(result.final_output)
# Manager: analyzes → hands off to availability → hands off to booking → responds
```

### Pros

- Flexible routing based on user intent
- Specialists can be optimized per domain
- Manager handles complex multi-step requests
- Single codebase, easy debugging

### Cons

- Less predictable than workflow
- One crash affects all agents
- Single process limits

### When to Use

- User requests vary significantly
- Need dynamic decision-making
- Want simple deployment
- Moderate complexity

---

## Pattern G: Multi-Agent (Independent Runtime)

**Style:** Multi-Agent — Manager routes dynamically to specialists

**Runtime:** Independent — each agent runs in its own service

### Architecture

```
User → Manager Agent → [Routes dynamically]
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Service A               Service B
(Availability Agent)    (Booking Agent)
    ↓                       ↓
Agent logic             Agent logic
(any vendor)            (any vendor)
    ↓                       ↓
   DB                      DB
```

Manager routes to separate services. Each service wraps its own agent with full isolation.

### Difference from Pattern F

| Pattern F (Shared Runtime) | Pattern G (Independent Runtime) |
|----------------------------|--------------------------------|
| All agents in one process | Each agent in its own service |
| Single vendor typically | Mix vendors freely |
| Shared memory | Pass data via API |
| Fast | Network latency |
| One crash affects all | Failures are isolated |

### Pseudo Code

```python
from agents import Agent, Runner, function_tool

# --- Service A: Availability Agent (uses OpenAI) ---
# Deployed as separate service
def availability_service_handler(event):
    task = event["task"]
    
    # Pre-processing (custom logic)
    task = sanitize_input(task)
    
    @function_tool
    def check_availability(date: str, time: str = None) -> dict:
        """Check available slots."""
        return db.query_slots(date, time)
    
    agent = Agent(
        name="AvailabilityAgent",
        instructions="Check tennis court availability. Return available slots.",
        tools=[check_availability]
    )
    
    result = Runner.run(agent, task)
    
    # Post-processing (custom logic)
    return format_response(result.final_output)


# --- Service B: Booking Agent (uses Claude) ---
# Deployed as separate service
def booking_service_handler(event):
    task = event["task"]
    user_id = event["user_id"]
    
    client = anthropic.Anthropic()
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="You book tennis court slots. Extract slot_id and confirm booking.",
        messages=[{"role": "user", "content": task}],
        tools=[{
            "name": "book_slot",
            "description": "Reserve a tennis court slot",
            "input_schema": {
                "type": "object",
                "properties": {
                    "slot_id": {"type": "string"}
                },
                "required": ["slot_id"]
            }
        }]
    )
    
    # Execute tool if called
    if response.stop_reason == "tool_use":
        tool_input = response.content[1].input
        booking = db.reserve(tool_input["slot_id"], user_id)
        return {"confirmation": booking}
    
    return {"message": response.content[0].text}


# --- Manager Agent (calls services) ---

@function_tool
def invoke_availability_agent(task: str) -> str:
    """Delegate to availability service for checking slots."""
    response = invoke_service("availability-service", {"task": task})
    return response

@function_tool  
def invoke_booking_agent(task: str, user_id: str) -> str:
    """Delegate to booking service for reserving a slot."""
    response = invoke_service("booking-service", {"task": task, "user_id": user_id})
    return response

manager = Agent(
    name="ManagerAgent",
    instructions="""
    Route user requests to specialist services:
    - Checking availability → invoke_availability_agent
    - Making a reservation → invoke_booking_agent
    
    For a complete booking:
    1. First call availability agent
    2. Then call booking agent with the chosen slot
    
    Synthesize responses before returning to user.
    """,
    tools=[invoke_availability_agent, invoke_booking_agent]
)

# Run
result = Runner.run(manager, "Book me a court for tomorrow at 3pm")
print(result.final_output)
```

### Pros

- Mix AI vendors per agent (OpenAI, Claude, Bedrock, Mistral)
- Full isolation (one agent fails independently)
- Custom pre/post processing per agent
- Independent deployment and scaling

### Cons

- Most complex to build
- Network latency
- More infrastructure to manage
- Higher operational overhead

### When to Use

- Need to mix AI vendors per domain
- Strict isolation required (compliance, security)
- Different agents need different resources
- Enterprise / production systems

---

## Pattern H: Bedrock Agent (AWS Managed)

**Style:** Agent — AWS-managed reasoning + action loop

**Runtime:** Managed — AWS handles everything

This pattern is an **AWS-native alternative** to Pattern E (Single Agent). Instead of managing the agent yourself, AWS Bedrock handles everything.

### Architecture

```
User → Bedrock Agent → [Decides] → Lambda (Action Group) → DB
                     ↑___________ observes result ___________|
```

Bedrock Agent reasons about what to do, picks actions, executes, and loops until done.

### Pseudo Code

```python
import boto3

# Agent definition (configured in Bedrock console or via API)
agent_config = {
    "agentName": "TennisBookingAgent",
    "instruction": """
    You help users book tennis courts.
    
    When a user wants to book:
    1. Check availability for their requested date/time
    2. Present options
    3. Book their chosen slot
    4. Confirm the booking
    """,
    "foundationModel": "anthropic.claude-3-sonnet-20240229-v1:0",
    "actionGroups": [
        {
            "actionGroupName": "BookingActions",
            "actionGroupExecutor": {
                "lambda": "arn:aws:lambda:...:booking-handler"
            },
            "apiSchema": {
                "actions": [
                    {
                        "name": "check_availability",
                        "description": "Check available tennis court slots",
                        "parameters": {
                            "date": {"type": "string", "required": True},
                            "time": {"type": "string", "required": False}
                        }
                    },
                    {
                        "name": "book_slot",
                        "description": "Book a specific slot",
                        "parameters": {
                            "slot_id": {"type": "string", "required": True},
                            "user_id": {"type": "string", "required": True}
                        }
                    }
                ]
            }
        }
    ]
}


# Lambda handles the actual DB work
def booking_handler(event):
    action = event["actionGroup"]["name"]
    params = event["parameters"]
    
    if action == "check_availability":
        return db.query_slots(params["date"], params.get("time"))
    elif action == "book_slot":
        return db.reserve(params["slot_id"], params["user_id"])


# Invocation - agent handles the rest
bedrock_agent = boto3.client("bedrock-agent-runtime")

response = bedrock_agent.invoke_agent(
    agentId="your-agent-id",
    agentAliasId="your-alias-id",
    sessionId="user-session-123",
    inputText="Book me a court for tomorrow at 3pm"
)

# Agent autonomously: checks availability → picks slot → books → confirms
for event in response["completion"]:
    if "chunk" in event:
        print(event["chunk"]["bytes"].decode())
```

### Pros

- Fully managed — AWS handles scaling, reasoning loop
- Built-in session management
- Integrates with AWS ecosystem (CloudWatch, IAM, etc.)
- Knowledge bases and guardrails available
- No agent framework code to maintain

### Cons

- AWS vendor lock-in
- Less control over agent behavior
- Debugging through AWS console
- Latency can be higher
- Limited customization of agent loop

### When to Use

- Already AWS-native infrastructure
- Want fully managed solution
- Need built-in AWS integrations
- Team familiar with AWS services

### Comparison with Pattern E

| Aspect | Pattern E (Single Agent) | Pattern H (Bedrock) |
|--------|--------------------------|---------------------|
| Control | You own the code | AWS manages |
| Vendor | Any (OpenAI, Claude SDK, etc.) | AWS only |
| Debugging | Your logs, your tools | AWS Console/CloudWatch |
| Scaling | You manage | AWS manages |
| Cost model | Pay per API call | Pay per agent invocation |
| Customization | Full control | Limited to Bedrock features |

---

## Side-by-Side Comparison

| Pattern | Style | Who Decides Flow | Runtime | Complexity |
|---------|-------|------------------|---------|------------|
| A | No Agent | You | Shared | Low |
| B | Workflow | You (fixed steps) | Shared | Medium |
| C | Workflow | You (fixed steps) | Independent | Medium-High |
| D | Function Call | LLM suggests, you execute | Shared | Medium |
| E | Single Agent | Agent | Shared | Low |
| F | Multi-Agent | Manager Agent | Shared | Medium |
| G | Multi-Agent | Manager Agent | Independent | High |
| H | Bedrock Agent | AWS | Managed | Low-Medium |

**Runtime explained:**
- **Shared** — All runs together in one process
- **Independent** — Each step/agent runs in its own service
- **Managed** — Cloud provider handles it

---

## Decision Guide

```
Do you need AI to make decisions (not just parse)?
       │
       No → Pattern A (AI as Service)
       │
       Yes
       │
Do you want AWS to manage everything? → Yes → Pattern H (Bedrock Agent)
       │
       No
       │
Is the flow predictable (fixed sequence)?
       │
       Yes → Need independent scaling/deployment? → No  → Pattern B (Workflow, Shared)
       │                                          → Yes → Pattern C (Workflow, Independent)
       │
       No (dynamic flow needed)
       │
Do you want to control the loop yourself?
       │
       Yes → Pattern D (Function Calling)
       │
       No (let agent handle it)
       │
Do you need multiple specialized agents?
       │
       No → Pattern E (Single Agent)
       │
       Yes → Need independent scaling/deployment? → No  → Pattern F (Multi-Agent, Shared)
                                                  → Yes → Pattern G (Multi-Agent, Independent)
```

### Quick Reference

| If you need... | Use Pattern |
|----------------|-------------|
| Full control, AI just parses | A |
| Fixed steps, shared runtime | B |
| Fixed steps, independent runtime | C |
| LLM suggests functions, you control loop | D |
| Autonomous agent, minimal code | E |
| Dynamic routing, shared runtime | F |
| Dynamic routing, independent runtime | G |
| AWS-managed agent | H |

### The Spectrum

```
Control ←————————————————————————————————→ Autonomy

    A       B       C       D       E       F       G
    │       │       │       │       │       │       │
    No   Workflow Workflow Function Agent  Multi   Multi
   Agent (Shared) (Indep.) Calling        Agent   Agent
    │       │       │       │       │       │       │
   You    Fixed   Fixed    LLM    Agent  Manager Manager
  control steps   steps  suggests controls routes  routes
   all   (shared) (indep.) you loop  loop
                           control

                        H
                        │
                    Bedrock
                    (AWS Managed)
```

---

## Conclusion

There's no silver bullet. The right pattern depends on:

- **How much control do you need?**
- **Is the flow predictable or dynamic?**
- **Do you need independent scaling/deployment?**
- **How complex is your system?**
- **What's your tolerance for unpredictability?**

### The Workflow Sweet Spot

Patterns B and C (Workflow) occupy a unique middle ground:

| What you get | Comparable to |
|--------------|---------------|
| Deterministic step order | Like A (AI as Service) |
| AI reasoning within each step | Like E (Single Agent) |
| Custom logic between steps | Unique to Workflow |

When you need **predictable sequences** but still want **AI flexibility within each step**, Workflow patterns are your answer.

This is why many production systems start with Workflow (B/C) rather than jumping straight to autonomous agents (D/E/F/G) — you get AI power with predictable behavior.

### How AI's Role Evolves

Notice how AI's job changes across patterns:

| Pattern | AI Task |
|---------|---------|
| **A** | Discriminative only — parse, classify, extract |
| **B–H** | Discriminative + Generative — reason, plan, respond |

In Pattern A, you could *theoretically* replace the LLM with a simpler NLU tool (though multilingual inputs make LLM worthwhile). The AI just converts messy input to structured data.

In Patterns B–H, the AI must **think**:

- "What's missing? I should ask."
- "Two slots available. I should present options."
- "Booking failed. I should explain and suggest alternatives."

This shift from **parsing** to **reasoning** is why agent patterns feel more powerful — but also less predictable.

### Progression Path

Start simple, evolve as needed:

```
A (No Agent)
  ↓ need multi-step with AI
B (Workflow, Shared) — fixed steps, simple deployment
C (Workflow, Independent) — fixed steps, need scaling/isolation
  ↓ need dynamic flow
D (Function Calling) — LLM suggests, you control loop
E (Single Agent) — agent controls the loop
  ↓ need specialized agents
F (Multi-Agent, Shared) — manager routes, simple deployment
G (Multi-Agent, Independent) — enterprise scale, full isolation
  
H (Bedrock) — AWS alternative to E
```

**Start simple, add complexity only when the problem demands it.**