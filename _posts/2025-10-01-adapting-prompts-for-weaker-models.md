---
title: Adapting Prompts for Weaker Models - Using Engineering to Reduce Complexity
tags:
  - LLM
  - Prompt engineering
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

When working with LLMs, we often prototype with powerful models like GPT-4 or Claude Sonnet. But production reality hits: cost, latency, or infrastructure constraints force us to use weaker models. The challenge? Your carefully crafted prompt that worked beautifully with a frontier model now produces inconsistent or incorrect results.

The solution isn't always to throw more examples at it or make the prompt longer. Sometimes, the answer is to use engineering principles to reduce complexity and make the task easier for the model to handle.

## The Problem: Context-Dependent Logic

Here's a real example I encountered. I was building an intent extraction system that needed to handle two different scenarios:

1. **Known Intent Flow**: User already has a current intent, and we're checking if they explicitly want to switch to a different intent
2. **Unknown Intent Flow**: User hasn't specified an intent yet, and we need to infer the best match from their input

With a powerful model, I could describe both scenarios in a single prompt and let the model figure out which logic to apply. But when I moved to a weaker model, it started confusing the two flows, applying the wrong matching logic at the wrong time.

## The Engineering Solution: Conditional Prompt Selection

Instead of asking the model to handle conditional logic, I moved that complexity into the code layer:

```java
final var knownIntentMappingInstructions = """
    extracted_intent extracting rule for known intent
    """;

final var unknownIntentMappingInstructions = """
    extracted_intent extracting rule for unknown intent
    """;

messages.add(UserMessage.from("intent_mapping_instructions",
    "unknown_intent".equals(currentIntent)
        ? unknownIntentMappingInstructions
        : knownIntentMappingInstructions));
```

## What Changed?

The key insight: **move conditional complexity from the prompt to the code**.

**Before (Complex for Weaker Models):**
- Single prompt explaining both scenarios
- Model must interpret current state
- Model must choose appropriate matching logic
- Higher cognitive load = more errors

**After (Simplified for Weaker Models):**
- Two distinct, focused prompts
- Code handles state detection
- Model receives only relevant instructions
- Lower cognitive load = more consistent results

## The Core Principle: Engineering Over Intelligence

This approach embodies a fundamental principle in production LLM systems:

> When a weaker model struggles with complexity, don't add more explanation—reduce the problem space.

Instead of making the model smarter, make the task simpler:

1. **Identify conditional logic** in your prompts
2. **Move decisions to code** when possible
3. **Give the model single-purpose instructions**
4. **Let programming logic handle state management**

## Why This Works

Weaker models excel at focused tasks but struggle with:
- Multiple conditional branches
- State-dependent reasoning
- Choosing between different instruction sets
- Complex "if-then-else" logic

By handling these programmatically, you:
- Reduce ambiguity
- Decrease token overhead
- Improve consistency
- Lower inference costs (simpler prompts = fewer tokens)

## The Theory Behind It

This pattern aligns with several established principles in cognitive science and software engineering:

### Cognitive Load Theory

Cognitive Load Theory, developed by John Sweller, suggests that working memory has limited capacity. When a task requires juggling multiple concepts simultaneously, performance degrades. This applies to LLMs too:

- **Intrinsic Load**: The inherent difficulty of the task (intent extraction)
- **Extraneous Load**: Unnecessary complexity (deciding which logic to apply)
- **Germane Load**: Effort toward building understanding (pattern matching)

By removing extraneous load (the conditional logic), we free up the model's "working memory" to focus on the actual task.

### Single Responsibility Principle

From software engineering's SOLID principles:

> A component should have one, and only one, reason to change.

When we give the model instructions that handle both scenarios, we're violating SRP. The prompt has two responsibilities:
1. Handle known intent matching
2. Handle unknown intent matching

Splitting these into separate prompts means each has a single, clear responsibility. This reduces ambiguity and makes the model's job more predictable.

### Principle of Least Power

Tim Berners-Lee's Principle of Least Power states:

> Use the least powerful language suitable for a given purpose.

In our context: don't use a model's intelligence to solve problems that simpler mechanisms (like conditional statements) can handle more reliably. Reserve the model's power for tasks that genuinely require language understanding and pattern matching.

## When to Apply This Pattern

Consider this approach when:
- Moving from a frontier model to a smaller/cheaper model
- Seeing inconsistent behavior across different scenarios
- Noticing the model confusing different operational modes
- Dealing with state-dependent logic

## Wrapping Up

The lesson here isn't about dumbing down your system. It's about proper separation of concerns:

**Code should handle**: State management, conditional logic, flow control

**Models should handle**: Pattern matching, extraction, generation within a well-defined context

When you prototype with powerful models, it's easy to lean on their intelligence for everything. But production systems benefit from treating models as specialized components, not general-purpose programmers.

Next time your prompt works great in Claude but fails in a smaller model, ask yourself:

"Am I asking the model to handle complexity that belongs in code?"

Moving that complexity where it belongs might be the difference between a system that barely works and one that scales reliably.
