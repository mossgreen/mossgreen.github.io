---
title: "Intent Recognition Case Study: Why Conceptual Prompts Won"
tags:
  - LLM
  - Prompt engineering
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

from 5/10 to 10,000/10,000.

## The Problem

I was building an intent recognition system that needed to:
1. Identify user intent from natural language input
2. Extract structured field values based on that intent
3. Handle intent switching intelligently (stay on current intent for supplemental info, switch only for clear intent changes)
4. Return structured JSON output

The system had multiple intents (for testing, use: product purchase, book dinner, sell car) with different field schemas. It needed to be reliable enough for production use.

My requirements were strict: **near-perfect accuracy** on edge cases, especially the tricky scenario where users provide information that could trigger intent switching but shouldn't.

## First Attempt: The Programmatic Approach

Coming from a software engineering background, I wrote the prompt like an algorithm:

```text
First, compare A against B.
If A provides information matching any field in B, then do C.

Otherwise, if A contains signal of intent switching,
match to D based on semantic alignment of the complete
intent — not partial keyword overlap.

If neither condition applies, result remains A.

Think carefully to review and correct the result before proceeding further.
```

This looked reasonable. Clear conditional logic, explicit branching, step-by-step instructions. The kind of prompt that should work according to conventional wisdom about "being explicit."

## The Testing Setup

I tested using JUnit with aggressive parallelization:

```properties
# junit-platform.properties
junit.jupiter.execution.parallel.enabled=true
junit.jupiter.execution.parallel.config.strategy=fixed
junit.jupiter.execution.parallel.config.fixed.parallelism=100
junit.jupiter.execution.parallel.mode.default=concurrent
```

My critical test case: when the user is on "product purchase" intent and says something irrelevant like "what's the weather like today?", the system should stay on "product purchase" — not switch to an unknown intent.

I ran this test 10,000 times to catch any inconsistency.

**Model**: GPT-4o-mini

## The Failure

**Success rate: 5 out of 10 successful runs** 

The model couldn't follow the conditional logic consistently. It would:
- Sometimes switch intent when it shouldn't
- Sometimes hallucinate intent values not in the options
- Inconsistently apply the "if-then-else" logic
- Get confused by the nested conditionals

The programmatic approach had too many decision branches:
1. Check if input matches current intent fields
2. If not, check if there's explicit intent switching signal
3. If yes, match semantically but not by keyword
4. If no match in any condition, default to current

**Why it failed**: I was asking GPT-4o-mini to execute algorithmic logic with multiple conditionals. But LLMs are pattern matchers, not logic executors. The branching structure created ambiguity about which rule to apply when.

---

## Second Attempt: The Conceptual Approach

I stripped away all the algorithmic complexity and wrote it as a goal:

```text
The options can be from X.

result is one of the matching options.
If there are no matching value, result is the value of blah.
```

That's it. Two sentences instead of a multi-branch algorithm.

**Key differences:**
- No conditionals ("if", "otherwise")
- No nested logic
- Direct statement of the goal
- Let the model figure out HOW to achieve it

## The Success

**Success rate: 10,000 out of 10,000** (100% accuracy)

Same model (GPT-4o-mini), same test cases, same parallelization. The only difference was the prompt style.

The model now:
- Consistently stayed on current intent for irrelevant input
- Correctly identified when to switch intents
- Never hallucinated values outside the intent options
- Handled all edge cases reliably

## Why Conceptual Won

Intent recognition is fundamentally a **semantic pattern matching task**, not an algorithmic execution task.

### Pattern Matching vs Logic Execution

**What the task actually requires:**
- Understand semantic meaning of user input
- Match input to known intent patterns
- Extract field values based on pattern recognition

**What I was asking the model to do (programmatic approach):**
- Parse conditional branches
- Execute if-then-else logic
- Apply rules in specific sequence
- Track state across multiple conditions

### The Technical Explanation

LLMs process language through self-attention mechanisms that excel at:
1. **Semantic pattern recognition** - finding similar patterns from training data
2. **Contextual understanding** - understanding meaning from surrounding text
3. **Natural language abstractions** - working with goal-oriented descriptions

LLMs struggle with:
1. **Explicit conditional logic** - if-then-else branches create ambiguous attention patterns
2. **Multi-step algorithmic execution** - requires maintaining state across steps
3. **Formal logical reasoning** - probability distributions over tokens ≠ logic gates

When I wrote the programmatic prompt, I created cognitive overhead:
- The model had to parse my algorithmic instructions
- Then translate them into its natural pattern-matching process
- Then apply them to the input
- With multiple conditionals creating ambiguous paths

The conceptual prompt eliminated that overhead:
- Direct goal statement
- Model uses its natural semantic understanding
- Pattern matching happens in one pass
- No translation layer between instructions and execution

### The Complexity Trap

My programmatic prompt had implicit complexity:

```
"First, compare... If match... Otherwise, if signal... match based on
semantic alignment — not partial keyword overlap... If neither condition..."
```

Count the decision points:
1. Does input match current intent fields? (How to determine "match"?)
2. Is there explicit intent switching signal? (What counts as "explicit"?)
3. Semantic alignment but not keyword overlap? (How to distinguish?)
4. Neither condition? (Did I check both correctly?)

Each decision point adds ambiguity. The model had to:
- Interpret nested conditional logic in natural language
- Determine which branch to follow at each step
- Track state across multiple conditions
- Handle edge cases where conditions overlap

Natural language conditionals are inherently ambiguous compared to programming language conditionals. When is "match" a match? What makes a signal "explicit"? These ambiguities compound.

The conceptual prompt had one clear goal:
```
"result is one of the matching options.
If no matching value, result is A."
```

One decision: Does input match an intent option? Yes → return it. No → return current.

## The Testing Methodology

To ensure reliability, I tested at scale:

**Test Structure:**
```java
@RepeatedTest(10000)
void shouldNotSwitchIntentWithIrrelevantIntent() {
    Result result = system.process("what's the weather like today?");
    assertThat(result.result()).isEqualTo("product purchase");
}
```

**Why 10,000 repetitions?**
- LLM responses have inherent variance
- Small sample tests (10-100) can miss inconsistencies
- Production systems need statistical confidence
- 10,000 tests expose edge case failures

**Parallel execution:**
- 100 concurrent threads
- Real production load simulation
- Tests rate limiting and consistency under pressure

**Other critical test cases:**
- Providing supplemental info: "200 dollars" (should stay on current intent)
- Weak intent signals: "table for 5" (should not switch from product purchase)
- Clear intent switching: "I want to sell my 2010 Honda Civic" (should switch to "sell a car")

All tests passed 100% with the conceptual approach.

---

## Key Takeaways

Based on this experience with GPT-4o-mini, here's what I learned about prompt engineering for intent recognition:

### 1. Task Type Determines Prompt Style

Intent recognition is a **semantic classification task**. These tasks benefit from conceptual prompts because they align with how LLMs naturally process language through pattern matching.

If your task is fundamentally about understanding meaning (classification, extraction, summarization), start with conceptual prompts.

### 2. Simpler Often Means Clearer

My programmatic prompt felt more explicit, but it was actually more ambiguous. Each conditional branch created decision ambiguity about which rule to apply when.

Goal-oriented instructions reduce cognitive load and let the model use its natural language understanding.

### 3. Test at Production Scale to Catch Variance

Testing with 10-100 examples might show 90% success for both approaches. The failure modes only appeared at scale with 10,000 tests showing consistent patterns.

For production systems needing high reliability, test with thousands of examples using parallel execution to catch variance and edge cases.

### 4. Model Capabilities Shape Optimal Approach

GPT-4o-mini is optimized for efficiency over complex reasoning. It excels at pattern matching but struggles with multi-step conditional logic.

For smaller/faster models, conceptual prompts leveraging pattern recognition often outperform programmatic logic. Larger models (GPT-4, O1) may handle both approaches better.

### 5. Align Instructions with Training Data

LLMs have seen millions of examples of:
- "Identify the user's intent from these options"
- "Extract relevant information"
- "Match input to categories"

They've seen far fewer examples of nested conditional logic expressed in natural language. Use instruction patterns that match the model's training distribution.

### 6. Know When Programmatic Wins

Conceptual isn't always better. Programmatic prompts work better for:
- **Multi-step mathematical reasoning** - Explicit steps prevent calculation errors
- **Audit-required tasks** - Need visible reasoning traces
- **Rule-based transformations** - Specific algorithms must be followed exactly
- **Complex multi-step workflows** - Tasks requiring 5+ distinct reasoning steps

For semantic tasks like intent recognition and classification, conceptual prompts align with model strengths.

**The mental shift:**

From: "I need to tell the model exactly how to do this"
To: "I need to describe what I want, let the model figure out how"

## Conclusion

Same task. Same model (GPT-4o-mini). Different prompt style.

**Programmatic approach**: 5/10 in testing batches
**Conceptual approach**: 10,000/10,000 (100%) success rate

The lesson isn't that programmatic prompts are bad. It's that **task type matters**. Intent recognition is semantic pattern matching, and LLMs are naturally good at that when we let them use their pattern-matching abilities instead of forcing them to execute algorithmic logic.

*Note: These results are specific to GPT-4o-mini on this particular task. Larger models like GPT-4 or O1 may handle both approaches differently, but the principle remains: match your prompt style to the task type and model capabilities.*

The hour I spent rewriting from programmatic to conceptual, plus rigorous testing at scale, saved weeks of debugging inconsistent intent recognition in production.

**Your turn**: If you're writing a prompt with nested "if-then-else" logic for a semantic task, try this experiment:
1. Delete the conditionals
2. Describe the goal in plain language
3. Test both versions at scale (1000+ examples)
4. Measure the difference

You might be surprised by the results.

