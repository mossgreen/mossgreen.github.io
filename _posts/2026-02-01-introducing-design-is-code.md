---
title: Design is Code - Deterministic AI Code Generation with UML and London-Style TDD
tags:
  - AI
  - LLM
  - Spec-Driven Development
  - Design Is Code
  - Claude Code
  - TDD
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

AI writes code fast. You review it slow. That's not collaboration — that's exploitation.

## The Problem No One Talks About

AI code generation has two root causes of failure.

**Natural language is ambiguous.** The same prompt produces different architectures every time. Consider: "Create a greeting service that builds a personalised greeting for a user."

```
# AI attempt 1: Calls repository, returns a string
class GreetingService:
    def greet(self, user_id):
        user = self.user_repository.find(user_id)
        return f"Hello, {user.name}"

# AI attempt 2: Uses a factory, returns a Greeting object
class GreetingService:
    def greet(self, user_id):
        user = self.user_repository.find(user_id)
        return self.greeting_factory.create(user.name)

# AI attempt 3: Template engine, different dependencies entirely
class GreetingService:
    def greet(self, user_id):
        user = self.user_repository.find(user_id)
        template = self.template_engine.load("greeting")
        return template.render(user=user)
```

Three valid interpretations. Three different dependency structures. Three different test suites. Which one did you mean? The AI doesn't know. Neither will the next developer reading the code.

**Cost is asymmetric.** AI has no cost to generate, and no cost to be wrong. You have high cost to review, and high cost if you miss an error. AI can generate 500 lines in seconds. You review every line for hours.

These two problems compound. Ambiguous input produces unpredictable output, and unpredictable output demands expensive review. You're not designing software anymore. You're doing archaeology on code someone else wrote.

## The Prompt-Review Loop Is a Trap

Most teams adopting AI fall into the same cycle: prompt → generate → review → find problems → prompt again → review again.

This is a **positive feedback loop**. Not positive as in "good" — positive as in deviation-amplifying. Each iteration can move you further from your intent because the target itself is unstable. "Correct" lives in your head, and you're re-articulating it each cycle. The reference point drifts.

You don't know if you're converging or diverging until you've already spent the time.

What you need is **negative feedback** — a fixed reference point that the system corrects toward. A binary signal. Pass or fail. No interpretation.

That's what tests should be. But there's a trap here too. If AI generates both the tests and the implementation, you get circular validation. AI checking AI has no regulatory force. Someone has to define what "correct" means before generation begins. That someone is the human.

## Why Not Other Spec-Driven Approaches?

Tools like Kiro, GitHub's spec-kit, and similar SDD frameworks address the ambiguity problem with structured markdown: requirements.md → design.md → tasks.md. This is better than raw prompting.

But as Martin Fowler observed after testing these tools: "I frequently saw the agent ultimately not follow all the instructions." And: "I'd rather review code than all these markdown files."

The issue is that these specs are still natural language. A human reads the spec, reads the code, and judges whether they match. That judgment step reintroduces ambiguity. Two engineers can read the same spec and disagree about whether the implementation satisfies it.

A spec you can't execute is barely better than no spec at all — because the volume of AI-generated code overwhelms human verification capacity.

## Introducing DisC

**DisC** (Design is Code) uses both schools of TDD — London and Chicago — each applied where it has the most constraining power. The methodology is built on Freeman & Pryce's *Growing Object-Oriented Software, Guided by Tests*.

The key mechanism for orchestration code: each arrow in a UML sequence diagram becomes one `verify()` call in a test. That `verify()` only passes if the implementation makes exactly that call, with exactly those arguments. There is one implementation that passes.

What you design is what you get.

## How It Works

**Step 0: Establish truth.**

Before you design, verify your assumptions. If you don't know how an external API behaves — spike it. If you're guessing about data formats — test them. Write a throwaway integration test that proves the thing you're about to depend on actually works the way you think it does.

DisC guarantees your code matches your design. Step 0 ensures your design matches reality. Without it, you can have a perfectly implemented wrong design. No other spec-driven tool addresses this. They assume you already know what you want. DisC assumes you should prove it first.

**Step 1: Draw a sequence diagram.**

You and your team sketch how components interact. This is where engineering judgment lives — deciding what components should exist, how they collaborate, what contracts they honor.

```
@startuml
InvoiceService -> OrderRepository: findAllByCustomerId(customerId)
InvoiceService <-- OrderRepository: orders: List<Order>
InvoiceService -> InvoiceBuilderFactory: create()
InvoiceBuilderFactory --> InvoiceBuilder: <<create>>
InvoiceService <-- InvoiceBuilderFactory: invoiceBuilder: InvoiceBuilder
loop for each order in orders
    InvoiceService -> InvoiceBuilder: addLine(order)
end
InvoiceService -> InvoiceBuilder: build()
InvoiceService <-- InvoiceBuilder: invoice: Invoice
@enduml
```


**Step 2: Generate tests from the diagram.**

Each arrow becomes one `@Test` with one `verify()`. The final return becomes one `assertThat()`.

```java
@MockitoSettings(strictness = Strictness.LENIENT)
class DefaultInvoiceServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private InvoiceBuilderFactory invoiceBuilderFactory;

    @Mock private Order order;
    @Mock private InvoiceBuilder invoiceBuilder;
    @Mock private Invoice invoice;

    private UUID customerId;
    private Invoice result;
    DefaultInvoiceService defaultInvoiceService;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID();
        defaultInvoiceService = new DefaultInvoiceService(orderRepository, invoiceBuilderFactory);
    }

    @Nested
    class WhenGenerateInvoice {
        @BeforeEach
        void setUp() {
            when(orderRepository.findAllByCustomerId(any())).thenReturn(List.of(order));
            when(invoiceBuilderFactory.create()).thenReturn(invoiceBuilder);
            when(invoiceBuilder.build()).thenReturn(invoice);
            result = defaultInvoiceService.generateInvoice(customerId);
        }

        @Test void shouldFindAllOrdersByCustomerId() { verify(orderRepository).findAllByCustomerId(customerId); }
        @Test void shouldCreateInvoiceBuilder() { verify(invoiceBuilderFactory).create(); }
        @Test void shouldAddLineForOrder() { verify(invoiceBuilder).addLine(order); }
        @Test void shouldBuildInvoice() { verify(invoiceBuilder).build(); }
        @Test void shouldReturnInvoice() { assertThat(result).isEqualTo(invoice); }
    }
}
```

**Step 3: AI implements to pass the tests.**

There is exactly one implementation shape that satisfies all constraints:

```java
@Service
public class DefaultInvoiceService implements InvoiceService {
    private final OrderRepository orderRepository;
    private final InvoiceBuilderFactory invoiceBuilderFactory;

    public DefaultInvoiceService(OrderRepository orderRepository, InvoiceBuilderFactory invoiceBuilderFactory) {
        this.orderRepository = orderRepository;
        this.invoiceBuilderFactory = invoiceBuilderFactory;
    }

    @Override
    public Invoice generateInvoice(UUID customerId) {
        List<Order> orders = orderRepository.findAllByCustomerId(customerId);
        InvoiceBuilder invoiceBuilder = invoiceBuilderFactory.create();
        orders.forEach(invoiceBuilder::addLine);
        return invoiceBuilder.build();
    }
}
```

The implementation is driven by the tests, not the design directly. The design generates the tests. The tests constrain the code. 

No loop. No review cycle. Design → tests → implementation → tests pass → done. A single-pass pipeline.


## Two Types of Components, Two Schools of TDD

Not all components behave the same way. DisC uses both schools of TDD — each where it constrains AI the most.

**London-school (mockist) for collaborative components.** Services that call other services, repositories, mappers — orchestration code. `verify()` constrains the exact call structure: which method, which arguments, which order. AI can satisfy a classicist `assertEquals` a hundred different ways with different architectures. The three greeting service implementations at the top of this post would all pass the same state-based test. But `verify()` leaves zero freedom. One diagram, one implementation. That's what makes determinism possible.

**Chicago-school (classicist) for pure functions.** Calculations, validations, transformations with no dependencies. These have no interactions to mock — there are no arrows. Instead, the human designs a **decision table**:

```
| input userName | input age | expected result | note           |
|----------------|-----------|-----------------|----------------|
| "Alice"        | 25        | ELIGIBLE        | happy path     |
| ""             | 25        | INVALID_NAME    | empty string   |
| "Alice"        | -1        | INVALID_AGE     | negative edge  |
| null           | 25        | INVALID_NAME    | null input     |
| "Alice"        | 150       | INVALID_AGE     | boundary       |
```

The table generates parameterised `assertThat()` tests. AI implements the function. The tests constrain *what* the output must be, not *how* it's computed. If an edge case isn't in your table, it won't be tested. Design completeness is your responsibility.

Use a checklist: happy path, boundary, null/empty, invalid, overflow.

| Type | TDD School | Design Artifact | Test Style | AI Freedom |
| --- | --- | --- | --- | --- |
| Collaborative (orchestrator) | London | Sequence diagram | `verify()` | Zero — each verify = one line of code |
| Pure function (leaf node) | Chicago | Decision table | `assertThat()` | How, not what — must produce correct output |

In typical enterprise applications, most code is orchestration. Pure functions are the minority, and through composition, each stays small and focused.

---

## Who Does the Design?

| What | Who | Why |
|------|-----|-----|
| Component interactions (UML arrows) | Developers | Architecture decisions require engineering judgment |
| Pure function test cases (decision tables) | Product / QA team | Business rules require domain knowledge |
| Implementation | AI | Mechanical — forced by the tests |

The human effort is in the design room, not the code review. One hour of peer UML review replaces many hours of reviewing generated code. Design errors are caught at the cheapest possible moment — when they're still arrows on a diagram, not code in a codebase.

---

## Scope and Limitations

DisC constrains interaction structure — how components collaborate. It does not constrain non-functional properties: performance, readability, or error handling style.

Some things to know upfront:

- **Algorithmic code** — ML pipelines, trading algorithms, game engines — falls outside the methodology because it's hard to reflect with decision table.
- **Currently Java + Spring only.** The methodology works with any language that supports mocking, soon it will support C# and Typescript. Python will be supportd after that.

---

## Try It

**Option 1: See the demo (no plugin install needed)**

```bash
git clone https://github.com/mossgreen/design-is-code-demo
cd design-is-code-demo
# look at the UML diagrams in design/
# run /disc 01_hello-world.puml in a Claude Code session
./gradlew test  # all tests pass
```

Requires Java 17.

[github.com/mossgreen/design-is-code-demo](https://github.com/mossgreen/design-is-code-demo)

**Option 2: Install the plugin in your own Java Spring project**

```bash
/plugin marketplace add mossgreen/design-is-code-plugin
/plugin install design-is-code@mossgreen-design-is-code
```

Put your UML sequence diagram in your project's `design/` folder. Run `/design-is-code:disc <filename>` in Claude Code.

[github.com/mossgreen/design-is-code-plugin](https://github.com/mossgreen/design-is-code-plugin)

---

## Further Reading

- *Growing Object-Oriented Software, Guided by Tests* — Freeman & Pryce (the foundation)
- *Test-Driven Development* — Kent Beck
- *Clean Architecture* — Robert Martin
- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — Martin Fowler
- [AI Doesn't Change the Trajectory. It Changes the Rate.](/ai-doesnt-change-the-trajectory/) — How ecology's S-curves and the 2025 DORA Report explain why codebase health determines whether AI helps or destroys

DisC combines ideas from Freeman & Pryce, Kent Beck, and Robert Martin, adapted for the age of AI coding assistants.

**Feedback welcome.** Open an issue, or find me on [LinkedIn](https://www.linkedin.com/in/mossgu).
