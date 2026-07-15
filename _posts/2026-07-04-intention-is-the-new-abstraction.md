---
description: "An abstraction is a contract over a hidden implementation, and software stacks them for two reasons: nobody holds the whole system, and parts must change independently. Contracts came in two kinds — formal for machines, natural for humans — and an LLM is the first machine that consumes the natural kind in general. So intention is a new abstraction: you state the result, the model supplies the implementation. One old rule governs the new layer and every layer under it: give the contract, not the implementation — and keep every contract true."
title: "Intention Is the New Abstraction"
tags:
- ai
- llm
- abstraction
- context engineering
- software engineering
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

Weights. MCP. Skills. Subagents. Code modules.

What do they share? Each exposes a small contract to the model and hides its implementation.

Why? Two old reasons: context is finite, and what is behind a contract must be free to change.

So one of the oldest rules in software engineering has become one of the most important rules in AI: *program to an interface, not an implementation.* This post adds one claim on top of that rule — the rule now has a new top layer to govern: **intention is the new abstraction.**

**TL;DR**

- **An abstraction is a contract over a hidden implementation.** Software stacks them for two reasons: nobody holds the whole system (capacity), and parts must change without dragging each other (independence).
- **Contracts came in two kinds** — formal, which machines execute, and natural, which machines handled only in narrow, pre-built domains. An LLM is the first machine that consumes the natural kind in general.
- **So intention is a new abstraction.** You state the result in ordinary language; the model supplies the implementation. A new top layer of the stack.
- **One rule governs every layer:** give the contract, not the implementation. Breaking it now costs immediately, on both classical axes: diluted attention and accidental coupling.
- **A contract only works if it is true and precise.** Tool descriptions, skill summaries, code names — and the intention itself.

## 1. What an abstraction is

An **abstraction** is a contract over a hidden implementation. The **contract** is what you may rely on: the name, the signature, the description — what the thing promises. The **implementation** is how the promise is kept.

Software is a stack of abstractions. A function hides its body behind a signature. A module hides its functions behind an interface. A service hides its modules behind an API. Each layer gives the layer above a contract and keeps its implementation to itself.

The stack exists for two reasons, and both matter later:

1. **Bounded capacity.** Nobody holds a whole system in their head. A contract lets you use a layer without reading it — Ousterhout's deep module: a small interface over a large implementation.
2. **Independent change.** Parts must be able to change without dragging each other along. A contract fixes what each side may rely on, so everything behind it is free to move — Parnas's rule: hide the decisions likely to change.

Keep both reasons in mind. They return in section 4 as the two costs.

## 2. Intention is the new layer

Contracts have always come in two kinds.

**Formal contracts** are written in exact languages: a function signature, an SQL query, an HTTP request. Their syntax and meaning are fixed by the language's definition. Machines execute them.

**Natural contracts** are written in ordinary language: a spec, a ticket, a requirement, a README. For all of software history, consuming them in general — any sentence, any domain — was human work. A product manager writes "customers can cancel within 30 days," and a person turns that sentence into code. The person supplies the implementation.

Two contract systems, one per consumer. Machines got the formal kind; people got the natural kind.

An LLM is the first machine that consumes natural contracts in general. You hand it a sentence — about a schema, a codebase, a refund policy — and it acts on the sentence, with no human in between and no domain built for it in advance. It keeps the contract probabilistically: the meaning is inferred by the model, not fixed by a language definition.

That is the title, stated literally. **Intention is the new abstraction:** you state the result in ordinary language, and the machine supplies the implementation — the code, the tool calls, the intermediate steps. The contract that used to require a human implementer is now a machine interface. The stack has a new top layer.

Three things this claim does not say:

- **It is not about declarative languages.** SQL and Prolog also let you state a result and leave the method to the engine. But they are formal: exact language, syntax and meaning fixed by the language definition — what the query asks for does not depend on the reader. The new thing is not stating the *what*. The new thing is a contract written in natural language.
- **It is not the first machine to accept ordinary language.** SHRDLU executed English commands in a blocks world around 1970; program-synthesis systems in the 2010s compiled English descriptions into programs in small target languages (Desai et al.); voice assistants matched sentences against command lists. Each consumed natural language inside one domain its developers had pre-built — a closed world, a fixed target language, a finite command set — and none generalized past it. The claim is about generality: one machine, an open set of domains, no per-domain build.
- **It is not mind-reading.** The contract is the intention as stated: the model never sees what you meant, only what you wrote. The gap between the two is section 6's subject.

Dijkstra defined the purpose of abstraction as creating "a new semantic level in which one can be absolutely precise." The new layer meets half of that criterion: it raises the semantic level — you state the result in the language you think in — but it does not supply the absolute precision, because a natural sentence has no formal semantics and the model keeps it probabilistically. The missing precision has to be put back by the author: by stating the intention exactly — the whole practice of [The Real Prompt Engineering]({% post_url 2026-04-03-the-real-prompt-engineering %}) — and, where words cannot pin behavior, by tests that can. This is the one place the new layer is weaker than every layer below it, and it is where the work moved.

## 3. One rule, every layer

The rule that governs every abstraction is the one in the opening: program to an interface, not an implementation. Generalized past code: **use the contract, not the implementation.**

At the new top layer, the rule reads: **state what you want, not how to do it.** Give the result, not the procedure. Add "how" only when evidence forces you — the escalation levels of the prompting post, where each step toward step-by-step instruction is bought by a failing test, not by habit.

Below your intention, the model does the same thing. To meet the contract you gave it, it composes contracts of its own:

| In the window | The implementation | Where it lives |
|---|---|---|
| the word "quadrant" | the geometric definition | the model's weights |
| an MCP tool description | auth, API calls, pagination | the server |
| a skill's description line | procedures, scripts, resources | the skill folder |
| a subagent's task and result | the full transcript of the work | the subagent's own window |

Each row is the same design: contract in the window, implementation elsewhere. But the rows split. A skill's deeper layers and a code file's body *can* be loaded later. The weights, the server's internals, and the subagent's transcript can never enter the window at all. Some boundaries are readable; some are opaque by construction. The opaque ones follow the rule by construction — there is nothing to read. The readable ones are where the rule needs discipline.

The discipline, in AI coding:

```text
read the implementation of what you are changing;
read only the interface of what you are using
```

The change target must be read — you cannot safely edit what you haven't seen. It is use *alone* that never justifies reading the body. Concretely, the same dependency reaches the window two ways:

```text
carrying the implementation            carrying the contract
──────────────────────────            ─────────────────────
parse(s):                             parse(s: str) -> Config
  the tokenizing loop, escapes,       validate(c: Config) -> Result
  the edge cases                      save(c: Config) -> None
validate(c):
  every rule, in full                 (bodies stay in the file,
save(c):                               read only what you change)
  a retry loop, a backoff,
  a metrics call
```

The right column is everything needed to call those functions and nothing extra to depend on. The left column is the same three promises, buried under the detail of how they are kept.

What counts as the interface? More than the name and the docstring. The signature, the types, and the tests are all contracts, and all machine-readable. Types pin the shape. A test pins behavior by example — and unlike a comment, a test cannot drift silently about the behavior it exercises: when code and test disagree, the test fails. Thirty years of contract infrastructure is exactly what an agent should read in place of the body.

None of this makes an interface free. Each one costs tokens, so it earns its place only when it hides more than it costs. Forty shallow signatures are not more abstract than one deep module; they are the same body with more surface to carry.

The rule also applies when you *build* the things agents load. In my design-is-code plugin there is a skill, `disc`, that turns UML sequence diagrams and decision tables into tests and code. It holds the rule in both directions at once. Upward, the caller carries one line — the frontmatter description: *"Transform a precise design (UML sequence diagrams and decision tables) into working code using the DisC methodology."* That is the entire contract the outside world holds.

Downward, the skill keeps itself at the same level of generality it asks of its callers: SKILL.md is language-neutral by construction. Every language-specific rule — naming conventions, file paths, code templates, the build command — is owned by a contract the skill calls a `language_profile`, and each language ships as its own profile file (`java_spring.md` today), loaded only after the pipeline detects the project's language. The skill's rules are written against the profile's contract, never against Java. When the next language arrives, it arrives as a new profile file: SKILL.md doesn't change, the existing profile doesn't change, and a run generating Python never carries the Java rules in its window.

That is section 1's second reason working as designed: the contract fixes what each side may rely on, so the implementations underneath are free to change. A prompt of any size can only evolve safely this way.

The same rule, prompting by hand: paste the signature, the types it touches, and the failing behavior — not the file.

## 4. The cost of breaking it

For human engineers, the rule was advice. You could ignore it and ship; the cost arrived later, as review debt or a breakage after someone else's refactor. For a model, the cost arrives immediately — on the current output. And it arrives on exactly the two axes from section 1.

**Bounded capacity ignored → dilution.** The window is finite, and it degrades before it fills: every token competes for attention, so low-signal tokens don't just cost space — they dilute everything else. This is measured, not felt. Models reliably lose information placed in the middle of long contexts (Liu et al., *Lost in the Middle*), and Chroma's report across 18 models shows performance falling well before the window is full — a 200K-token model degrading by 50K. Anthropic states the design goal accordingly: the smallest set of high-signal tokens that maximizes the likelihood of the desired outcome. Bigger windows do not remove this cost, because attention dilutes with what you *load*, not with what you *could have* loaded. And since complexity is conserved — Tesler's law: it can be moved but not deleted — the system's complexity has to live somewhere. The one place it must not live is the window.

**Independent change ignored → coupling.** Put a body in the window and the model can write against what the code *happens to do* instead of what it *promises*. In human hands this is the oldest failure mode in software: a caller quietly bound to private behavior, broken by the next refactor of internals it was never entitled to. Humans heard "program to an interface" for thirty years and read the source anyway. For an agent, the claim is mechanism, not habit: with the internals in the window, nothing prevents the binding; with only the contract, nothing it has read enables it.

```text
what the model cannot see, it cannot couple to — by reading
```

That closes one channel, not both. A model still couples to what it *observes*: watch a tool return sorted results often enough, and the model depends on a sortedness the contract never promised. Keeping the body out of the window prevents coupling by reading; coupling by observation survives — which is why even an opaque boundary has to be checked by what it does, not only by what it says.

The correspondence is worth stating once, plainly: the two reasons abstraction exists are the two costs of ignoring it. Capacity ignored becomes dilution. Independence ignored becomes coupling. The model did not change the rules; it changed when the cost arrives.

## 5. Read behind a contract only on evidence

The rule is not *never look inside*. It is: looking inside is an escalation, and escalations are bought with evidence — the same shape as the prompting post's escalation levels, applied to reading instead of writing.

One scope note first: descending is only possible at readable boundaries — files, skills, anything whose inside can be loaded. At an opaque boundary — the weights, the MCP server, a finished subagent — there is no inside to read, and the only probe is empirical: call it and compare conduct against contract.

Evidence that sends you behind a contract:

- **The contract is ambiguous.** Two tools whose descriptions overlap; a parameter whose meaning the description doesn't pin down. The outside underdetermines the decision.
- **Behavior contradicts the contract.** The function returns something its signature doesn't suggest; the tool does less than its description claims. The promise and the conduct disagree.
- **The bug is behind the boundary.** The failing test points inside. Then the module has become the thing you're changing, and the changing rule applies: read it.

Two of these an agent can detect reliably: a failing test and an output that contradicts its signature are objective. Ambiguity is a judgment call, and the softest trigger — an agent may find ambiguity where none matters, or miss it where it does. So weight them differently: descend on the objective signals freely, on felt ambiguity only when guessing wrong would be expensive.

Descents will happen — all non-trivial abstractions leak (Spolsky). The discipline is in what you bring back. What you learn inside should end in one of two fixes: the implementation was wrong — fix it and return; or the contract was wrong — the name lied, the description was vague — so fix the contract. What must not happen is the third path, the common one: what you read inside stays in context permanently, and the window now carries a copy of the internals, coupled from then on to what it saw.

```text
stay at the contract; read behind it on evidence; return with the contract true again
```

## 6. Every contract must be true — including yours

Everything above rests on one assumption: the contracts tell the truth.

A human who distrusts a name reads behind it — inefficient, but self-correcting. An agent working by this post's rule can't: the contract in its window is all it has. A tool description that overpromises, a function name that hides a side effect, a skill summary that doesn't match the procedure — each one corrupts every decision made downstream of it, and the agent has little chance to catch the lie before acting on it.

The security world has already demonstrated this, adversarially. MCP **tool poisoning** attacks work by planting instructions inside a tool's description — and they work because the description is what the agent consumes; a lying description compromises every decision built on it. The constructive side of the same fact: Anthropic's guidance on writing tools for agents shows description quality directly moving agent performance. The dishonest boundary used to cost a confused reader. Now it costs a confidently wrong action, taken at machine speed.

A contract can fail the truth test two ways, and only one is a lie. It can **say the wrong thing** — a name that hides a side effect, a description that overpromises. Or it can **stay silent** — say nothing about an error mode, an ordering, a side effect — and the agent fills the silence with whatever it inferred: the coupling by observation from section 4. The lie can be caught by reading; the silence usually can't, because there is nothing there to contradict. Honest naming shrinks the first and does nothing for the second: an agent assumes whatever the contract leaves unsaid.

The boundary also bears more weight than it used to. A type checker reads a contract deterministically; a model reads it probabilistically. A blurry description doesn't produce a compile error — it fails quietly, or picks the wrong one of two overlapping tools. The cost of a vague boundary moved from an error you catch to an error you don't.

And none of this maintains itself. The rule doesn't delete the work of a good boundary; it moves the work to author-time — someone writes the honest description and keeps it honest as the code changes. A contract that drifts is no longer a stale comment; it is a live instruction the agent still obeys, now lying. You cannot lint English against behavior, so the only check that a description still matches its code is to run the code and compare. Which makes a machine-*generated* contract the sharpest form of the risk: summarize a module into a one-line digest, and you may have automated a plausible, confident, wrong boundary.

In [Clean and Simple, Again]({% post_url 2026-06-22-clean-and-simple-again %}) I wrote that dirty code runs perfectly, the computer does not care — that *clean is a courtesy paid entirely to people*. That sentence is now out of date, and this section is the correction: a new kind of computer started caring. Agents treat boundaries as true — they act on what the name says, not on what the body does. Honest naming, single responsibility, descriptions that match behavior: these stopped being code review niceties the day a machine started making decisions from them. AI turned clean from a courtesy into infrastructure.

The top contract obeys the same law. An intention can say the wrong thing — you ask for what you don't need. And an intention can stay silent — you leave unsaid what you actually require, and the model fills the silence with inference. The prompting post's first rule — know exactly what you want before you type — is contract honesty applied to yourself.

One rule, three duties:

```text
give contracts, not implementations — at every layer
read behind a contract only on evidence, and return with the contract true again
keep every contract true and precise — including the intention
```

The stack grew a new top layer, and the rule did not change. Information hiding has been advice since 1972: a compiler could hide a private field, but nothing stopped an engineer from reading the source and writing against what it happened to do — the cost arrived later, if it arrived at all. Now it arrives immediately, in the accuracy of the next answer. The oldest discipline in software turned out to be the operating rule for the newest machine.

## References

- Gamma, Helm, Johnson & Vlissides, *Design Patterns*, 1994 — "program to an interface, not an implementation"
- David Parnas, *On the Criteria to Be Used in Decomposing Systems into Modules*, 1972 — information hiding: hide the decisions likely to change
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules: small interfaces over large implementations
- Edsger W. Dijkstra, *The Humble Programmer* (EWD340), 1972 — abstraction as a new semantic level of precision
- Larry Tesler — the law of conservation of complexity
- Nelson F. Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*, 2023 (TACL 2024) — retrieval degrades for information placed mid-context
- Chroma, [*Context Rot: How Increasing Input Tokens Impacts LLM Performance*](https://research.trychroma.com/context-rot), July 2025 — across 18 models, performance falls well before the window is full (a 200K-token model degrades by ~50K)
- Anthropic, [*Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), 2025 — the smallest set of high-signal tokens; attention as the scarce resource
- Anthropic, Agent Skills documentation — progressive disclosure: description → SKILL.md → bundled resources
- Anthropic, *Writing effective tools for agents — with agents*, 2025 — tool description quality measurably moves agent performance
- Invariant Labs, *MCP Tool Poisoning Attacks*, April 2025 — hidden instructions in tool descriptions, processed as ground-truth because the description is what the agent consumes
- Model Context Protocol — tools as name + schema + description; implementation stays server-side
- Joel Spolsky, *The Law of Leaky Abstractions*, 2002 — all non-trivial abstractions leak
