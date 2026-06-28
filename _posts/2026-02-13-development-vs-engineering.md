---
featured: true
description: "AI does development, not engineering — which is why 'entry-level' now means five years. The fix isn't hiring; it's designing above the code, where checking splits so juniors can verify again and the apprenticeship returns."
title: "Development Is Solved. Engineering Isn't."
tags:
- ai
- careers
- llm
- software engineering
- design is code
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

AI does development well, but not engineering.

Juniors are being squeezed out because development is the half AI can already do, and engineering is the half they haven't reached yet. The fix isn't to hire harder — it's to move up a level, to design, where checking the AI's output splits so juniors can verify again and grow into engineers.

## Development, not engineering

The entry-level software job is disappearing. Separate studies using different methods point the same way: Stanford found employment for 22- to 25-year-olds in the most AI-exposed jobs down by double digits while older workers held steady, and junior tech postings are down 34%, with the share demanding five-plus years climbing from 37% to 42% (Brynjolfsson et al., 2025; Indeed Hiring Lab).

Automation is supposed to take the routine, expensive work first. This did the opposite: it took the cheapest seats and left the expensive ones. Why would a tool that writes code cut the people who cost the least?

Because AI didn't take a slice of every job. It removed an entire level of seniority — the junior one. Development and engineering get used as synonyms; they aren't:

- **Development** — *a point in time.* The problem is already specified; produce the code that solves it: the function, the endpoint, the test. Discrete, gradeable, done when it passes.
- **Engineering** — *the same work, over time.* What to build, how it fits what's already there, how it fails in production, what it costs to own in two years — and whether it should exist at all.

Titus Winters put it in one line: **engineering is programming integrated over time** — and that integral is where AI is weak. It lives at the point — the prompt, the file, the moment — and there it's genuinely good. But it has no memory of the incident this code caused last year, no stake in the pager, no model of the system it was never shown.

Juniors were hired to do development — the gradeable work AI now does in seconds. A senior with AI covers what used to take a senior and three juniors, so the cheapest seats go first: AI substitutes for development and complements engineering (Acemoglu & Autor, 2011). And "five years" isn't a measure of time. It's the market's name for someone who has crossed from development into engineering — a blunt proxy for judgment it can't measure directly.

## The trap it sets

You don't arrive as an engineer. You become one by doing development — writing code, shipping it, being wrong about real systems, and paying for it. The integral is accumulated one point at a time. **AI took the points.** The development work that made engineers is the work it now does, so the line doesn't just wall juniors out — it removes the path everyone climbed to reach the other side.

In 1983 Lisanne Bainbridge named the mechanism — the *irony of automation*: automate the routine, and what's left for the human is the rare, hard judgment the routine used to train. Two things follow:

- **The apprenticeship gets cut — and no single firm can stop it.** Skipping juniors is locally rational:
  - they're cheaper to skip than to train,
  - the model covers the grunt work they used to do,
  - and a junior you train might leave for someone else.

  So every firm optimizes its own quarter and the shared pool drains: **the market bids up a senior supply it refuses to produce.**

- **The judgment can't be downloaded to shortcut the path.** Mine came as scars — code that compiled, passed review, demoed fine, then broke in a way I didn't see coming, each costing a day, each never hit again. Experience like that isn't a dataset:
  - a model trained on every bug report ever filed has everyone's scars as data — it knows the bugs better than I do;
  - but a scar isn't the knowledge of the bug; it's knowledge that *changed* me, a prior that fires before I can explain it;
  - and it only means something to the one who earned it, so it never transfers.

We're running Bainbridge's experiment on a whole profession.

## Verification is the new bottleneck

Shipping software used to cost *design + write + review*. AI drove *write* to near zero, so *review* is all that's left — and review is the one part AI makes harder, not easier:

- **Generation is free; checking isn't.** The model writes two hundred plausible lines in seconds and pays nothing for being wrong. A human still has to decide whether they're right.
- **The errors are silent.** AI code doesn't break when it's wrong; it hands you something confident and plausible, and you find out in production.

So verification is now the bottleneck. Even experts feel it: when METR had experienced developers use AI on code they knew well, it made them **19% slower** while they felt 20% faster (METR, 2025). And throughput is set by the bottleneck, so adding more AI generation doesn't speed things up — it just floods the reviewer with more code to check.

And who can do that — read two hundred opaque lines and reconstruct the intent nobody wrote down? The scarce seniors, from the pipeline we just drained. So "demand five-year hires" is really an attempt to buy verification capacity in the one market actively destroying it.

## The fix is above the code

You can't hire your way out. The only lever left is to make verification cheaper — by changing *what* you verify.

We've done this before. Every new level of abstraction let us stop writing the one below by hand and start directing it:

- **Assembly** hid raw machine code — short text instructions like `MOV` and `ADD` instead of the raw 1s and 0s.
- **C and the procedural languages** hid the hardware — registers, jumps, the specific machine — behind variables, functions, and loops.
- **Object orientation** hid implementation behind interfaces — you call a method without knowing the data structures or algorithm underneath.
- **Managed languages** — Java, C#, Python — hid memory itself, handing manual allocation to a garbage collector.

Each level hid the one below, and each time, the one we worked at became something the machine handled while we moved up. AI didn't add a new level; it automated the current one — writing code. So make the move we always make when a level gets cheap: step up to the one above. Above code is **design.**

Design makes verification cheap because it keeps the thing code throws away — the intent:

- **Code drops the *why*.** When you write a function you know the constraint, the tradeoff, the case you're guarding against. The code keeps the *what* and discards the *why*.
- **Reviewing code rebuilds that *why* — expensively.** You reverse-engineer intent from two hundred lines you didn't write. Call it the *understanding lost*; AI widens it, because it never formed an intent you could share.
- **Design *is* the *why*, written first.** Review against a design and you're not recovering what was discarded — you're checking output against an expectation you already hold.

That's what [Design is Code]({% post_url 2026-02-01-introducing-design-is-code %}) does: compile the design — PlantUML diagrams, decision tables — into tests that pin the implementation. From there:

- the design is the source of truth,
- the model generates against it,
- review is just checking the result against the pinned design.

That last point is the whole game. A clean, simple design bounds what the model can produce — smaller in scope, higher in level, its failures local instead of buried — so checking splits in two:

- **Conformance** — does the code match the design? Small, mechanical, pinned by the tests. The person who wrote the design can verify it, juniors included.
- **Soundness** — is the design itself right: will it scale, is it secure, does it handle the case nobody thought of? Still judgment, still senior — but a one-page artifact, not two hundred lines of mess.

A clean design can still be wrong — the scar you haven't earned doesn't show up in clean code — so soundness stays where the judgment is. But that judgment now lives on a design a junior can argue about and learn from, not in code only a senior can untangle. The bottleneck shrinks without more seniors, and the apprenticeship the trap destroyed comes back.

This isn't Big Design Up Front. You design the task in front of you — not the whole system up front — and revise it as you learn. It's executable, and the source of truth because it stays live, not because it's settled before you start.

Writing was never the hard part; it was the thinking around the writing — and that's the part you can write down.

## What this asks of juniors

Design lowers the entry bar and moves it. The skill that gets you in has changed:

- **Old skill:** producing details — syntax, boilerplate, glue. That's the half AI took.
- **New skill:** the structure those details hang on — architecture, and the principles that keep it clean and simple.

A junior who can shape a design directs the machine and checks the result against it — conformance, the part design makes cheap. The harder call, whether the design itself is sound, is the judgment they're there to build. A junior who only knows syntax skips both and just races the machine at the one game it always wins. Details still matter — you can't verify what you don't understand, or design what you've never built by hand — but they're a means now, not the product.

**If you're breaking in:**

- lead with design;
- build enough by hand to know what you're reviewing;
- show verified delivery — *"I designed this, pinned it with tests, and checked the model against it"* beats *"I prompted an AI and it worked."*

**If you're hiring:**

- give juniors design and review, not boilerplate;
- make the apprenticeship deliberate — the grunt work that used to carry it is gone;
- remember the pipeline you cut is the senior supply you'll be bidding on in five years.

The on-ramp didn't have to disappear. It has to be rebuilt one level up.

## Summary

AI does development — code at a point in time — but not engineering, the judgment integrated over time and across a system.

- **Juniors get squeezed.** Development was the work they were hired for.
- **The path up disappears.** You became an engineer by doing development — and AI took the development.
- **Verification becomes the bottleneck.** Writing is free now; checking isn't — and untangling AI's code takes the scarce seniors.

So you can't hire your way out. The fix is to change what you check: **code discards intent; design keeps it.** Move up to design, and checking splits — the tests confirm the code matches it, humans judge the design — so juniors can verify and learn where seniors once had to untangle. The on-ramp comes back, one level up from the code.

## References

**The thesis**

- **Software Engineering at Google** — Winters, Manshreck & Wright, *Software Engineering at Google* (O'Reilly, 2020) — "engineering is programming integrated over time." [link](https://abseil.io/resources/swe-book)
- **"Whether this is a secure design or an insecure design"** — Dario Amodei, CEO Speaker Series, Council on Foreign Relations (March 10, 2025): AI will write ~90% of code within months, while the human still owns design and judgment. [link](https://www.cfr.org/event/ceo-speaker-series-dario-amodei-anthropic)

**The evidence**

- **Canaries in the Coal Mine** — Brynjolfsson, Chandar & Chen, "Six Facts about the Recent Employment Effects of Artificial Intelligence," Stanford Digital Economy Lab (2025). [link](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/)
- **Tightening experience requirements** — Indeed Hiring Lab, "Experience Requirements Have Tightened Amid the Tech Hiring Freeze" (2025). [link](https://www.hiringlab.org/2025/07/30/experience-requirements-have-tightened-amid-the-tech-hiring-freeze/)

**The mechanics**

- **AI and experienced developers** — METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (2025). [link](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- **Ironies of Automation** — Lisanne Bainbridge, *Automatica* 19(6) (1983). [link](https://en.wikipedia.org/wiki/Ironies_of_Automation)
- **Tasks and technology** — Acemoglu & Autor, "Skills, Tasks and Technologies," *Handbook of Labor Economics* (2011).

**Design is Code**

- [designiscode.ai](https://designiscode.ai); [Design is Code: Disciplined Design, Deterministic AI Code Generation]({% post_url 2026-02-01-introducing-design-is-code %}).
