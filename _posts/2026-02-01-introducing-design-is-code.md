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

**Natural language is ambiguous.** "The service validates the user" doesn't say who validates, when validation happens, or what happens on failure. Natural language is built for human communication, where ambiguity is tolerable. As a code specification, it's a liability. The AI interprets rather than executes — same prompt, different code, every time. There's no contract. There's no determinism.

**Cost is asymmetric.** AI has no cost to generate, and no cost to be wrong. You have high cost to review, and high cost if you miss an error. AI can generate 500 lines in seconds. You review every line for hours.

These two problems compound. Ambiguous input produces unpredictable output, and unpredictable output demands expensive review. You're not designing software anymore. You're doing archaeology on code someone else wrote.

## Design is the Contract

Every generation of software engineering raised the abstraction level while preserving formal notation — machine code → assembly → structured programming → OOP. Each step made intent more expressible without sacrificing precision.

Natural language breaks that contract. It's expressive, but not formal.

This is not a tooling problem. It's a specification problem. If the specification is ambiguous, everything downstream inherits that ambiguity — the tests, the implementation, the architecture. You can't review your way out of a bad contract. You can only fix it at the source.

Design is the source.

A precise design artifact eliminates interpretation before code is written. Peer collaboration, architectural debate, edge case reasoning — all of it happens at design time, not in code review. Reviewing code that AI generated from an agreed design is spot-checking. Reviewing code that AI generated from a natural language prompt is archaeology.

---

## Introducing DisC

**DisC** (Design is Code) applies London-school TDD (Freeman & Pryce, *Growing Object-Oriented Software, Guided by Tests*) to AI code generation. Mockist tests specify exact call structure, order, and arguments — leaving no room for AI interpretation.

The key mechanism: each arrow in a UML sequence diagram becomes one `verify()` call in a test. That `verify()` only passes if the implementation actually makes that call, with those arguments. There is only one implementation that passes.

What you design is what you get.

---

## How It Works

**Step 1: Draw a sequence diagram.**

You and your team sketch how components interact. This is where engineering judgment lives — deciding what components should exist, how they collaborate, what contracts they honor.

```
@startuml
participant OrderService
participant OrderMapper
participant OrderRepository

OrderService -> OrderMapper: toEntity(request)
OrderMapper --> OrderService: order
OrderService -> OrderRepository: save(order)
OrderRepository --> OrderService: savedOrder
OrderService -> OrderMapper: toDTO(savedOrder)
OrderMapper --> OrderService: orderDTO
@enduml
```

Three arrows. Three collaborators. One clear design.

**Step 2: Generate tests from the diagram.**

Each arrow becomes one `@Test` with one `verify()`. The final return becomes one `assertThat()`.

```java
@MockitoSettings(strictness = Strictness.LENIENT)
class DefaultOrderServiceTest {

    @Mock private OrderMapper mapper;
    @Mock private OrderRepository repository;

    @Mock private CreateOrderRequest request;
    @Mock private Order order;
    @Mock private Order savedOrder;
    @Mock private OrderDTO orderDTO;

    private OrderDTO result;

    @BeforeEach
    void setUp() {
        when(mapper.toEntity(any())).thenReturn(order);
        when(repository.save(any())).thenReturn(savedOrder);
        when(mapper.toDTO(any())).thenReturn(orderDTO);

        OrderService service = new DefaultOrderService(repository, mapper);
        result = service.createOrder(request);
    }

    @Test
    void shouldMapRequestToEntity() {
        verify(mapper).toEntity(request);
    }

    @Test
    void shouldSaveOrder() {
        verify(repository).save(order);
    }

    @Test
    void shouldMapSavedOrderToDTO() {
        verify(mapper).toDTO(savedOrder);
    }

    @Test
    void shouldReturnOrderDTO() {
        assertThat(result).isEqualTo(orderDTO);
    }
}
```

Three arrows = three `verify()` tests + one return assertion. The `@BeforeEach` wires mocks, creates the class, and executes the method once. Each test verifies one interaction.

**Step 3: AI implements to pass the tests.**

There is exactly one implementation shape that satisfies all constraints:

```java
@Service
public class DefaultOrderService implements OrderService {
    private final OrderRepository repository;
    private final OrderMapper mapper;

    public DefaultOrderService(OrderRepository repository, OrderMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public OrderDTO createOrder(CreateOrderRequest request) {
        Order order = mapper.toEntity(request);
        Order savedOrder = repository.save(order);
        return mapper.toDTO(savedOrder);
    }
}
```

The output of `mapper.toEntity()` feeds into `repository.save()`. The output of `save()` feeds into `mapper.toDTO()`. The data flow is dictated by the `verify()` arguments — the test leaves no other valid implementation.

```
 Design Artifact (UML Sequence Diagram)
        |
        v
  Phase 1: Design → Tests
        |
        v
  Phase 2: Tests → Implementation
        |
        v
  Working Code
```

The implementation is driven by the tests, not the design directly. The design generates the tests. The tests constrain the code. Reviewed designs don't need code review.

---

## Two Types of Components

Not all components behave the same way under this methodology.

| Type | Has Dependencies? | Design Artifact | Test Style | AI Role |
|------|-------------------|-----------------|------------|---------|
| Collaborative (orchestrator) | Yes | Sequence diagram | `verify()` | Generate tests + implement |
| Pure function (leaf node) | No | Decision table | `assertThat()` | Implement only |

For **collaborative components** — services that call mappers, repositories, and other services — DisC dictates the implementation completely. Each `verify()` = one line of code. AI has zero structural freedom.

For **pure functions** — calculations, validations, transformations with no dependencies — the tests constrain *what* the output must be, not *how* it's computed. Humans must design the test cases: input values, expected outputs, and edge cases. If AI generates both the test and the implementation, you get false positives where tests pass but the logic is wrong.

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

- **Pure function test cases require human design.** AI implements them, but you decide the inputs, expected outputs, and edge cases.
- **If an edge case isn't in your diagram, it won't be tested.** Design completeness is your responsibility.
- **Algorithmic code** — ML pipelines, trading algorithms, game engines — falls outside the methodology entirely.
- **Currently Java + Spring only.** The methodology works with any language that supports mocking, but the tooling is Java-first with UML sequence diagrams in PlantUML format.
- **Best for new features and greenfield code.** Modifying existing code is a different problem.

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

DisC combines ideas from all three, adapted for the age of AI coding assistants.

**Feedback welcome.** Open an issue, or find me on [LinkedIn](https://www.linkedin.com/in/mossgu).