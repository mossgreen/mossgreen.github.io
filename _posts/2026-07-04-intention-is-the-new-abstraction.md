---
description: "An abstraction is a contract over a hidden implementation. Software stacks them for two reasons: nobody holds the whole system, and parts must change independently. Contracts came in two kinds, formal for machines and natural for humans, and an LLM is the first machine that consumes the natural kind in general. So intention is a new abstraction: you state the result, the model supplies the implementation. One old rule governs the new layer and every layer under it. Give the contract, not the implementation, and keep every contract true."
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

Models. MCP. Skills. Subagents. Code modules. What do they share? 

Each exposes a small contract to its caller and hides the implementation behind it.

Why? Two old reasons: nobody can hold the whole thing, and what stays hidden stays free to change.

The sentence you type to AI is a contract too: tell the intention, and the machine supplies the implementation.

So one of the oldest rules in software engineering — *program to an interface, not an implementation* — has a new top layer to govern: **intention is the new abstraction.**

**TL;DR**

- **An abstraction is a contract over a hidden implementation.** Software stacks them for two reasons: nobody holds the whole system, and parts must change without forcing changes in each other.
- **Intention is a new abstraction.** You state the result in ordinary language; the model supplies the implementation.
- **One rule:** give the contract, not the implementation. Break it now and you pay at once, in two ways: the model's attention is diluted, and its output is coupled to internals.

## 1. What an abstraction is

- An **abstraction** is a contract over a hidden implementation.
- A **contract** is what one side may rely on the other to deliver: the provider promises, the consumer relies.
- An **implementation** is how the promise is kept.
- An **interface** is the contract's readable surface: the names, types, and descriptions you can actually load.

Software is a stack of abstractions. Each layer gives the layer above a contract and keeps its implementation to itself.

  - A function hides its body behind a signature.
  - A module hides its functions behind an interface.
  - A service hides its modules behind an API.

The stack exists for two reasons:

1. **Bounded capacity.** Nobody holds a whole system in their head. A contract lets you use a layer without reading it. This is Ousterhout's deep module: a small interface over a large implementation.
2. **Independent change.** Parts must be able to change without forcing changes in each other. A contract fixes what each side may rely on, so everything behind it is free to change. This is Parnas's rule: hide the decisions likely to change.

## 2. Intention is the new layer

Contracts come in two kinds.

**Formal contracts** are for machines: a function signature, an SQL query, an HTTP request. Their syntax and meaning are fixed by the language's definition.

**Natural contracts** are for humans: a spec, a ticket, a requirement, a README. A product manager writes "customers can cancel within 30 days," and a person turns that sentence into code.

An LLM is (probably) the first machine that consumes natural contracts in general. You hand it a sentence about a schema, a codebase, or a refund policy, and it acts on that sentence. No human stands in between. No domain was built for it in advance. The meaning is inferred by the model, not fixed by a language definition.

**Intention is the new abstraction:** you pass the intent, and the machine supplies the implementation. The contract that used to require a human implementer is now a machine interface.

Dijkstra defined the purpose of abstraction as creating "a new semantic level in which one can be absolutely precise." 

The new layer has no absolute precision. A natural sentence carries none, so you have to pin the meaning yourself — see [The Real Prompt Engineering]({% post_url 2026-04-03-the-real-prompt-engineering %}). This is the one place the new layer is weaker than every layer below it, and the work of being precise falls to you.

Putting the precision back means stating three things and leaving the rest to the model:

- **The outcome** — what must be true when the work is done.
- **The constraints** — a security requirement, a compatibility guarantee, an approval step. Not "how," but part of what you want.
- **The check** — how you will know the outcome is met.

## 3. The abstraction rule

Program to an interface, not an implementation. In this post's words: **use the contract, not the implementation.**

Below your intention, the model does the same. To meet the contract you gave it, it composes contracts:

| In the window | The implementation | Where it lives |
|---|---|---|
| a common word | everything the model has learned about it | the model's weights |
| an MCP tool description | auth, API calls, pagination | the server |
| a skill's description line | procedures, scripts, resources | the skill folder |
| a subagent's task and result | the full transcript of the work | the subagent's own window |

Each row is the same design: contract in the window, implementation elsewhere. But the rows split in two:

- **Readable boundaries.** A skill's deeper layers, a code file's body — these *can* be loaded later. This is where the rule needs discipline.
- **Opaque by construction.** The weights, the server's internals, a subagent's transcript — these can never enter the window at all.

Your prompt is a contract, and it can carry either side. 
  - *"Loop over each line, split on the equals sign, handle escaped quotes, then retry the write three times"* is an implementation typed into the window. You have chosen the method yourself, so the model only writes down what you decided. 
  - *"Parse this config file and save it; fail if the disk is full"* is a contract. It gives an outcome and a constraint, and says nothing about method. Both may come back as working code. Only the second still says what you wanted after the code changes.

The discipline, in AI coding:

- read the implementation of what you are changing;
- read only the interface of what you are using;
- descend past an interface when evidence or risk requires it

## 4. The cost of breaking the abstraction rule

- For human engineers, the rule was advice. You could ignore it and ship. The cost arrived later, as review debt or a breakage after someone else's refactor. 
- For a model, the cost arrives immediately — on the current output. 

1. **Bounded capacity ignored → dilution.**
  - The window is finite, and it degrades before it fills. Attention is spread across everything loaded. So low-signal tokens don't only cost space; they make the rest harder to use. This is measured, not felt. 
    - Liu et al. found models losing information placed mid-context; 
    - Chroma's *Context Rot* report, across 18 models, found accuracy falling as inputs grow — unevenly and differently by task, but well before any window limit. 
  - Anthropic's design goal follows: the smallest set of high-signal tokens that still gets the outcome. Minimal is not short, since the agent needs enough to act. Bigger windows don't help, because attention is spread over what you *load*, not over what you *could have* loaded. And complexity is conserved (Tesler's law), so move it behind a contract instead of into the window.

2. **Independent change ignored → coupling.** Put a body in the window and the model writes against what the code *happens to do* instead of what it *promises*. That is the oldest failure mode in software: a caller bound to private behavior, broken by the next refactor. Humans heard "program to an interface" for thirty years and read the source anyway. For an agent it is mechanism, not habit. With the internals in the window, nothing prevents the binding. With only the contract, nothing it has read enables it.

**What the model cannot see, it cannot couple to.**

## 5. Read behind a contract only on evidence

The rule is not *never look inside*. Looking inside is an escalation, and an escalation has to be paid for.

The price is specific to agents. A human reads a body, closes the file, and pays in time and cognitive load. An agent reads a body and it stays in the window for the rest of the session. Every later decision is made with those internals present. Reading inside is not a quick look; it permanently changes what the model reasons from.

Two reasons a human or an agent looks inside:

- **The contract is ambiguous.** Two tool descriptions overlap; a parameter's meaning is not pinned down.
- **Behavior contradicts the contract.** A function returns what its signature doesn't suggest.

Descent also needs a readable boundary. Behind an opaque one — the weights, the server, a finished subagent — there is nothing to open, and the only choice is to call it and compare conduct against contract.

## 6. The contract must be true

Every rule above assumes the contract tells the truth. A human digs into the details when one looks ambiguous — inefficient, but self-correcting. An agent working by this post's rule does not. It stays at the boundary by design, so the contract in its window is all it has. A tool description that overpromises, a function name that hides a side effect, a skill summary that doesn't match its procedure — each corrupts every decision downstream of it, and nothing at the boundary rejects it. The failure surfaces only in what the agent does.

MCP **tool poisoning** plants instructions inside a tool's description, and it works precisely because the description is what the agent consumes. The same fact has a constructive side. Anthropic's guidance on writing tools for agents shows description quality moving agent performance directly. A dishonest boundary used to cost a confused reader. Now it costs a confident wrong action at machine speed. 

In [Clean and Simple, Again]({% post_url 2026-06-22-clean-and-simple-again %}) I wrote that dirty code runs perfectly, the computer does not care — that *clean is a courtesy paid entirely to people*. That sentence is now out of date, and this is the correction: a new kind of computer started caring. Agents treat boundaries as true. They act on what the name says, not on what the body does. Honest naming, single responsibility, descriptions that match behavior — these stopped being code review niceties the day a machine started making decisions from them. AI turned clean from a courtesy into infrastructure.

The stack grew a new top layer, and the rule did not change. Information hiding has been advice since 1972. A compiler could hide a private field, but nothing stopped an engineer from reading the source and writing against what it happened to do. The cost arrived later, if it arrived at all. Now it arrives immediately, in the accuracy of the next answer. The oldest discipline in software turned out to be the operating rule for the newest machine.

## References

- Gamma, Helm, Johnson & Vlissides, *Design Patterns*, 1994 — "program to an interface, not an implementation"
- David Parnas, *On the Criteria to Be Used in Decomposing Systems into Modules*, 1972 — information hiding: hide the decisions likely to change
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules: small interfaces over large implementations
- Edsger W. Dijkstra, *The Humble Programmer* (EWD340), 1972 — abstraction as a new semantic level of precision
- Larry Tesler — the law of conservation of complexity
- Nelson F. Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*, 2023 (TACL 2024) — retrieval degrades for information placed mid-context
- Chroma, [*Context Rot: How Increasing Input Tokens Impacts LLM Performance*](https://www.trychroma.com/research/context-rot), July 2025 — across 18 models, accuracy falls as input length grows, non-uniformly and well before the window limit
- Anthropic, [*Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), 2025 — the smallest set of high-signal tokens; "minimal does not necessarily mean short"; attention as the scarce resource
- Anthropic, *Writing effective tools for agents — with agents*, 2025 — tool description quality measurably moves agent performance
- Invariant Labs, *MCP Tool Poisoning Attacks*, April 2025 — hidden instructions in tool descriptions, processed as ground-truth because the description is what the agent consumes
- Model Context Protocol — tools as name + schema + description; implementation stays server-side
