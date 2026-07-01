---
featured: true
description: "Clean and simple are two different questions, not two words for good code. They work differently across a system's levels — clean means the same thing at every level, simple only has meaning at one level at a time — and simplicity rests on a clean boundary. Clean itself has two layers: surface and structural. AI made surface clean almost free and left the rest — honest boundaries and simplicity, the judgment about where complexity goes — to you."
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

**clean** and **simple** are two different questions, and once you separate them, a lot of arguments about software design quietly dissolve.

**TL;DR**

- **Clean and simple are two different questions.** Clean asks *does this have a clear, honest boundary?* Simple asks *how much must I hold in my head?* The opposite of clean is *dirty*; the opposite of simple is *complex*.
- **Clean is level-independent; simple is level-relative.** Clean means the same thing at every level of a system. Simple only has meaning at one level at a time.
- **Simple rests on clean.** A clean boundary keeps the level above it simple; overload it and both fail at once.
- **Clean itself has two layers.** 
    - *Surface* clean is form — formatting, style, a predictable spot; the look a linter enforces.
    - *Structural* clean is the boundary telling the truth — an honest name, one responsibility, the right place. Surface is mechanical; structural is judgment, the same kind simple needs.
- **AI changed the price of each.** *Surface* clean is mechanical, so AI now does it for free. *Structural* clean and simple both come down to judgment — where to draw a boundary, where complexity should live — which AI can't do well. AI took the cheap layer and left you the two that matter.

## 1. What clean and simple each mean

Start by pulling the two words apart, because most of the confusion is just two ideas wearing one label.

### 1.1 Clean is about honest boundaries

Clean is about whether a boundary tells the truth. 
- Does the name match what sits behind it? 
- Is it obvious what belongs inside and what belongs outside? 
- Is responsibility placed where you'd predict? 

Clean has two layers.

- **Surface clean — the *form*.** How the code looks: consistent formatting, a house style, a predictable spot for each thing. Tools enforce it mechanically, without understanding a single line — a formatter rewrites the layout, a linter flags the rest. None of it is about whether the code tells the truth.
- **Structural clean — the *truth*.** Whether the boundary is honest: its name tells the truth about what's inside, it carries one responsibility, it sits in the right place, and you can trust it without reading behind it.

"Organization" is what surface clean looks like from the outside; an honest, well-placed boundary is what structural clean actually is.

The opposite of clean is **dirty**: a boundary that doesn't tell the truth — a function named `processData` that also sends email, one method carrying three responsibilities, a name that promises one thing and delivers another. You catch dirt by reading. Dirty code can run perfectly; the computer does not care. Clean is a courtesy paid entirely to people.

So the question clean answers is:

```text
Where does this belong, and does its name tell the truth?
```

### 1.2 Simple is one concern, standing on its own

Simple is about being *one thing*. Rich Hickey, in *Simple Made Easy* (2011), goes back to the root — the Latin *simplex*, from *sim-* ("one") and *-plex* ("fold," as in *duplex*, twofold). One fold: one concern, one role, standing on its own, not folded together with anything else. That is the property itself — objective, a fact about the thing, not about whether you happen to find it familiar. *How much you must hold in your head* is what you feel as a result: when a thing is one concern, there is little to hold. The mental load is the symptom; being one concern is the thing itself.

simple is not **easy**. Easy means familiar — it reads comfortably because you have seen the pattern before. A heavyweight framework can be easy (one command to install) and not simple (a thousand entangled parts underneath). Easy is about you. Simple is about the thing.

The opposite of simple is **complex**: parts folded *together*, so you can't take one on its own — touch it and you've touched the rest. That entanglement is the whole of it. And notice what complex is *not*: it is not the same as *size*. A hundred parts that never touch each other make a large thing, not a complex one — nothing is tangled, so you take them one at a time. Size is its own axis. What makes something complex is not how many parts it has; it is how tangled they are.

So the question simple answers is:

```text
How much must I understand before I can change this safely?
```

Two questions about the same thing — a boundary:

```text
Clean  → is the boundary honest?     (does the name tell the truth about the inside?)
Simple → how much must you hold at once?  (how tangled is it, at this level?)
```

Hold onto that. Both interrogate one boundary; they just ask different things about it — and everything below is what happens when you ask them at different scales.

## 2. Clean and simple behave differently across levels

Clean and simple are not just different questions — they *behave* differently as you move up and down a system.

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

Same question, different vocabulary. And there is a second property that's easy to miss: **clean does not compose.** A clean architecture does not make the code inside it clean, and a mess inside does not travel upward to spoil the architecture. You can have an immaculate dependency diagram drawn over methods named `tmp` and `doIt2`. Clean has to be true *at each level independently*. It is checked everywhere, separately.

### 2.2 Simple only has meaning at one level at a time

Simple is the opposite. You cannot call a whole system simple. You can only call it simple *at a stated level*.

Consider a checkout that calls `pay()`. At the level of the checkout, that line is simple — one step, one idea. Underneath, `pay()` may carry retries, idempotency keys, a database transaction, a circuit breaker, metrics, and a Stripe call. That lower level is genuinely complex. And that is not a failure. That is exactly what the abstraction is *for*.

John Ousterhout (*A Philosophy of Software Design*, 2018) calls this a **deep module**: a small interface hiding a large implementation. The whole value of the boundary is that the complexity below it does not have to be in your head above it.

This is also Tesler's Law — the conservation of complexity. A system carries an irreducible amount of complexity that you can move but never delete. Good engineering pushes it *down*, into a lower level, so the levels above stay simple. So the answer to "is this simple?" depends entirely on which floor you're standing on.

```text
Lower level is complex  → fine, that's the job of the boundary
```

## 3. How clean and simple relate

So they're different questions with different natures. Are they independent? 
- Within one level, they are independent. 
- Across levels, they are not.

### 3.1 Within one level they are independent

At one level, you can have either without the other:

| | **Simple** | **Complex** |
|---|---|---|
| **Clean** | the ideal — organized and easy to reason about | tidy, well-named, well-organized — and still a maze |
| **Dirty** | a quick script that works because there's nowhere for the mess to hide | the legacy nightmare — tangled and unreadable |

The bottom-right cell is the one everyone fears. The top-right cell is the one that gets merged, because nothing about it trips a reviewer's instinct. It is clean. It just isn't simple.

The independence here is the *surface*-clean kind — nice names laid over a maze. Structural clean is where the two axes start to touch, and that only shows up once you move across levels.

### 3.2 Across levels, simple rests on clean

Across levels, simplicity rests on clean boundaries.

- **A clean boundary keeps the level above it simple.** `checkout()` can ignore retries, transactions, and the Stripe call only because `pay()` honestly contains them. That cleanliness is load-bearing.
- **Overload the boundary and both collapse.** A boundary hides the complexity below only while it stays deep enough to cover it. Push more behind it than it can honestly hold, and the complexity shows through: the level above is no longer simple, and the boundary that promised to contain it was lying.

Hibernate is the classic case — the famous "leaky abstraction" (Joel Spolsky, 2002). "Forget SQL, just save objects," until the N+1 query problem surfaces, the SQL shows through the interface, and the level you thought was simple is anything but. Its names are honest and a linter finds nothing; it lied anyway — about what it could hold.

You can no longer trust the boundary, so you read what's behind it — and reading down is how the complexity below reaches you.

## 4. The same two questions at every level of a system

The two questions are the ones we started with — **clean** (*is the boundary honest?*) and **simple** (*how much must you hold?*). Software is a stack of abstractions, and you can ask both on every floor:

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

*Surface* clean is cheap to *fake*. Consistent names, tidy structure, a passing linter — a thing can wear all of that and still not be simple underneath, and reading it won't tell you. Surface polish and genuine simplicity look identical on the page. So how do you actually find out whether something is as good as it looks?

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

Read it and it's clean. Test it and it isn't simple — because these conditions don't stay in their lanes. The pricing rules all write to the same running `total`, so their effects fold together: the member discount lands on a number the sale has already changed, which the coupon then changes again. You can't pin down what one rule does to the result without fixing what the others did. And since each of these is a fork the code can take or skip, the cases you'd have to test multiply rather than add — the *product* of the branches, not the sum:

```text
if (isMember)                 2   (taken / skipped)
if (saleIsActive)             2
if (hasCoupon)                2
if (age < 18 && hasAlcohol)   2
                            ─────────
                2 × 2 × 2 × 2 = 16 paths
```

Four forks, sixteen paths. A sibling method with six conditions runs to sixty-four.

Nobody writes sixty tests. We write the handful that look likely, call it good coverage, and move on. That isn't laziness — it's the rational response to a cost that no clean-code tool measures. The reading was honest. The testing is what exposed the tangle.

This is the sensor. When the tests for one unit blow up like this, the unit is complex — its parts folded together — no matter how clean it reads. In a hand-written TDD loop you feel it directly: *the tests are getting awkward to write* was always Kent Beck's signal to stop and refactor. Test pain is how a human detects entanglement. It's the difference between clean and simple, made physical.

## 6. What changes when AI writes the code

Everything above predates AI.

- **Surface clean → almost free.** Conventional names, house style, formatting, small methods — the plausible token *is* the clean-looking one. What teams spent a decade nagging each other into at review, a model now does on the first pass.
- **Structural clean → still yours.** Whether a name tells the truth, whether the responsibility belongs here — that's not form, it's a judgment about the whole system. The model writes a name that matches the body it just wrote; it can't tell you the body belongs somewhere else.
- **Simple → still yours.** Where complexity should live is the same global judgment. The model has no view of it, and never feels the test pain — so it adds the next plausible branch and lands in the clean-but-complex cell by default.

So "does it *look* clean?" has stopped being a useful review question; the answer is almost always yes. What still bites are the two that take judgment — and those two are one kind of work: structural clean and simple ask different questions (*is the boundary honest?* vs *how tangled is what's behind it?*) but take the same call — where to draw the boundary, and what to put behind it.

I've argued before that AI does development, not engineering. Here is that line, exactly: surface clean is development — mechanical, now automatable; structural clean and simple are engineering — judgment. AI took the first and handed you the rest, concentrated.

## 7. Where this leaves us

Clean and simple were never one idea. They are two questions:

- **Clean** — *where does this belong, and does its name tell the truth?* The same question at every level, earned separately at each.
- **Simple** — *how much must I hold at once?* Meaningful only at a stated level, and only while the boundary below holds.

AI didn't change that distinction. It changed the price. Surface clean — the form — is now almost free. What's left is judgment: draw honest boundaries, keep levels simple — the same call, made at every level. That is the whole job now.

Which leaves one question hanging. A boundary buys simplicity above by hiding complexity below — a deep module. But *how deep should it go?* The big names point and stop: Ousterhout says deeper is better; Parnas says hide one secret; Uncle Bob says make it tiny. All true — and not one is a number you can act.

I have one, from years of TDD: **keep the unit test within two levels of nesting.** Push the module deeper and the test's nesting climbs with it, until the test itself turns unmaintainable — and that unmaintainable test is the module telling you it went too deep. The test is the measuring stick the philosophers never handed you. Why two, what counts as a level, and how test pain makes it self-enforcing is the next few posts — because a number you can apply under pressure beats a principle you can only nod at.


## References

- Rich Hickey, *Simple Made Easy*, Strange Loop 2011 — [transcript](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md)
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules
- David Parnas, *On the Criteria to Be Used in Decomposing Systems into Modules*, 1972 — one secret per module
- Ousterhout & Robert C. Martin, [*A Philosophy of Software Design* vs *Clean Code*](https://github.com/johnousterhout/aposd-vs-clean-code), 2024–25 — the function-size / module-depth debate
- Joel Spolsky, *The Law of Leaky Abstractions*, Joel on Software, 2002
- Larry Tesler — the Law of Conservation of Complexity
- Kent Beck — the refactor-on-test-pain step of the TDD loop
- Dan Abramov, *Goodbye, Clean Code*, overreacted.io, 2020; Sandi Metz, *The Wrong Abstraction*, 2016
