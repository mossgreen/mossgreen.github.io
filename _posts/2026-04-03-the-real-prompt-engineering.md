---
description: "Prompt engineering has a folk version — magic phrases, ever-longer instructions — and a real one. The real one is engineering: reference concepts the model already shares instead of describing from scratch; move down the six escalation levels only when a failing test forces you, and back up when a better model arrives. A prompt file is software — same forces, same principles — and the practice is engineering with fewer safety nets than code."
title: "The Real Prompt Engineering"
tags:
- prompt engineering
- ai
- llm
- abstraction
- software engineering
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

**Prompt engineering** has a folk version — magic phrases, ever-longer instructions, vibes — and a real one. The real one is engineering: reference **concepts** the model already shares instead of describing from scratch, structure the file the way you structure software, and add detail only when a failing test forces you.

You have seen the folk version:

```text
You are a world-class expert with 20 years of experience.
This is very important to my career. I will tip $200.
NEVER apologize. NEVER guess. NEVER use markdown. NEVER…
```

A flattering role, a bribe, and a wall of prohibitions — each "never" patching an earlier failure, and no line anywhere saying what you actually want. This prompt returns twice below.

**TL;DR**

- **Natural language is ambiguous, and a model fills gaps worse than a human does.** A human fills them with the most sensible reading; a model fills them with a guess, and the result drifts.
- **Concepts are the unit of prompting.** A *concept* is an abstraction you and the model already share; a *definition* is an abstraction you declare to make it shared. Reference; don't describe.
- **Three rules.** Verify the model shares the concept. Know exactly what you want before you type. Start abstract and escalate only on evidence.
- **Six escalation levels, and they run both ways.** Concept → +definition → +example → step-by-step → reinforcement → better model. A failing test moves you down a level; a better model moves you back up.
- **The name is literal.** A prompt file is software — same forces, same principles. And the practice is engineering — specification, verified assumptions, evidence-driven design — with fewer safety nets than code.

## 1. The experiment

Before any theory, feel the problem. Here is a task:

> **Move one emoji to the center of the bottom-right section.**

![The grid before: two yellow emojis in the top-left quadrant](/assets/images/hugging-face-01.png)

![The grid after: the hugging face emoji centered in the bottom-right quadrant](/assets/images/hugging-face-02.png)

Write a prompt that makes a model do this. Twice.

**Round 1:** you may not say "emoji", "quadrant", "bottom-right", or "center". Describe everything from scratch.

**Round 2:** any words you want.

### 1.1 Round 1 — about 50 words

> "Take the yellow circle with closed eyes and open arms from the upper-left area. Move it to the area that is both to the right of the vertical fold line and below the horizontal fold line. Place it at the exact middle point of that area, equidistant from all four boundaries of that section."

Count the ambiguities.

- "The yellow circle with closed eyes" — the grid holds *two* yellow circles with closed eyes. Only "open arms" separates them; skim past those three words and the wrong one moves.
- "The area to the right of the vertical fold line" — which vertical line? Right from whose perspective?
- "Equidistant from all four boundaries" — of the section, or of the whole grid?

Every clause is a place to be misread. And this is a trivial task.

### 1.2 Round 2 — 12 words

> "Move the hugging face emoji to the center of the bottom-right quadrant."

| | Round 1 | Round 2 |
|---|---|---|
| Words | ~50 | 12 |
| Points of ambiguity | at least three | none found |

The experiment leaves one question: what did the twelve words have that the fifty didn't?

## 2. What Round 2 had: concepts

Three terms carry this post, so define them first.

An **abstraction** is a name that stands for a definition, so the definition can be used without being restated. A **concept** is an abstraction that both sides already share — the name points to the same definition in your head and in the model's training. A **definition**, in a prompt, is an abstraction you declare so that it *becomes* shared.

```text
concept    = an abstraction you and the model already share → reference it
definition = an abstraction you declare to make it shared   → declare, then reference
```

This is the word-scale form of a claim [a later post]({% post_url 2026-07-04-intention-is-the-new-abstraction %}) makes in general — an abstraction is a contract over a hidden implementation; the name is the contract, and the definition is what it hides.

Round 1 restated every definition inline. Round 2 referenced three shared ones:

- **"hugging face emoji"** — *what to move*. Three words that replace Round 1's nine-word description, by pointing at a definition the model learned in training. You taught it nothing; you referenced something it already knows.
- **"bottom-right quadrant"** — *where*. Carries the full geometric specification — a rectangular region, one of four, in the bottom-right — that Round 1 spent nineteen words rebuilding by hand.
- **"center"** — *how to position it*. One word for "the exact middle point, equidistant from all four boundaries of that section."

Dijkstra said the whole thing in his 1972 Turing Award lecture:

> The purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise.

That is exactly what "quadrant" did. It didn't blur the geometry — it named a level where the geometry is already exact, so the prompt no longer has to build it out of fold lines and boundaries. Each concept is a deep module in Ousterhout's sense: a three-word interface over a training-corpus-sized implementation.

### 2.1 Sharedness, not generality, makes a concept cheap

Sharedness and generality are different properties, and it pays to keep them apart:

| | Shared | Not shared |
|---|---|---|
| **General** | "quadrant", "center" — reference freely | "non-mixable" — declare first |
| **Specific** | "hugging face emoji" — reference freely | your internal jargon — declare first |

"Hugging face emoji" is barely abstract at all — it names one specific character — yet it compresses nine words into three, because the definition already sits on the other side. What makes a word cheap in a prompt is not how general it is; it's that you don't have to ship its definition with it.

Generality matters too, but it controls a different question — *how much detail to write out* — and section 4's escalation ladder is how you adjust it.

### 2.2 Fewer tokens, fewer misreads

Every word you add is a place to be misread. "Bottom-right quadrant" offers one reading; "the area that is both to the right of the vertical fold line and below the horizontal fold line" offers several. Concepts compress meaning, so there are fewer words to get wrong — fewer, not zero; section 4's ladder exists for the times a concept is still misread. Anthropic states the same principle for context engineering: find *the smallest possible set of high-signal tokens that maximize the likelihood of the desired outcome*.

```text
concepts carry maximum meaning in minimum tokens with minimum ambiguity
```

One caution before the rules: **precise beats short**. Compression is not the goal — precision per token is. "Use the response correctly" is short and worthless, because "correctly" references a definition that doesn't exist anywhere. If defining "correctly" costs thirty tokens, spend them.

## 3. Three rules

### 3.1 Verify before you reference

Before you write a long instruction, ask the model whether it holds the concept. Open a playground and ask:

```text
You:   In a 2×2 grid, which region is the "bottom-right quadrant"?
Model: The region to the right of the vertical midline and
       below the horizontal midline.
```

Shared — one word just replaced thirty. Not shared — then declare it: state the definition once, before the first use. One probe is enough here: you are checking whether a definition exists in the model — a stable fact — not how reliably the model applies it in your task, which is a distribution and needs section 4's evals. In code you don't call a class you never imported or defined; in a prompt, don't reference a term you never verified or declared.

Domain vocabulary is where this rule matters most. Words like "session", "action", or "workflow" mean something specific inside your system. The model has *a* definition for each — just not yours. Those are exactly the terms that must move from the "not shared" column to the "shared" one by declaration.

### 3.2 Know exactly what you want before you type

| ❌ Vague | ✅ Clear |
|---|---|
| "move the 2nd yellow icon to right, then move down" | "Move the hugging face emoji to the center of the bottom-right quadrant" |

The vague prompt is not a writing problem. It is a thinking problem: its author hadn't decided what they wanted, and typed anyway. The twelve-word version works because three decisions were made before typing — *which* emoji, *where* it goes, *how* it is positioned.

If you can't state what you want in one precise sentence, you are not ready to prompt yet.

### 3.3 Start abstract; move down only on evidence

Concepts are the first choice, not always the last. Sometimes the model misreads a concept; sometimes the task has an edge the concept doesn't cover. When testing proves it — not before — you move down one level. The ladder itself is the next section.

## 4. The escalation ladder runs both ways

Six levels, most abstract first — each step down bought by a failing test, not by habit:

**Level 1 — concept only.**
"Move the hugging face emoji to the center of the bottom-right quadrant."
*Try this first. If it works, stop here.*

**Level 2 — concept + definition.**
"… Center means equidistant from all four edges of that quadrant."
*Define the one piece the model misread. The concept stays the anchor.*

**Level 3 — concept + example.**
"… For example: the center of the top-left quadrant is the point halfway between the left edge and the vertical midline, and halfway between the top edge and the horizontal midline."
*Examples earn their place only when tests show the concept alone fails: unusual output formats, ambiguous domains, structure that resists description. This one demonstrates "center" on a different quadrant, so it teaches the pattern without stating the answer itself. If the concept is clear, an example is extra tokens and a second thing to misread.*

**Level 4 — step-by-step instructions.**
"Identify the hugging face emoji. The grid is divided into four quadrants. The bottom-right quadrant spans from the vertical midline to the right edge and from the horizontal midline to the bottom edge. Calculate the center point of that region. Move the emoji to that point."
*Writing the definition out by hand is not a failure — it is the right tool when evidence demands it. You have seen this level already: Round 1 of the experiment was Level 4 — the right register when no shared concept exists, wrong there only because nothing had failed yet to pay for it.*

**Level 5 — explicit reinforcement.**
"Identify the hugging face emoji, NOT the smiley one." "Never", "forbidden", "invalid".
*Two things about this level. First, even here, prefer stating the positive: "don't move it upward" rules out one direction and names no target; "move it to the bottom-right" names one. Jang, Ye & Seo (2022) measured the cost on the pretrained models of that era — worse on negated prompts, and worse as models grew — and Anthropic's current model guidance still says the same: positive instructions work better than telling the model what not to do. Second, if your prompt is accumulating "never"s — the folk prompt from the opening, caught mid-growth — the concept above them is broken: go fix it instead of stacking prohibitions.*

**Level 6 — a better model.**
*When Level 5 still fails, the remaining gap is not in the wording. Rule out missing context and conflicting instructions first; if neither is the cause, the model can't meet the spec.*

And the levels run both ways. Everything below Level 1 is a patch for one specific model's weaknesses — evidence against *that* model, not truth about the task. When the model changes, the evidence expires. Anthropic's own migration guidance for its newest models says exactly this: prompts tuned for earlier models are often too prescriptive for a stronger one and now *degrade* output, and instructions added to compensate for weaker planning should be removed. Taking Level 6 means re-testing at Level 1.

```text
a failing test moves you down one level
a better model moves you back up
```

A *test* here means an eval — the same cases rerun until the pass rate is a measurement, not luck; one output, good or bad, is an anecdote. That is the evidence discipline of [AI Demos Lie]({% post_url 2026-03-03-on-ai-rnd %}), run one level down — and it is how defensive constraints work in production prompts: added when the model proves it needs them, removed when it stops.

## 5. Prompt engineering is software engineering

Sections 1–4 stayed inside a single instruction; the rest of the post zooms out — first to the file the instructions live in, then to the practice around it.

Not "prompts are *like* software." A prompt file *is* software: instructions that determine machine behavior, kept in version control, edited by several hands, growing over time.

That identity is why the principles below transfer. Single responsibility, separation of concerns, depending on abstractions — none of these was ever about code syntax. They answer forces: parts change at different rates, responsibilities drift, dependencies rot. A prompt file has every one of those forces, so the same principles hold, for the same reasons. (The runtime differences — stochastic interpretation, no compiler — change tactics, not discipline. Section 6 takes them up.)

The examples below come from the production instruction file behind a form-building agent I work on, with internal vocabulary genericized.

### 5.1 Single responsibility

At sentence scale, each concept owns exactly one aspect of the task:

- "hugging face emoji" — *what*. Says nothing about position.
- "bottom-right quadrant" — *where*. Says nothing about which object.
- "center" — *how*. Says nothing about either.

No overlap; each is complete within its scope.

At file scale, the same discipline: `<review_rules>` separate from `<edit_rules>`, `<field_definitions>` separate from `<action_definitions>`. To understand a rule, you go to one place, and that section doesn't leak into other concerns. Anthropic's context-engineering guidance recommends the same shape — distinct, delimited sections, each owning one job.

### 5.2 Separation of concerns: definitions apart from flow

The twelve-word sentence works — until requirements change. The emoji turns blue; the destination moves; a second step is added. Each time, you edit the same string, risking what was already correct.

Separate what things *are* from what to *do* with them:

```text
definitions:
  target      = the hugging face emoji
  destination = the center of the bottom-right quadrant

flow:
  Move {target} to {destination}.
```

Now changes stay local. Emoji turns blue → update `target`, flow untouched. Destination moves → update `destination`, flow untouched. Flow gains a confirmation step → update flow, definitions untouched.

At file scale this becomes three layers:

1. **Rules** — what to do: `<request_handling>`, `<review_rules>`, `<edit_rules>`.
2. **Definitions** — what things are: `<field_definitions>`, `<action_definitions>`.
3. **Instances** — the runtime data: the field types themselves (text, email, numeric, date, multiple_choice, multiple_select), plugin lists fetched on demand.

None of the three forces changes on another.

### 5.3 Rules depend on abstractions

The strongest of the three. A real requirement: a form step holding a multiple_choice or multiple_select field must hold no other field.

The brittle fix writes instance names into the rule: *"if the field type is multiple_select or multiple_choice, the step has exactly one field."* It works today. Next month a ranking field arrives with the same constraint, and the rule gets edited. Then a rating field. Every arrival edits a rule that was already correct. Anthropic's guidance calls this out directly: hardcoded, if-else-shaped prompt logic is brittle and compounds into maintenance burden.

The engineered fix introduces the property at the definition level — `non-mixable` — and lets each instance declare it: text is mixable, multiple_choice is non-mixable. The rule is written once, against the property:

```text
a non-mixable field stands alone in its step
```

This is dependency inversion, in a text file: the rule — the high-level part — depends on an abstract property, and the field types — the details — implement it. The rule never learns instance names. Open/closed follows for free: next month's non-mixable field type registers itself at the instance level and touches zero rules. The system extends without modification.

## 6. Prompt engineering is engineering

Section 5 was about the artifact. You could concede all of it — the file is software, structure it accordingly — and still *prompt* by incantation. The stronger claim is about the practice.

Reread the three rules. They were never prompt tricks:

- **Know exactly what you want** — that is *specification*. Engineering states the requirement before building.
- **Verify before you reference** — that is *validating assumptions*. Check the material before you build on it.
- **Move down only on evidence** — that is *minimal sufficient design*, iterated by test results. Add nothing the load doesn't demand; remove what stops carrying.

That is not software method specifically. That is engineering method, period.

And prompts need it *more* than code does. In code, some correctness comes free: the compiler rejects contradictions, the type checker proves properties before anything runs. In a prompt, nothing is free — no compiler, no formal semantics, a stochastic runtime. Every belief about what the model will do is earned empirically or not at all.

So prompt engineering is not diluted engineering that borrowed a serious name. It is engineering with fewer safety nets — where the method is the only verification there is.

Deciding what you want, which abstractions carry it, and which level of detail the evidence justifies — that judgment is the engineering half of the work, and it stays yours. It is the same line that separates [development from engineering]({% post_url 2026-02-13-development-vs-engineering %}), met here from the other side of the prompt.

```text
know your goal before you type
reference what's shared; declare what isn't
move down a level on a failing test; move back up on a better model
separate rules, definitions, and instances
write rules against abstractions, not instances
```

The folk version hunts for magic words — the expert role, the tip, the wall of "never"s from the opening. The real version was in the name the whole time.

## References

- Edsger W. Dijkstra, [*The Humble Programmer*](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html) (EWD340), 1972 Turing Award lecture — "the purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise"
- Joel Jang, Seonghyeon Ye & Minjoon Seo, [*Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts*](https://proceedings.mlr.press/v203/jang23a.html), 2022 — on that era's pretrained models, performance drops on negated prompts, with inverse scaling
- Anthropic, [*Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), 2025 — smallest set of high-signal tokens; guiding principles over brittle hardcoded logic; distinct prompt sections
- Anthropic, [*Claude model migration guide*](https://platform.claude.com/docs/en/about-claude/models/migration-guide), platform docs, 2026 — prompts tuned for earlier models are often too prescriptive for a stronger one; remove compensating instructions; prefer positive instructions over prohibitions
- Robert C. Martin, *Agile Software Development: Principles, Patterns, and Practices*, 2002 — single responsibility, open/closed, dependency inversion
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules: small interfaces hiding large implementations
