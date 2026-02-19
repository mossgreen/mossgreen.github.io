---
title: Thinking on SDD AI Development
tags:
  - AI
  - LLM
  - Spec-Driven Development
  - Claude Code
  - TDD
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Vibe coding is for spikes. Spec-driven development is for production. Before you let an LLM generate code, you should know how every element works.

When a master painter begins a masterpiece, they already see the finished painting in their mind. The brushstrokes follow a vision that exists before the canvas touches paint. Software development should work the same way—especially when AI is involved.

## The Problem: Vibe Coding Gone Wrong

We've all been there. You fire up your AI coding assistant with a brilliant idea, prompt it to build something, and then... you spend the next hour going back and forth:

```
You: "Build me a user authentication system"
AI: [generates 200 lines of code]
You: "Actually, I meant OAuth, not JWT"
AI: [regenerates, but now it's tightly coupled to the database schema]
You: "Can we decouple the auth logic?"
AI: [regenerates again, introducing new bugs]
```

This is **vibe coding**—treating AI as a code generator that "sounds right" but lacks the rigor needed for production systems. The code looks functional when it's generated, but problems emerge later:

- Tight coupling between components that should be independent
- Missing error handling for edge cases
- Inconsistent patterns across the codebase
- Architecture that doesn't scale
- Security vulnerabilities buried in generated code

As GitHub's engineering team notes in their introduction of [Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/):

> "Sometimes the code doesn't compile. Sometimes it solves part of the problem but misses the actual intent. The stack or architecture may not be what you'd choose. The issue isn't the coding agent's coding ability, but our approach. We treat coding agents like search engines when we should be treating them more like literal-minded pair programmers."

This approach works for **spikes**—quick experiments to verify an idea. Spike code is throwaway by design. You're exploring whether something is possible, not building production software.

But for production? You need something more rigorous.

## Spec-Driven Development: The Master Painter's Approach

Spec-driven development (SDD) means writing a **specification before writing code with AI**. The spec becomes the source of truth for both you and the AI.

Martin Fowler's analysis of SDD tools ([Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)) identifies three levels:

1. **Spec-first**: A well thought-out spec is written first, then used for AI-assisted development
2. **Spec-anchored**: The spec is kept after completion, used for evolution and maintenance
3. **Spec-as-source**: The spec is the main file; humans never touch the code directly

Regardless of the level, the core principle remains: **before code exists, the design exists**.

### What Goes Into a Spec?

A good spec for AI-driven development isn't just a PRD. It's a structured artifact that includes:

1. **Flow diagrams or sequence diagrams** - How components interact
2. **Class diagrams or data models** - The structure of your domain
3. **API contracts** - Interface definitions between components
4. **Error scenarios** - What happens when things go wrong
5. **Testing strategy** - How you'll verify correctness

These artifacts come from **design specs**—documents that describe behavior, data flows, and constraints. Kiro's approach ([from chat to specs](https://kiro.dev/blog/from-chat-to-specs-deep-dive/)) formalizes this into three documents:

- **requirements.md** - User stories, acceptance criteria
- **design.md** - Architecture decisions, component diagrams
- **tasks.md** - Granular development tasks with clear acceptance criteria

This creates natural checkpoints where you can review, modify, and approve direction *before* resources are invested in implementation.

## Why Design Specs Matter: The Master Painter Analogy

When a master painter stands before a blank canvas, they:

1. **See the composition** - Where each element will be placed
2. **Understand the color harmony** - Which colors work together and why
3. **Know the technique** - Which brushstrokes create which effects
4. **Have studied the subject** - They understand what they're painting

They don't figure this out as they paint. The planning happens first.

The same applies to software development with AI. Before you ask an LLM to generate code, you should understand:

1. **How components interact** - Draw the sequence diagram first
2. **What data flows where** - Map the data model before coding
3. **Where boundaries are** - Define interfaces before implementation
4. **What "done" looks like** - Write tests before code

When you skip this step, you're asking the AI to paint a masterpiece you can't see yet. The results will be inconsistent at best.

## The TDD Connection: Ensuring Decoupled Components

Test-Driven Development (TDD) becomes even more critical with AI-generated code. Here's why:

**TDD guarantees components aren't coupled.**

When you write tests first, you're forced to define the interface before implementation. This creates boundaries that prevent coupling—something AI agents naturally struggle with.

Consider this example:

```python
# Without TDD - AI generates tightly coupled code
class UserService:
    def create_user(self, email: str, password: str):
        # Direct database dependency
        db.execute("INSERT INTO users...")
        # Direct email sending dependency
        smtp.send(f"Welcome {email}!")
        # Direct logging dependency
        logger.info("User created")
```

This class is coupled to three external dependencies. Testing it requires mocking all three, and changing any dependency affects this class.

```python
# With TDD - Tests drive decoupling
# Test written first:
def test_create_user_stores_user():
    repository = MockUserRepository()
    event_publisher = MockEventPublisher()
    service = UserService(repository, event_publisher)

    service.create_user("test@example.com", "password")

    assert repository.stored_user.email == "test@example.com"
    assert event_publisher.published_events[0].type == "user_created"

# Implementation driven by test:
class UserService:
    def __init__(self, repository: UserRepository, events: EventPublisher):
        self._repository = repository
        self._events = events

    def create_user(self, email: str, password: str):
        user = User(email=email, password_hash=self._hash(password))
        self._repository.save(user)
        self._events.publish(UserCreated(user_id=user.id))
```

The TDD approach produced a class with clear dependencies, defined interfaces, and single responsibility. The AI code generator now has explicit constraints to follow.

### TDD as a Specification Tool

Tests are specifications. A well-written test describes:

- **What** behavior is expected
- **How** the component should be called
- **What** the component should return

When you provide tests to an AI agent, you're providing an executable spec. The agent can't deviate from the defined behavior without failing the tests.

This is why [GitHub's Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) emphasizes:

> "Each task should be something you can implement and test in isolation; this is crucial because it gives the coding agent a way to validate its work and stay on track, almost like a test-driven development process for your AI agent."

## Agent Orchestration: Every Step Implemented

Once you have specs and tests, how do you ensure AI actually implements everything correctly? You use **agents to orchestrate the implementation**.

Claude Code's Task tool is a prime example. It allows you to:

1. **Spawn specialized agents** for different aspects of implementation
2. **Run agents in parallel** for independent tasks
3. **Verify outputs** against your specs and tests

Here's a practical workflow:

```
1. Create Spec (Human + AI Planning Agent)
   ├── Flow diagrams for user journeys
   ├── Sequence diagrams for component interactions
   ├── Data model definitions
   └── API contracts

2. Define Tests (Human + TDD Agent)
   ├── Unit tests for each component
   ├── Integration tests for interactions
   └── Contract tests for APIs

3. Implement (Parallel Implementation Agents)
   ├── Agent A: Database layer
   ├── Agent B: API endpoints
   ├── Agent C: Business logic
   └── Agent D: Frontend components

4. Verify (Testing Agent)
   ├── Run all tests
   ├── Check against spec
   └── Flag inconsistencies
```

Each agent works from the same spec and test suite, but independently. This prevents the "conversational drift" that happens when you try to build everything in one prompt.

### The Claude Code Advantage

Claude Code has become the default for spec-driven development because:

1. **Large context window** - Can hold entire specs in memory
2. **Task orchestration** - Built-in agent spawning and delegation
3. **File awareness** - Understands your project structure
4. **Multi-agent coordination** - Different agents can collaborate on the same codebase

When you combine Claude Code with proper specs, you're not just getting code generation—you're getting a development team that works from your design documents.

## Putting It All Together: A Complete Workflow

Here's how spec-driven AI development flows in practice:

### Phase 1: Spec First (Human + AI)

```
You: "I need to build a tennis court booking system"

AI (Planning Mode): "Let me help you design this first."

[Generates requirements.md]
- User story: As a player, I want to book available courts
- Acceptance criteria: GIVEN available slots exist, WHEN I select one, THEN it's reserved

[Generates design.md]
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│    API      │───▶│  Database   │
└─────────────┘    └─────────────┘    └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ Availability │
                  │   Checker   │
                  └─────────────┘

[Generates data-model.md]
- Court: {id, name, capacity}
- Booking: {id, court_id, user_id, time_slot}
- AvailabilityQuery: {date, time_range}
```

You review, refine, and approve. **No code written yet.**

### Phase 2: Test First (Human + AI)

```
You: "Write tests for the booking flow"

AI (TDD Mode): [Generates test files]

def test_book_available_slot():
    # Given
    court = Court(id="1", name="Centre Court")
    slot = Slot(court_id="1", time="2025-02-01T14:00")
    repository = InMemoryBookingRepository()
    repository.add_slot(slot)

    # When
    service = BookingService(repository)
    booking = service.book_slot(user_id="user-123", slot_id=slot.id)

    # Then
    assert booking.status == BookingStatus.CONFIRMED
```

You review tests. **Still no production code.**

### Phase 3: Implement (Multiple Agents)

```
You: "Implement the system based on these tests"

[Agent 1: Database Layer]
Implements BookingRepository with all CRUD operations

[Agent 2: Business Logic]
Implements BookingService using the repository interface

[Agent 3: API Layer]
Implements REST endpoints that call the service

[All agents run in parallel, all tests pass]
```

### Phase 4: Verify (AI + Human)

```
Testing Agent: "Running test suite..."
✓ test_book_available_slot
✓ test_reject_duplicate_booking
✓ test_handle_concurrent_bookings
✓ test_notify_user_on_booking

All 24 tests passed. Implementation matches spec.
```

You review the diff. Clean, decoupled code that matches your design.

## When to Use Each Approach

The key is knowing when to use which mode:

| Approach | Use When | Example |
|----------|----------|---------|
| **Vibe Coding** | Spikes, prototypes, one-off scripts | "I want to test if this library can handle CSV parsing" |
| **Spec-Driven** | Production features, team projects | "We need to build a payment processing system" |
| **Spec-First** | Clear requirements, well-defined scope | "Add OAuth authentication to existing API" |
| **Spec-Anchored** | Long-lived features, iterative development | "E-commerce checkout flow that evolves" |
| **Spec-as-Source** | Highly regulated, critical systems | "Banking transaction processor" |

Martin Fowler notes that many SDD tools struggle with **problem size**:

> "When I asked Kiro to fix a small bug, it quickly became clear that the workflow was like using a sledgehammer to crack a nut... An effective SDD tool would have to provide flexibility for different sizes and types of changes."

This is why Claude Code shines—it doesn't force a rigid workflow. You can choose the level of formality that matches your task.

## Common Pitfalls and How to Avoid Them

### Pitfall 1: Treating Specs as Prompts

A spec is not just a longer prompt. It's a **living document** that defines behavior, not implementation.

**Wrong:**
```markdown
# Spec
Write a function that takes email and password, hashes the password,
stores it in MongoDB using Mongoose, and returns a JWT token signed
with process.env.JWT_SECRET.
```

This is implementation, not specification.

**Right:**
```markdown
# Spec: User Registration
## User Story
As a new user, I want to register with email/password so I can access the system.

## Interface
```python
class UserRepository(ABC):
    @abstractmethod
    def save(self, user: User) -> User

class AuthService(ABC):
    @abstractmethod
    def register(self, email: str, password: str) -> AuthToken
```

## Behavior
- Email must be valid format
- Password must be hashed before storage
- Returns token on success
- Throws DuplicateEmailError if email exists


### Pitfall 2: Skipping the Diagram

Text descriptions leave room for interpretation. Diagrams don't.

Before writing any spec, draw:
- **Sequence diagram** - Shows call order and component interactions
- **Class diagram** - Shows relationships and dependencies
- **State diagram** - Shows state transitions (critical for complex workflows)

These diagrams can be generated with AI tools like [Mermaid AI](https://mermaid.ai), [Eraser.io](https://www.eraser.io/ai/sequence-diagram-generator), or [Miro AI](https://miro.com/ai/diagram-ai/architecture-diagram/).

### Pitfall 3: Letting Agents Ignore Boundaries

Even with specs and tests, AI agents will sometimes take shortcuts. Protect against this by:

1. **Running tests in CI** - Fail the build if tests don't pass
2. **Code review gate** - Human reviews all AI-generated code
3. **Lint rules** - Enforce architectural constraints via linters
4. **Interface contracts** - Use types/protocols to enforce boundaries

## The Future: Intent as Source of Truth

GitHub's team articulates the vision:

> "We're moving from 'code is the source of truth' to 'intent is the source of truth.' With AI, the specification becomes the source of truth and determines what gets built."

This isn't because documentation became more important. It's because **AI makes specifications executable**. When your spec turns into working code automatically, it determines what gets built.

But this only works when specs are **unambiguous, complete, and structurally sound**. That's why:

1. **Vibe coding is for spikes** - Quick experiments to verify ideas
2. **Design specs are for production** - Precise definitions of behavior
3. **TDD is for boundaries** - Tests that guarantee decoupling
4. **Agents are for implementation** - Task executors that work from your design

## Key Takeaways

1. **Vibe coding has its place** - Use it for spikes and prototypes, not production systems. The code generated should be treated as disposable.

2. **Spec before code** - Like a master painter who sees the painting before touching the canvas, you should understand your system's architecture before generating code.

3. **Diagrams are specs** - Flow charts, sequence diagrams, and class diagrams are not optional add-ons. They're the spec.

4. **TDD guarantees decoupling** - Writing tests first forces you to define boundaries that prevent the coupling AI naturally introduces.

5. **Agents orchestrate implementation** - Use tools like Claude Code to spawn specialized agents that implement from your spec, not one monolithic prompt.

6. **Match formality to problem size** - Small bugs don't need full SDD. Production systems do. Choose the right level of ceremony.

The next time you're about to prompt an AI to "build me a feature," pause and ask: **Do I see the finished painting in my mind?** If not, start with a spec. Your future self—and your team—will thank you.

## References

- [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) - Martin Fowler
- [Spec-driven development with AI: Get started with a new open source toolkit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) - GitHub Blog
- [From chat to specs: a deep dive into AI-assisted development with Kiro](https://kiro.dev/blog/from-chat-to-specs-deep-dive/) - Kiro
- [To vibe or not to vibe](https://martinfowler.com/articles/exploring-gen-ai/to-vibe-or-not-vibe.html) - Martin Fowler
- [Vibe coding is not the same as AI-Assisted engineering](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98) - Addy Osmani
- [The Task Tool: Claude Code's Agent Orchestration System](https://dev.to/bhaidar/the-task-tool-claude-codes-agent-orchestration-system-4bf2) - Bilal Haidar
