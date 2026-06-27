---
featured: true
description: "Clean and simple are two different questions, not two words for good code. They have different natures — clean means the same thing at every level, simple only has meaning at one level at a time — and they hold each other up. AI made one of them almost free and left the other to you."
title: "Clean and Simple, Again"
tags:
- software engineering
- clean code
- abstraction
- ai
- testing
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

**clean** and **simple** are two different questions, and once you separate them, a lot of arguments about software design stop being arguments.

**TL;DR**

- **Clean and simple are two different questions, not two words for "good code."** Clean asks *does this have a clear, honest boundary?* Simple asks *how much must I hold in my head?* The opposite of clean is *dirty*; the opposite of simple is *complex*.
- **Their natures differ.** Clean means the same thing at every level of a system. Simple only has meaning at one level at a time.
- **They hold each other up.** A clean boundary is what lets a level stay simple while the level beneath it grows complex. When the boundary leaks, both fail at once.
- **AI changed the price of each.** It made clean almost free and left simple — the judgment about where complexity should live — to you.

## 1. What clean and simple each mean

Start by pulling the two words apart, because most of the confusion is just two ideas wearing one label.

### 1.1 Clean is about honest boundaries

Clean is about whether a boundary tells the truth. Does the name match what sits behind it? Is it obvious what belongs inside and what belongs outside? Is responsibility placed where you'd predict? Part of this is surface — consistent naming, formatting, a predictable spot for each thing, the hygiene a linter can see. But the part that carries weight is structural: a clean boundary is one you can trust without reading what's behind it. "Organization" is what cleanliness looks like from the outside; an honest boundary is what it actually is.

The opposite of clean is not complex. It is **dirty**: mixed responsibilities, misleading names, a function called `processData` that also sends email, three folders that could each hold the thing you're looking for. Dirty code can run perfectly. The computer does not care. Clean is a courtesy paid entirely to people.

So the question clean answers is:

```text
Where does this belong, and does its name tell the truth?
```

### 1.2 Simple is about how much you must hold in your head

Simple is about mechanics. Rich Hickey, in *Simple Made Easy* (2011), goes back to the root — *simplex*, "one fold." Something is simple when it is not folded together with other things, not braided, not entangled. Simple is an objective property of how few parts interact, independent of whether you happen to find it familiar.

simple is not **easy**. Easy means familiar — it reads comfortably because you have seen the pattern before. A heavyweight framework can be easy (one command to install) and not simple (a thousand entangled parts underneath). Easy is about you. Simple is about the thing.

The opposite of simple is **complex**: many concepts, many dependencies, behavior that depends on five things being true at once.

So the question simple answers is:

```text
How much must I understand before I can change this safely?
```

Two questions about the same thing — a boundary:

```text
Clean  → is the boundary honest?     (does the surface tell the truth about the inside?)
Simple → how much sits behind it?    (how many entangled parts, at this level?)
```

Hold onto that. Both interrogate one boundary; they just ask different things about it — and everything below is what happens when you ask them at different scales.

## 2. Clean and simple have different natures

Here is the part that took me longest to see. Clean and simple are not just different questions — they *behave* differently as you move up and down a system. They are not symmetric.

### 2.1 Clean means the same thing at every level

Clean asks the same question of a variable name and of a company's service map: *is the responsibility clearly placed, is the boundary honest, is the organization consistent?* The question never changes. Only the **dialect** changes.

| Level | What "clean" is spoken in |
|---|---|
| A line of code | clear expression, one idea |
| A method | a name that matches the body, one responsibility |
| A class | high cohesion, a small honest interface |
| A module | a clear boundary, one reason to exist |
| An architecture | dependencies that point the right way |
| A UI | a consistent visual language |
| A team | obvious ownership |

Same question, different vocabulary. And there is a second property that's easy to miss: **clean does not compose.** A clean architecture does not make the code inside it clean, and dirty code does not leak upward to dirty the architecture. You can have an immaculate dependency diagram drawn over methods named `tmp` and `doIt2`. Clean has to be true *at each level independently*. It is checked everywhere, separately.

### 2.2 Simple only has meaning at one level at a time

Simple is the opposite. You cannot call a whole system simple. You can only call it simple *at a stated level*.

Consider a checkout that calls `pay()`. At the level of the checkout, that line is simple — one step, one idea. Underneath, `pay()` may carry retries, idempotency keys, a database transaction, a circuit breaker, metrics, and a Stripe call. That lower level is genuinely complex. And that is not a failure. That is exactly what the abstraction is *for*.

John Ousterhout (*A Philosophy of Software Design*, 2018) calls this a **deep module**: a small interface hiding a large implementation. The whole value of the boundary is that the complexity below it does not have to be in your head above it.

This is also Tesler's Law — the conservation of complexity. A system carries an irreducible amount of complexity that you can move but never delete. Good engineering pushes it *down*, into a lower level, so the levels above stay simple. So the answer to "is this simple?" depends entirely on which floor you're standing on.

One correction, because it's the exact mistake I kept making: **complex is not the same as messy.** The level below being *complex* is fine — that's where you parked the complexity on purpose. The level below being *messy* is a different problem entirely. Messy is a **clean** failure, and it is local to that level. It does not get a pass just because the level above it reads nicely.

```text
Lower level is complex  → fine, that's the job of the boundary
Lower level is messy    → a cleanliness failure, right there, at that level
```

## 3. How clean and simple relate

So they're different questions with different natures. Are they independent? 
- Within a single level, yes. 
- Across levels, no.

### 3.1 Within one level they are independent

At one level, you can have either without the other. The four combinations are real:

| | **Simple** | **Complex** |
|---|---|---|
| **Clean** | the ideal — organized and easy to reason about | tidy, well-named, well-organized — and still a maze |
| **Dirty** | a quick script that works because there's nowhere for the mess to hide | the legacy nightmare — tangled and unreadable |

The bottom-right cell is the one everyone fears. The top-right cell is the one that gets merged, because nothing about it trips a reviewer's instinct. It is clean. It just isn't simple.

### 3.2 Across levels they hold each other up

Now zoom out, and the independence disappears. Across levels, clean and simple are **mutually dependent**.

A clean boundary is what *lets* a level stay simple. The only reason `checkout()` can ignore retries and transactions is that `pay()` has an honest interface that contains them. The cleanliness of that boundary is load-bearing — it is what keeps the complexity below from becoming your problem above.

And it runs the other way too. When a level gets too complex, it tends to go *dirty* — it starts leaking. Joel Spolsky named this in 2002: the Law of Leaky Abstractions — *all non-trivial abstractions, to some degree, leak.* Hibernate is the classic case. It offers a beautifully clean promise: forget SQL, just save objects. Then one day the N+1 query problem surfaces, the SQL underneath punches up through the interface, and suddenly the level you thought was simple is anything but. A leak is a boundary caught lying — a *dirty* boundary — and that dishonesty is exactly what drags the simplicity above it down too.

So the relationship is reciprocal:

```text
A clean boundary keeps the level above it simple.
A level that stays simple keeps its boundary honest.
When one gives way, so does the other.
```

Neither concept is in charge. They prop each other up.

## 4. The same two questions at every level of a system

Once you see that both are properties of *boundaries* rather than of code specifically, they stop being code-review words and start applying everywhere. Software is a stack of abstractions, and you can ask both questions on every floor:

```text
statement → method → class → module → architecture → system → product
```

Each floor stands on the one below it and hides it. And on each floor, the same two questions apply — clean keeping its meaning, simple shifting its scope:

| Level | Clean asks | Simple asks |
|---|---|---|
| Statement | is this one readable idea? | does it do one thing? |
| Method | does the name match the body? | how many paths run through it? |
| Class | is the interface honest? | how many things does it depend on? |
| Module | is the boundary clear? | how coupled is it to its neighbors? |
| Architecture | do dependencies point the right way? | how many layers must a request cross? |
| System | does each service own one capability? | how few services, how direct the calls? |
| Product | are the journeys and UI consistent? | how few steps to the goal? |

This is why the same two words show up whether you're naming a variable or drawing a service map. They are not advice about code. They are the two axes on which any abstraction is judged.

## 5. Telling them apart in practice: try to change it

Here's the practical problem. Clean is cheap to *fake*. Good names, tidy structure, a passing linter — a thing can look clean and still be complex underneath, and reading it won't tell you which. So how do you actually find out whether something is as good as it looks?

You don't read it. You try to change it. And the cheapest way to try to change something is to test it — not refactor it for real, not ship it and find out in production.

Back to the method I couldn't test. Here is the shape of it:

```java
BigDecimal checkout(Cart cart, Customer customer) {
    BigDecimal total = cart.subtotal();

    if (customer.isMember()) total = total.multiply(MEMBER_RATE);
    if (saleIsActive())      total = total.multiply(SALE_RATE);
    if (customer.hasCoupon()) total = total.subtract(couponValue);

    // and the new one, jammed in right here:
    if (customer.getAge() < 18 && cart.hasAlcohol())
        throw new IllegalStateException("No alcohol for under-18");

    return total;
}
```

Read it and it's clean. Test it and it isn't simple. Those are four independent conditions, and independent conditions don't add — they multiply: each one the code can take or skip, so the paths through the method are the *product* of the branches, not the sum.

```text
if (isMember)                 2   (taken / skipped)
if (saleIsActive)             2
if (hasCoupon)                2
if (age < 18 && hasAlcohol)   3   ← not 2 — see below
                            ─────────
                2 × 2 × 2 × 3 = 24 paths
```

Three of those are plain forks — two ways through each. The fourth isn't: `age < 18 && hasAlcohol()` is really two checks, and short-circuit evaluation gives it *three* outcomes — first half false (skip), both true (throw), or first true and second false (skip) — so it counts as three, not two. Treat all four as simple forks and you'd guess `2⁴ = 16`; that one hidden fork makes it 24. A sibling method with six conditions runs to sixty-four.

Nobody writes sixty tests. We write the handful that look likely, call it good coverage, and move on. That isn't laziness — it's the rational response to a cost that no clean-code tool measures. The reading was honest. The testing is what exposed the entanglement.

This is the sensor. When the tests for one unit start multiplying, the unit is complex, no matter how clean it reads. In a hand-written TDD loop, you feel this directly — *the tests are getting awkward to write* was always Kent Beck's signal to stop and refactor. Test pain is how a human detects entanglement. It's the difference between clean and simple, made physical.

## 6. What changes when AI writes the code

Everything above predates AI. But AI changes the *price* of clean and the price of simple, and it moves them in opposite directions.

### 6.1 AI makes clean almost free

A language model produces the next token that is most plausible given everything it has seen. That is a precise description of *easy* — familiar, conventional, locally fluent. Which means it is also a near-perfect clean-code generator. Good names, the local style, consistent formatting, small methods, the right shape. The thing that teams spent a decade nagging each other into during code review, a model now does for free, on the first pass.

Clean has been commoditized. That's genuinely good. It's also why "does it look clean?" has quietly stopped being a useful review question — the answer is almost always yes.

### 6.2 Simple is the judgment AI leaves to you

Simple did not get cheaper, because simple is a different kind of decision. Deciding where complexity should live — which boundary absorbs it, which level stays thin — is a global judgment about the whole system, not a local pattern you can predict token by token. The model has no view of it. It also never feels the test pain from section 5, because it isn't the one who has to write the sixtieth test. So it adds the next plausible branch, and the next, and lands in the clean-but-complex cell by default.

I've argued before that AI does development, not engineering. This is the same line, drawn through these two words. Clean is development — local, mechanical, now automatable. Simple is engineering — the judgment about structure that decides where the complexity goes. AI took over the first and handed you the second, concentrated.

## 7. Where this leaves us

Clean and simple were never one idea. They are two questions — *where does this belong?* and *how much must I understand?* — with two different natures. Clean means the same thing at every level and has to be earned at each one. Simple only exists relative to a level, and survives only as long as the boundary beneath it stays honest. They are independent within a level and inseparable across levels, each holding the other up.

What AI changed is not the distinction. It's the economics. One of these is now almost free, and the other is now the whole job.

That leaves the practical question still hanging: a deep module hides complexity well — but *how deep should it go?*

The big names point in a direction and stop. Ousterhout says deeper is better and calls depth a ratio; Parnas says hide one secret; Uncle Bob says shrink it until it's tiny. Every one is true — and not one is a number you can act on at 2am with the method open in front of you.

I have one, and from years of practising TDD I'll commit to a number where they wouldn't: **keep the unit test within two levels of nesting.** Push the module deeper and the test's nesting climbs with it until the test itself is unmaintainable — and that unmaintainable test is the module telling you it went too deep. The test is the measuring stick the philosophers never handed you. Why two and not three, what counts as a level, and how the test pain from section 5 makes it self-enforcing is the next few posts — where, on this one question, I think I land closest to right, because a number you can apply under pressure beats a principle you can only nod at.


## References

- Rich Hickey, *Simple Made Easy*, Strange Loop 2011 — [transcript](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md)
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules
- David Parnas, *On the Criteria to Be Used in Decomposing Systems into Modules*, 1972 — one secret per module
- Ousterhout & Robert C. Martin, [*A Philosophy of Software Design* vs *Clean Code*](https://github.com/johnousterhout/aposd-vs-clean-code), 2024–25 — the function-size / module-depth debate
- Joel Spolsky, *The Law of Leaky Abstractions*, Joel on Software, 2002
- Larry Tesler — the Law of Conservation of Complexity
- Kent Beck — the refactor-on-test-pain step of the TDD loop
- Dan Abramov, *Goodbye, Clean Code*, overreacted.io, 2020; Sandi Metz, *The Wrong Abstraction*, 2016
