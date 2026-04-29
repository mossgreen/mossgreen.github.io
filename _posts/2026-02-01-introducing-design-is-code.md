---
title: "Design is Code: Disciplined Design, Deterministic AI Code Generation"
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

**DisC** (Design is Code) is disciplined design plus deterministic generation. Your team writes the design in a precise notation — one with rules a computer can follow, not prose a reader has to interpret — and reviews it before any code exists. After that, the pipeline is mechanical: tests come from the design, code comes from the tests. The team's judgment goes into the design, not into reviewing AI-generated code.

Because everything past the design is mechanical, the same pipeline runs whether a software team drives it or an AI agent does. The methodology works for either.

- **You design.** Either a picture of how components call each other, or a table of inputs and the answers you expect back.
- **DisC generates tests.** Mechanically, from the design. No interpretation step.
- **AI implements.** It writes code that has to match. No room to drift.

What you design is what you get.

## Before You Start: Establish Truth

Before you design, verify your assumptions. If you don't know how an external API behaves — spike it. If you're guessing about data formats — test them. Write a throwaway integration test that proves the thing you're about to depend on actually works the way you think it does.

DisC guarantees your code matches your design. This step ensures your design matches reality. Without it, you can have a perfectly implemented wrong design. No other spec-driven tool addresses this. They assume you already know what you want. DisC assumes you should prove it first.

## How It Works

### Two Kinds of Code, One Pipeline

Real systems have two kinds of code. **Some code coordinates** — a service calls a repository, which calls a mapper. **Some code calculates** — given inputs, return an answer. DisC handles both, with one design artifact for each:

- **Coordinating code → sequence diagram.** You draw the arrows. Each arrow becomes a test that says "this call must happen, with these arguments." The AI has no room to rearrange the structure.
- **Calculating code → decision table.** You write the rows. Each row becomes a test that says "given these inputs, return this output." The AI has no room to return the wrong answer.

The human decides what "correct" means — arrows or rows. The tests hold the AI to it.

### Orchestrators

Services that coordinate other services, repositories, mappers — anything with outgoing arrows. The three greeting services from the top of the post would all pass the same output check — they all return "Hello, Alice." What they can't all pass is the same *call* check: each makes different calls in a different order. Pinning the calls is how DisC rules out two of the three.

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

The design generates the tests. The tests constrain the code.

No loop. No review cycle. Design → tests → implementation → tests pass → done. A single-pass pipeline.

### Pure Functions

Calculators, validators, transformers — code that takes inputs and returns an answer without calling anything else. There are no calls to pin, so the test pins the output directly: given these inputs, expect this result. AI keeps freedom over *how* to compute, zero freedom over *what* to return.

The pipeline collapses from three steps to one, because the design artifact *is* the test specification. A **decision table** is a list of rows, each pinning the expected output at one specific input point. The human authors it alongside the UML, in the same `design/` folder:

```markdown
---
target: TaxCalculator.calculate
input:
  amount: BigDecimal
  rate: BigDecimal
output: BigDecimal
config:
  rounding: HALF_UP
---

| amount  | rate  | expected         |
|---------|-------|------------------|
| 100.00  | 0.10  | 10.00            |
| 0.00    | 0.10  | 0.00             |
| -50.00  | 0.10  | throws: IllegalArgumentException |
```

Frontmatter pins the target method and types; rows pin behaviour at specific input points. DisC consumes the file directly — generating one `@Test` per row (filled, not skeleton) and deriving the implementation from the rows.

Two safeguards keep this honest:

- **Row-density warning.** If the table has fewer than 3 rows, or no boundary case (zero, negative, empty string), DisC reports it. Generation proceeds; the warning appears in the final report.
- **Inferred assumptions.** Rows specify behaviour at points, not everywhere. For anything the rows don't uniquely determine — rounding mode, null-handling, ordering — DisC names the choice it made and why. You verify it. The `config:` block lets you pin choices upfront and suppress the corresponding inference.

If you don't author a table, DisC still emits a skeleton with `TODO` markers for humans to fill in. Authoring ahead of time just collapses two steps into one.

One hour of peer UML review replaces many hours of reviewing generated code. Design errors are caught at the cheapest possible moment — when they're still arrows on a diagram or rows in a table, not code in a codebase.

---

## Who Does the Design?

| What | Who | Why |
|------|-----|-----|
| Component interactions (UML arrows) | Developers | Architecture decisions require engineering judgment |
| Pure function test cases (decision tables) | Product / QA team | Business rules require domain knowledge |
| Implementation | AI | Mechanical — forced by the tests |

The human effort is in the design room, not the code review.

---

## Roadmap

Today: the methodology, the Java + Spring plugin, UML sequence diagrams, and decision tables. Coming next:

- **A design UI with live validation.** Catch a missing arrow or an inconsistent return type before generation runs. The notation stays the source of truth; the UI is just a faster way to author it.
- **More languages.** C# and TypeScript next, Python after. The methodology works with any language that supports mocking; the plugin catches up.
- **Integration test generation.** Extends the same design-driven pipeline to seam tests against real databases, HTTP, and queues — beyond unit-level mocks.
- **Non-functional warnings.** Performance hot-paths, error-handling gaps, logging consistency — flagged at generation time, not at code review.

The constant: precise design, mechanical generation, code that follows from the design. Everything new is in service of that.

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
