---
title: Programmatic vs Conceptual Expression in Prompts - Which Should You Use?
tags:
  - LLM
  - Prompt engineering
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

LLMs aren't compilers. Writing prompts like code makes them work harder, not smarter.

When writing prompts, you face a choice: should you write instructions like code (programmatic) or like concepts (conceptual)?

Here's what I mean:

**Programmatic**: "If field has options, value must be one of options, else leave empty"

**Conceptual**: "Match the extracted value to the closest available option when applicable"

Which one works better? The answer isn't what I expected.

## A Real Example

I was building a system to extract structured data from user messages. Here's how the two approaches looked:

### Programmatic Style

```text
Instructions:
1. Parse user_input
2. For each field in available_fields:
   a. Extract value based on field.instruction
   b. If field.options exists:
      - Match extracted value to one option
      - If no match, set to null
   c. If field.options does not exist:
      - Use extracted value directly
3. Return JSON with all fields
```

### Conceptual Style

```text
Your task is to understand the user's intent and extract relevant information.
For each field, identify the corresponding information from the input.
When a field has predefined options, choose the most appropriate match.
When a field is open-ended, extract the value as expressed by the user.
```

## What Happened?

The programmatic version failed more often. Why?

LLMs aren't compilers. They don't execute instructions step-by-step. They predict patterns based on training.

When you write programmatic instructions, you're asking the model to:
1. Parse your pseudo-code
2. Translate it to internal logic
3. Execute that logic
4. Generate output

That's three extra steps where errors can creep in.

The conceptual version worked better because it aligns with how models actually work: pattern matching and semantic understanding.

## The Theory: Dual Process Theory

Cognitive science describes two types of thinking:

**System 1 (Fast, Intuitive)**
- Pattern recognition
- Automatic responses
- Handles familiar tasks

**System 2 (Slow, Deliberate)**
- Logical reasoning
- Step-by-step processing
- Handles novel problems

LLMs excel at System 1 tasks. They're trained on vast patterns and recognize semantic relationships instantly. But they struggle with System 2 tasks that require precise logical execution.

Programmatic prompts demand System 2 thinking. Conceptual prompts leverage System 1 strength.

## When to Use Each

### Use Conceptual When:

**The task involves understanding**

```text
❌ Programmatic: "If sentiment_score > 0.5, classify as positive"
✅ Conceptual: "Determine if the overall tone is positive or negative"
```

**The task requires context**

```text
❌ Programmatic: "Extract person_name from position index 0 to first comma"
✅ Conceptual: "Identify the person's name from the message"
```

**The output needs flexibility**

```text
❌ Programmatic: "Return array of strings, max length 50 chars each"
✅ Conceptual: "List the key points briefly"
```

### Use Programmatic When:

**You need exact format**

```text
✅ Programmatic: "Return JSON: {\"status\": \"success\" | \"failure\", \"count\": number}"
❌ Conceptual: "Provide the result in a structured format"
```

**Boundaries are strict**

```text
✅ Programmatic: "Date format must be YYYY-MM-DD"
❌ Conceptual: "Use a standard date format"
```

**Values come from a fixed set**

```text
✅ Programmatic: "Status must be one of: pending, approved, rejected"
❌ Conceptual: "Choose an appropriate status"
```

## The Hybrid Approach

In practice, the best prompts mix both:

```text
You are extracting booking information from user messages.

Fields to extract:
- guest_name: the person making the booking
- check_in_date: when they arrive (format: YYYY-MM-DD)
- room_type: must be one of [single, double, suite]
- special_requests: any additional needs they mention

Understand the context to identify the right information.
Match room preferences to the available room types.
If information is missing, omit that field from the response.
```

This works because:
- Conceptual language describes the task (understanding, identifying)
- Programmatic constraints define the output (format, fixed values)
- The model uses its strengths while staying within bounds

## Why This Matters

Getting this wrong wastes tokens and reduces accuracy:

**Bad**: 200 tokens of if-then-else logic the model struggles to follow

**Good**: 50 tokens of clear concepts with format constraints

The model spends less "effort" interpreting instructions and more on the actual task.

## Simple Rules

1. **Describe the goal, not the algorithm**
   - Say what you want, not how to compute it

2. **Use programmatic syntax only for output structure**
   - Format, schema, required fields

3. **Let the model use its training**
   - It knows what "sentiment" means
   - It can identify "names" without regex

4. **Be precise about boundaries, vague about process**
   - Precise: "exactly 3 items"
   - Vague: "find the most relevant items"

## Real Impact

When I switched from programmatic to conceptual descriptions with programmatic constraints:

- Token usage: ↓ 30%
- Accuracy: ↑ 15%
- Edge case handling: Much better

The model stopped trying to "execute" my pseudo-code and started doing what it does best: understanding and extracting meaning.

## Wrapping Up

The key insight:

> LLMs are semantic engines, not interpreters. Write prompts that work with their nature, not against it.

Use concepts for tasks. Use constraints for outputs.

Next time you're writing a prompt, ask:

"Am I describing what I want, or how to compute it?"

If it's the latter, you're probably making the model work harder than it needs to.

Keep the concepts clear. Keep the constraints tight. Let the model do what it's trained for.
