---
featured: true
description: "Test pain is the most honest signal we have about a design: how many tests would it take to pin this down? But as a detector it has two flaws. It runs after the code exists, and it needs a human with taste. This post makes the detector ex ante and mechanical: a design grammar where a design compiles only if its honest test cost is bounded. Three rules do the work, and each one refuses a design rather than warning about it."
title: "Test Pain, Made Mechanical"
tags:
- software engineering
- testing
- design
- abstraction
- ai
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

**Test pain** is the most honest signal we have about a design. The question *how many tests would it honestly take to pin this down?* cuts through style arguments faster than any principle. But as a detector it has two flaws, and both get worse when an AI is writing the code.

**TL;DR**

- **Test pain is a real detector of entanglement.** Ask how many tests it would honestly take to pin a piece of behaviour. The number tracks how many decisions got folded into one place.
- **It has two flaws.** It runs *after* the code exists, and reading it needs a human with taste. When AI writes code faster than you can read it, a retrospective detector that requires taste never runs.
- **The fix is to make the detector part of the grammar.** Express the design in a notation precise enough that its test cost can be *counted*, then refuse designs whose cost is unbounded.
- **Three rules do the work.** A budget on how many things may vary in one place. A declared threshold must be demonstrated by a bracketing pair of rows. Every call in the design becomes exactly one assertion, so the count is auditable in thirty seconds.
- **Refusal, not warning.** A linter that warns gets ignored at 4pm on a Friday. A grammar that refuses cannot be.
- **The honest limit.** This bounds the worst case. It does not produce good abstractions. Clean is mechanical; simple is still judgment.

## 1. The detector, and why it works

In [Clean and Simple, Again](/clean-and-simple-again/) I argued that *simple* is about how much you must hold in your head at one level. The practical way to measure that is to ask what it would cost to test.

Take a method that computes a shipping fee. If the fee depends on weight, and separately on destination, and separately on whether the customer is a member, then pinning its behaviour is not three tests. It is closer to the product of the three. Every combination is a case someone could get wrong, and the only way to know is to write them out.

That multiplication is the signal. Test pain is not squeamishness about writing tests. It is arithmetic telling you that several independent decisions have been folded into one place, so they can no longer be checked independently.

This is why the question works so well in review. *How many tests would this honestly take?* is harder to argue with than *this feels complex*, because the answer is a number, and both people can compute it.

## 2. Why the detector rarely fires

Two problems.

**It is retrospective.** You feel test pain when you sit down to write the tests, which is after the structure exists. By then the cost of changing it is a rewrite, and the honest answer to "should we restructure this?" is usually "not this sprint". The detector fires exactly when acting on it is most expensive.

**It needs taste.** The person has to notice the multiplication, resist the shortcut of one test with three `if`s in it, and be willing to say so out loud. That is a real skill, distributed unevenly, and it does not survive schedule pressure.

Both flaws are survivable when a team writes a few hundred lines a day and reviews all of them. Neither is survivable when an agent writes a few thousand. The volume argument is not that AI code is worse. It is that a detector requiring human attention per unit of code stops working when the code outpaces the attention.

So the detector has to move. It has to run *before* the code exists, and it has to run without taste.

## 3. Moving the detector to the design

The trick is to review something smaller than the code, but precise enough to be checked mechanically.

A sequence diagram at the level of one operation is small enough. It names the collaborators, the order of calls, the arguments, and what comes back. Ten lines instead of four hundred. And the crucial property: **its test cost can be counted directly from the notation.**

That turns the retrospective question into a compile-time one. Not *how did this feel to test?* but *does this design's test cost fit in a budget?* Three rules make that concrete.

### 3.1 A budget on how many things may vary in one place

The rule: one behavioural node may carry at most two axes of variation. A third axis must be delegated to a collaborator.

The arithmetic is the point. One axis with three values is three cases. Two axes is nine. Three is twenty-seven, and nobody writes twenty-seven tests, so in practice a subset gets written and the rest is hope. Capping the folds at two per level caps the honest test cost per level, and pushes the third axis somewhere it can be tested on its own.

This is the same instinct as "one reason to change", but stated as a number a tool can count rather than a principle a reviewer must interpret.

### 3.2 A declared threshold must be demonstrated

Pure-function leaves are specified with a small table of examples: input in, output out. Rows are cheap and readable, and they pin behaviour at the sampled points.

But rows alone cannot locate a threshold. Consider a late-cancellation fee:

| hoursUntilVisit | expected |
|-----------------|----------|
| 120             | 0.00     |
| 2               | 20.00    |

Free if you cancel early, twenty dollars if you cancel late. Both rows pass with a cut at 48 hours, at 72, at 3. The examples are consistent with an infinite family of implementations, and an AI asked to implement them will pick one, plausibly, silently.

So thresholds are declared, and a declared threshold must be demonstrated by a **bracketing pair**: one row at the boundary, one at the largest value below it, every other input held equal.

| hoursUntilVisit | expected |
|-----------------|----------|
| 120             | 0.00     |
| **48**          | **0.00** |
| **47**          | **20.00** |
| 2               | 20.00    |

Now the cut is at 48, and the row *at* 48 also settles which side the boundary value belongs to, which is the `>=` versus `>` question that off-by-one bugs live in. Declare a boundary without its bracketing pair and the design is refused before anything is generated. The refusal names the two rows you owe.

Notice what this rule really does. It does not test the code. It makes you state the threshold you already had in your head, and then it charges you exactly two rows to prove where it sits. That is test pain, priced and collected up front.

### 3.3 Every call becomes exactly one assertion

The third rule is the audit. Every call arrow in the diagram becomes exactly one interaction assertion in the generated test. Every table row becomes exactly one leaf test. The counts must match.

That gives a reviewer a thirty-second check that does not require reading the implementation: count the arrows, count the `verify()` calls, confirm they are equal and that the arguments line up. If the design says five calls and the test file says four, something was dropped, and you know it without understanding the code.

This is the part that makes regeneration safe to trust. Trust is not "the AI is good". Trust is "the output is mechanically checkable against the thing I approved".

## 4. A fourth rule I did not expect to need

The three above were designed. The fourth came from a failure.

A design passed every check. Right collaborators, arrow parity intact, budget respected. It fetched a pricing rule from a repository, and then called the fee calculation without passing the rule to it. The generated code compiled. The tests passed. The feature did nothing.

The diagram was structurally perfect and semantically severed, because the notation had no way to say *this value came from that call*. Return arrows carried a type, not a named value, so nothing downstream could refer to anything upstream.

The fix is a provenance rule: every value a call consumes must be produced by something earlier in the same design, or by the entry point. A design that references a value from nowhere is refused.

It is worth saying why this belongs in the same family as the other three. Each rule takes something a careful reviewer *might* notice, and converts it into something a parser *must* notice. The severed rule is the clearest case, because a human reviewer looking at a diagram is genuinely unlikely to catch a missing argument on one of six arrows. Diagrams look correct very easily. That is their danger and, once you can check them, their value.

## 5. Worked example

The cancellation fee above is not hypothetical. It is a real change on a real Spring codebase: [the design-only pull request](https://github.com/mossgreen/spring-petclinic/pull/1).

The first commit contains no production code at all. Two files: a sequence diagram and a decision table. That is what the reviewer is asked to approve, and the interesting arguments surface there, before anything is built:

- The codebase's convention is controller-does-everything. This design introduces a service layer. Deviate deliberately, or follow local convention?
- Is the 48-hour rule code or configuration? That changes the design, not just a constant.
- The codebase has no billing concept. Is the fee persisted or only displayed?

Those are the load-bearing decisions. There are about three of them, and they are all visible in ten lines of notation. The second commit adds the generated tests and implementation, with the parity report as a comment: five arrows, five interaction assertions, four rows including the bracketing pair, four leaf tests.

The reason to argue in the first commit rather than the second is cost. Rejecting a structure before implementation exists costs one regeneration. Rejecting it after costs a rewrite, which is why, in practice, it does not get rejected.

## 6. What this does not do

Being clear about the edge of the guarantee is more useful than the guarantee.

**Between the rows, behaviour is unconstrained.** The table pins 120, 48, 47 and 2, plus the location of the declared threshold. It says nothing about 60. If the real rule has a second cut you did not declare, nothing here finds it. Sampling is sampling.

**Side-effect leaves are not specified.** The design pins how the orchestrator *calls* a repository, not what the repository does. That is deliberate, and it means integration tests still exist.

**It does not produce good abstractions.** This is the important one. Every rule above bounds the *worst* case: uniform structure, bounded folds, demonstrated thresholds, no dangling values. None of them tell you whether `CancellationGuard` should exist at all, or whether these five collaborators are the right five. That is the *simple* question from the first essay, and it is still judgment.

What changed is the division of labour. Clean, in the structural sense, is now mechanical: honest boundaries, one responsibility per node, predictable placement. Simple is still yours.

## 7. Why this matters more now than it did

The old argument for design rigour was that code is expensive to write, so think first. That argument is weakening, because code is getting cheap to write.

The new argument is the opposite shape. Code is cheap; *agreement* is not. When an agent can produce a plausible implementation of anything in a minute, the scarce thing is a shared, checkable statement of what was supposed to happen. Review at the level of code is judging a thousand decisions where nine hundred and fifty are mechanical and you cannot tell which fifty are not. Review at the level of design is judging ten, all of which are load-bearing.

Test pain was always the honest way to find the entangled ones. It just needed to happen earlier, and without depending on someone having a good day.

A design that compiles only when its honest test cost is bounded is what that looks like.
