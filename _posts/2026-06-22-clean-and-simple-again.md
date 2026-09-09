---
featured: true
description: "Clean describes component boundaries. Simple describes composition. At any abstraction level, clean boundaries keep lower-level details out of higher-level code; simple composition keeps peer components untangled. AI makes tidy code cheap. Boundaries and composition still take judgment."
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

Clean is whether a component tells the truth at its boundary. Simple is whether its parts remain distinct inside.

**TL;DR**

- **Clean describes a component's boundary.** A clean boundary makes a clear promise and keeps it.
- **Simple describes its internal composition.** Components may interact, but their state, order, and responsibilities should not become entangled.
- **They diagnose different problems.** A component can have a clean boundary and complex internals, or a dirty boundary and simple internals.
- **Clean supports simplicity above.** It keeps lower-level concerns from becoming dependencies at the level above, but it cannot control how components there relate.
- **AI makes code changes cheap to produce.** Clean reduces the context needed; simple keeps reasoning and change local.

## 1. Clean describes a component's boundary

A clean boundary makes a clear promise and keeps it. It exposes what callers need to know and hides what they do not.

The opposite of clean is dirty. A dirty boundary is vague, misleading, or forces callers to inspect the implementation to understand the contract.

```java
// dirty boundary, hidden responsibility
void saveOrder(Order order) {
    repository.save(order);
    emailService.sendConfirmation(order);
}

// clean boundary
void placeOrder(Order order) {
    repository.save(order);
    emailService.sendConfirmation(order);
}
```

```java
// leaking implementation details
PaymentResult pay(
    Order order,
    int retryCount,
    Duration retryDelay,
    String providerId
)

PaymentResult pay(Order order)
```

```java
// the name understates the responsibility
void validateCustomer(Customer customer) {
    // validates identity
    // checks sanctions
    // updates verification status
    // writes an audit record
}
```

## 2. Simple describes a component's internal composition

Viewed from outside, a component is one thing. Look inside, and it becomes a composition of smaller components. Simple describes that composition.

A composition is simple when its components remain distinct while working together.

The opposite of simple is complex. In *Simple Made Easy*, Rich Hickey contrasts simple with complex. Simple things are not intertwined. Complex things are folded together, so understanding or changing one requires reasoning about the others.

Simple is not easy. Easy means familiar—it feels easy because you have seen the pattern before. A heavyweight framework can be easy (one command to install) and not simple (a thousand entangled parts underneath). Easy is about you. Simple is about the thing.

Simple is not small. Fewer components do not make a composition simpler. A hundred distinct components can form a large but simple composition. Two components that share state, order, and assumptions can form a small but complex one.

Complexity adds mental load because several concerns must be understood together.

Can I understand one component without tracing hidden state, order, or assumptions through the rest?

## 3. Clean and simple diagnose different problems

Clean diagnoses the boundary. Simple diagnoses the composition inside it.

| | **Simple inside** | **Complex inside** |
|---|---|---|
| **Clean boundary** | **Well-separated:** callers trust the contract; internal changes stay local | **Contained complexity:** callers are protected, but internal changes affect several concerns |
| **Dirty boundary** | **Boundary problem:** the parts are distinct, but callers cannot trust the contract | **Both fail:** callers inspect the implementation, and internal changes spread |

A payment component may expose an honest `pay()` boundary while hiding a substantial or even complex implementation. John Ousterhout calls a small interface hiding substantial work a **deep module**. The boundary does not remove the work; it keeps that work inside payment.

## 4. How clean boundaries support simplicity above

An **abstraction level** is a chosen view of a system.

```text
application sees:   checkout
inside checkout:    payment + stock + delivery
inside payment:     retries + transaction + provider
```

Move inward and a component becomes a composition. Move outward and a composition becomes a component.

At the checkout level, payment is one component. A clean `pay()` boundary lets checkout use payment without knowing about retries, transaction state, idempotency, or the provider.

The work inside payment has not disappeared. The boundary keeps it at the level that owns it. Only payment's contract becomes part of the checkout composition.

This protects checkout from one source of complexity: coupling to payment's internal state, order, and assumptions.

But a clean payment boundary does not make checkout simple. Payment, stock, and delivery may still share state, depend on hidden ordering, or make assumptions about one another:

```text
payment → stock → delivery → payment
```

Their boundaries may all be clean while their composition remains complex.

```text
Clean  → keeps lower-level concerns local
Simple → keeps relationships within a level untangled
```

Clean boundaries help preserve simplicity above.

## 5. Change tests cleanliness and simplicity

Consider a method that prices an order:

```java
Price calculatePrice(Order order) {
    Price total = order.subtotal();

    if (order.customer().isMember())
        total = total.multiply(MEMBER_RATE);

    if (order.sale().isActive())
        total = total.multiply(SALE_RATE);

    if (order.hasCoupon())
        total = total.subtract(order.couponValue());

    return total;
}
```

From outside, the boundary is clean:

```java
Price calculatePrice(Order order)
```

The name matches the behavior, the input and output are explicit, and there are no hidden effects. The caller does not need to know how pricing works.

Inside, however, the rules are folded together through a shared `total`, execution order, and assumptions about the rules that ran before them.

Now add a bulk discount:

```java
if (order.isBulk())
    total = total.multiply(BULK_RATE);
```

The implementation is one line, but the design raises several questions:

- Does the bulk discount run before or after the coupon?
- Can it combine with the member discount?
- Does sale pricing affect it?
- Which combinations need testing?

A local change has created non-local reasoning. Adding one rule forces us to reconsider the rest. That is entanglement.

Kent Beck treated awkward tests as a signal to refactor. Here the signal is specific: testing one pricing rule requires scenarios for the others.

Extracting four methods would separate the lines, not the concerns. If those methods still mutate the same value in sequence, the shared state and ordering remain. The rules need distinct contracts, and their interaction needs an explicit owner:

```java
Discount member = memberDiscountFor(order);
Discount sale = saleDiscountFor(order);
Discount coupon = couponDiscountFor(order);
Discount bulk = bulkDiscountFor(order);

return pricingPolicy.price(
    order.subtotal(),
    member,
    sale,
    coupon,
    bulk
);
```

Each rule now computes its own contribution. `PricingPolicy` owns whether the rules combine and in what order. The necessary pricing complexity has not disappeared; it has an explicit home. Individual rules can be tested separately, while policy tests cover their interactions.

```text
caller
  |
calculatePrice(order)   unchanged boundary
  |
pricing policy          owns the interactions
  |
member + sale + coupon + bulk
```

The clean boundary allowed the internal structure to change without affecting callers. The simpler internal composition makes future rule changes more local.

## 6. What AI changes

Everything above predates AI. AI changes the cost of producing code, not the meaning of clean or simple.

Tidy code is now cheap. A model can rename variables, extract methods, apply patterns, and make code look consistent in seconds. Appearance is therefore a weaker signal of design quality.

Clean boundaries reduce the context needed to use a component. If `pay()` is an honest contract, a human or an AI can work on checkout without reading payment's retry logic, transaction handling, or provider integration.

A dirty boundary removes that advantage. Its implementation must enter the context before the boundary can be trusted.

Simple composition reduces how many concerns must be reasoned about together. If pricing rules remain distinct, changing one mostly requires understanding that rule and the policy that composes it. If the rules share state, depend on execution order, or carry hidden assumptions about one another, they must be understood together.

```text
Clean  → reduces the context needed to use a component
Simple → reduces the concerns that must be reasoned about together
```

AI makes code changes cheap to produce. It does not make hidden dependencies cheap to understand.

It can also disguise them. Four `if` statements can become four well-named strategy classes while preserving the same shared state and ordering.

Fast generation amplifies the structure it inherits. Clean boundaries and simple composition keep changes local and reviewable. Leaky boundaries and entangled components let changes spread.

Tests and architectural constraints give AI observable limits. They encode design decisions; they do not make them.

This is the distinction I drew in [Development vs Engineering]({% post_url 2026-02-13-development-vs-engineering %}): AI can implement a stated design. Engineering still decides and validates the boundaries, responsibilities, and allowed relationships.

Two questions remain useful:

```text
Clean  → Can I trust this boundary without opening the implementation?
Simple → Can I change one concern without tracing hidden coupling through the rest?
```

AI makes code cheaper. Clean and simple help keep changes local.

## References

- Rich Hickey, *Simple Made Easy*, Strange Loop 2011 — [transcript](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md)
- John Ousterhout, *A Philosophy of Software Design*, 2018 — deep modules
- Kent Beck — test pain as a signal to refactor
