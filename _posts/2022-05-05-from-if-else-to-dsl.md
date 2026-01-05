---
title: "From If-Else to DSL: How Software Evolves Toward Configuration-Driven Systems"
tags:
  - SOLID
  - DSL
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---

From hardcoded logic to configuration-driven architectures, with complete Java examples.

## The Use Case

A notification system with one goal: **send messages to users through various channels**.

All stages implement this same capability. The difference: **how much code changes when you add a new channel**.

---

## Stage 1: Feature-Driven Code (If-Else)

**Style:** Hardcoded branches

**Change impact:** Modify existing code for every new feature

### The Code

You start with email notifications:

```java
public class NotificationService {

    public void notify(User user, String message) {
        System.out.println("Email to " + user.getEmail() + ": " + message);
    }
}
```

Then product asks for SMS. You add a branch:

```java
public class NotificationService {

    public void notify(User user, String message, String channel) {
        if (channel.equals("email")) {
            System.out.println("Email to " + user.getEmail() + ": " + message);
        } else if (channel.equals("sms")) {
            System.out.println("SMS to " + user.getPhone() + ": " + message);
        }
    }
}
```

Then Slack. Then push notifications:

```java
public class NotificationService {

    public void notify(User user, String message, String channel) {
        if (channel.equals("email")) {
            System.out.println("Email to " + user.getEmail() + ": " + message);
        } else if (channel.equals("sms")) {
            System.out.println("SMS to " + user.getPhone() + ": " + message);
        } else if (channel.equals("slack")) {
            System.out.println("Slack to " + user.getSlackId() + ": " + message);
        } else if (channel.equals("push")) {
            System.out.println("Push to " + user.getDeviceId() + ": " + message);
        }
    }
}
```

### What's Happening

Every new channel means:
- Open this file
- Add another `else if`
- Risk breaking existing logic
- Retest everything

### Pros

- Works
- Easy to understand
- No abstraction overhead

### Cons

- Every new channel = code change
- Testing gets harder
- Single file grows forever

### When to Stop Here

- You have 2-3 channels, unlikely to add more
- Prototype / MVP stage
- Team is small and moves fast

---

## Stage 2: Polymorphism (Interface + Implementations)

**Style:** Abstract behavior behind interface

**Change impact:** Add new class, no modification to existing code

### The Trigger

You notice: same operation, different behavior. Time to extract an interface.

### The Code

```java
// The abstraction
public interface Notifier {
    void send(User user, String message);
}

// Implementations
public class EmailNotifier implements Notifier {
    @Override
    public void send(User user, String message) {
        System.out.println("Email to " + user.getEmail() + ": " + message);
    }
}

public class SmsNotifier implements Notifier {
    @Override
    public void send(User user, String message) {
        System.out.println("SMS to " + user.getPhone() + ": " + message);
    }
}

public class SlackNotifier implements Notifier {
    @Override
    public void send(User user, String message) {
        System.out.println("Slack to " + user.getSlackId() + ": " + message);
    }
}

// Usage
public class NotificationService {
    
    public void notify(Notifier notifier, User user, String message) {
        notifier.send(user, message);
    }
}
```

### Adding Feature E: Discord

Just add a new class. No existing code changes.

```java
public class DiscordNotifier implements Notifier {
    @Override
    public void send(User user, String message) {
        System.out.println("Discord to " + user.getDiscordId() + ": " + message);
    }
}
```

### What Changed

| Before (If-Else) | After (Polymorphism) |
| --- | --- |
| Modify existing code | Add new class |
| One file grows | Multiple focused files |
| Behavior in branches | Behavior in objects |

### Pros

- Open/Closed: open for extension, closed for modification
- Each notifier is testable in isolation
- Clear separation of concerns

### Cons

- Still need something to decide *which* notifier to use
- More files to manage

### When to Stop Here

- Channel selection is decided at compile time
- You inject notifiers via dependency injection
- 3-10 channels, moderate growth rate

---

## Stage 3: Generics (Type-Safe Abstraction)

**Style:** Abstract over types, not just behavior

**Change impact:** Add new class with specific types

### The Trigger

You notice: different channels need different user types and message formats.
- Email needs `EmailUser` and `EmailMessage`
- Slack needs `SlackUser` and `SlackPayload`
- Pushing a `String` to everything loses type safety

### The Code

```java
// Generic interface
public interface Notifier<U, M> {
    void send(U recipient, M message);
}

// Type-safe implementations
public class EmailNotifier implements Notifier<EmailUser, EmailMessage> {
    @Override
    public void send(EmailUser recipient, EmailMessage message) {
        System.out.println("Email to " + recipient.getEmail() + ": " + message.getSubject());
    }
}

public class SmsNotifier implements Notifier<PhoneUser, String> {
    @Override
    public void send(PhoneUser recipient, String message) {
        System.out.println("SMS to " + recipient.getPhone() + ": " + message);
    }
}

public class SlackNotifier implements Notifier<SlackUser, SlackPayload> {
    @Override
    public void send(SlackUser recipient, SlackPayload message) {
        System.out.println("Slack to " + recipient.getSlackId() + ": " + message.getText());
    }
}
```

### The Domain Types

```java
// User types - each channel has specific user data
public record EmailUser(String name, String email) {}
public record PhoneUser(String name, String phone) {}
public record SlackUser(String name, String slackId, String workspace) {}
public record DiscordUser(String name, String discordId, String serverId) {}

// Message types - each channel has specific message format
public record EmailMessage(String subject, String body, List<String> cc) {}
public record SlackPayload(String text, String channel, List<Attachment> attachments) {}
public record DiscordEmbed(String title, String description, String color) {}
```

### How Business Code Calls Them

#### With Dependency Injection (Spring Example)

```java
@Service
public class AlertService {
    
    private final Notifier<EmailUser, EmailMessage> emailNotifier;
    private final Notifier<PhoneUser, String> smsNotifier;
    private final Notifier<SlackUser, SlackPayload> slackNotifier;

    // Spring injects the correct implementations
    public AlertService(
            Notifier<EmailUser, EmailMessage> emailNotifier,
            Notifier<PhoneUser, String> smsNotifier,
            Notifier<SlackUser, SlackPayload> slackNotifier) {
        this.emailNotifier = emailNotifier;
        this.smsNotifier = smsNotifier;
        this.slackNotifier = slackNotifier;
    }

    public void sendUrgentAlert(User user, String alertMessage) {
        // Send via all channels - each with proper types
        
        // Email
        EmailUser emailUser = new EmailUser(user.getName(), user.getEmail());
        EmailMessage email = new EmailMessage("URGENT: " + alertMessage, alertMessage, List.of());
        emailNotifier.send(emailUser, email);
        
        // SMS - simple string message
        PhoneUser phoneUser = new PhoneUser(user.getName(), user.getPhone());
        smsNotifier.send(phoneUser, "URGENT: " + alertMessage);
        
        // Slack
        SlackUser slackUser = new SlackUser(user.getName(), user.getSlackId(), "company");
        SlackPayload slack = new SlackPayload(":rotating_light: " + alertMessage, "#alerts", List.of());
        slackNotifier.send(slackUser, slack);
    }
}

// Spring configuration
@Configuration
public class NotifierConfig {
    
    @Bean
    public Notifier<EmailUser, EmailMessage> emailNotifier() {
        return new EmailNotifier();
    }
    
    @Bean
    public Notifier<PhoneUser, String> smsNotifier() {
        return new SmsNotifier();
    }
    
    @Bean
    public Notifier<SlackUser, SlackPayload> slackNotifier() {
        return new SlackNotifier();
    }
}
```

#### Generic Service Layer

```java
public class NotificationService {

    // Generic method - works with any notifier
    public <U, M> void send(Notifier<U, M> notifier, U recipient, M message) {
        try {
            notifier.send(recipient, message);
            log.info("Sent notification to {}", recipient);
        } catch (Exception e) {
            log.error("Failed to send notification", e);
            throw new NotificationException("Failed to send", e);
        }
    }
    
    // Batch send - same types enforced
    public <U, M> void sendBatch(Notifier<U, M> notifier, List<U> recipients, M message) {
        for (U recipient : recipients) {
            send(notifier, recipient, message);
        }
    }
}

// Usage
NotificationService service = new NotificationService();
EmailNotifier emailNotifier = new EmailNotifier();

List<EmailUser> customers = List.of(
    new EmailUser("Alice", "alice@example.com"),
    new EmailUser("Bob", "bob@example.com")
);
EmailMessage promo = new EmailMessage("Sale!", "50% off today", List.of());

service.sendBatch(emailNotifier, customers, promo);  // Type safe batch send
```

### What Happens If Types Don't Match?

```java
EmailNotifier emailNotifier = new EmailNotifier();
SlackUser slackUser = new SlackUser("ops", "#general", "company");
String message = "Hello";

// COMPILE ERROR: incompatible types
emailNotifier.send(slackUser, message);  
// Required: EmailUser, EmailMessage
// Found: SlackUser, String
```

**The compiler catches mistakes. No runtime surprises.**

### Adding Features E, F, G

```java
// Feature E: Discord
public class DiscordNotifier implements Notifier<DiscordUser, DiscordEmbed> {
    @Override
    public void send(DiscordUser recipient, DiscordEmbed message) {
        System.out.println("Discord to " + recipient.getDiscordId() + ": " + message.getTitle());
    }
}

// Feature F: WhatsApp
public class WhatsAppNotifier implements Notifier<WhatsAppUser, WhatsAppMessage> {
    @Override
    public void send(WhatsAppUser recipient, WhatsAppMessage message) {
        System.out.println("WhatsApp to " + recipient.getWhatsAppId() + ": " + message.getBody());
    }
}

// Feature G: Telegram
public class TelegramNotifier implements Notifier<TelegramUser, TelegramMessage> {
    @Override
    public void send(TelegramUser recipient, TelegramMessage message) {
        System.out.println("Telegram to " + recipient.getTelegramId() + ": " + message.getText());
    }
}
```

### What Changed

| Polymorphism | Generics |
| --- | --- |
| `Notifier` with `User`, `String` | `Notifier<U, M>` with specific types |
| Runtime type errors | Compile-time type safety |
| Cast everywhere | No casting |

### Pros

- Compile-time type safety
- Each channel has proper domain types
- IDE autocomplete works correctly

### Cons

- More types to manage
- Still need a factory or registry to create instances

### When to Stop Here

- You want maximum type safety
- Different channels have genuinely different data models
- Team is comfortable with generics

---

## Stage 4: Registry (Remove Factory Switch)

**Style:** Register implementations by name

**Change impact:** Register new class, no factory modification

### The Trigger

You still have a factory with a switch:

```java
// This breaks Open/Closed principle
public class NotifierFactory {
    public static Notifier<?, ?> create(String type) {
        return switch (type) {
            case "email" -> new EmailNotifier();
            case "sms" -> new SmsNotifier();
            case "slack" -> new SlackNotifier();
            case "discord" -> new DiscordNotifier();  // Must modify for each new type
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}
```

Every new notifier = modify the factory. That's not truly open/closed.

### The Code

```java
public class NotifierRegistry {
    
    private final Map<String, Supplier<Notifier<?, ?>>> registry = new HashMap<>();

    public void register(String type, Supplier<Notifier<?, ?>> supplier) {
        registry.put(type, supplier);
    }

    public Notifier<?, ?> create(String type) {
        Supplier<Notifier<?, ?>> supplier = registry.get(type);
        if (supplier == null) {
            throw new IllegalArgumentException("Unknown notifier: " + type);
        }
        return supplier.get();
    }
}
```

### Usage

```java
// At startup - register implementations
NotifierRegistry registry = new NotifierRegistry();
registry.register("email", EmailNotifier::new);
registry.register("sms", SmsNotifier::new);
registry.register("slack", SlackNotifier::new);

// Adding Feature E: just register, no code modification
registry.register("discord", DiscordNotifier::new);

// At runtime - create by name
Notifier<?, ?> notifier = registry.create("email");
```

### What Changed

| Factory Switch | Registry |
| --- | --- |
| Modify factory for each type | Register at startup |
| Hardcoded mapping | Dynamic mapping |
| Breaks Open/Closed | Follows Open/Closed |

### Pros

- True Open/Closed: add new types without modifying existing code
- Can load from configuration
- Enables plugin architectures

### Cons

- Loses some type safety (wildcards)
- Registration must happen somewhere
- Runtime errors instead of compile-time

### When to Stop Here

- You need dynamic notifier selection at runtime
- Building a plugin system
- Types are loaded from configuration

---

## Stage 5: Table-Driven (Configuration Controls Behavior)

**Style:** Data describes behavior

**Change impact:** Add row to table, no code change

### The Trigger

You realize: most notifiers do the same thing with different parameters.
- Different endpoint
- Different message template
- Different retry count

Why write a new class for each?

### The Code

```java
// Configuration as data
public record NotifierConfig(
    String endpoint,
    String template,
    int retries
) {}

// Generic executor
public class TableDrivenNotifier {
    
    private final Map<String, NotifierConfig> table = Map.of(
        "email",    new NotifierConfig("smtp.server.com",    "Email to %s: %s",    3),
        "sms",      new NotifierConfig("sms.api.com",        "SMS to %s: %s",      2),
        "slack",    new NotifierConfig("slack.api.com",      "Slack to %s: %s",    1),
        "discord",  new NotifierConfig("discord.api.com",    "Discord to %s: %s",  1)
    );

    public void send(String type, String recipient, String message) {
        NotifierConfig config = table.get(type);
        if (config == null) {
            throw new IllegalArgumentException("Unknown type: " + type);
        }
        
        String payload = String.format(config.template(), recipient, message);
        callApiWithRetry(config.endpoint(), payload, config.retries());
    }

    private void callApiWithRetry(String endpoint, String payload, int retries) {
        for (int i = 0; i <= retries; i++) {
            try {
                System.out.println("Calling " + endpoint + " with: " + payload);
                return; // success
            } catch (Exception e) {
                if (i == retries) throw e;
            }
        }
    }
}
```

### Adding Feature H: Telegram

Just add a row:

```java
"telegram", new NotifierConfig("telegram.api.com", "Telegram to %s: %s", 2)
```

**No new class. No code change. Just data.**

### Externalize to JSON

```json
{
  "email": {
    "endpoint": "smtp.server.com",
    "template": "Email to %s: %s",
    "retries": 3
  },
  "sms": {
    "endpoint": "sms.api.com",
    "template": "SMS to %s: %s",
    "retries": 2
  },
  "telegram": {
    "endpoint": "telegram.api.com",
    "template": "Telegram to %s: %s",
    "retries": 2
  }
}
```

Now adding a channel = editing a config file. **Zero code deployment.**

### What Changed

| Registry | Table-Driven |
| --- | --- |
| Register class per type | Add row per type |
| Code defines behavior | Data defines behavior |
| Deploy code for new type | Deploy config for new type |

### Pros

- Add channels without code changes
- Non-developers can add channels
- Hot reload possible

### Cons

- All channels must fit the same pattern
- Custom logic requires escape hatches
- Harder to debug (behavior not in code)

### When to Stop Here

- Channels are similar (same algorithm, different parameters)
- You want ops/product to configure without developers
- High rate of channel additions

---

## Stage 6: Rule Engine (Policies Replace Branches)

**Style:** Declarative rules control decisions

**Change impact:** Add rules to table, no code change

### The Trigger

Business logic appears:
- VIP users get SMS for urgent messages
- Regular users get email only
- Night hours use push only

You could add if-else back... or externalize the *rules*.

### The Code

```java
// Rule definition
public record NotificationRule(
    String userType,
    String urgency,
    String channel,
    int retries
) {
    public boolean matches(User user, Context context) {
        return user.getType().equals(userType) 
            && context.getUrgency().equals(urgency);
    }
}

// Rule engine
public class RuleBasedNotifier {
    
    private final List<NotificationRule> rules;
    private final NotifierRegistry registry;

    public RuleBasedNotifier(List<NotificationRule> rules, NotifierRegistry registry) {
        this.rules = rules;
        this.registry = registry;
    }

    public void notify(User user, String message, Context context) {
        for (NotificationRule rule : rules) {
            if (rule.matches(user, context)) {
                Notifier<?, ?> notifier = registry.create(rule.channel());
                // Apply retry wrapper if needed
                sendWithRetry(notifier, user, message, rule.retries());
                return;
            }
        }
        throw new IllegalStateException("No matching rule for user: " + user);
    }

    private void sendWithRetry(Notifier<?, ?> notifier, User user, String message, int retries) {
        // Simplified - real implementation would be type-safe
        System.out.println("Sending via " + notifier.getClass().getSimpleName() + 
                           " with " + retries + " retries");
    }
}
```

### Rules as Data

```java
List<NotificationRule> rules = List.of(
    new NotificationRule("VIP",     "HIGH",   "sms",   3),
    new NotificationRule("VIP",     "LOW",    "email", 1),
    new NotificationRule("REGULAR", "HIGH",   "push",  2),
    new NotificationRule("REGULAR", "LOW",    "email", 1)
);
```

### Adding a New Rule

Business says: "Premium users should get Slack for high urgency."

```java
new NotificationRule("PREMIUM", "HIGH", "slack", 2)
```

**No code change. Just a new rule.**

### What Changed

| Table-Driven | Rule Engine |
| --- | --- |
| Data describes channels | Data describes decisions |
| "How to send" is configurable | "What to do when" is configurable |
| Parameters externalized | Business logic externalized |

### Pros

- Business rules as data
- Product/ops can modify behavior
- Audit trail of rule changes

### Cons

- Complex rule interactions
- Testing rules requires simulation
- Debugging gets harder

### When to Stop Here

- Business logic changes frequently
- Non-technical stakeholders need to modify behavior
- You need audit trails for decisions

---

## Stage 7: DSL (When Configuration Becomes Language)

**Style:** Domain-specific language for complex rules

**Change impact:** Write new rule in DSL syntax

### The Trigger

Rules get complex:
- Conditions need AND/OR logic
- Rules need ordering and priority
- Actions need sequencing

Flat tables can't express this anymore.

### The DSL

```
rule "VIP urgent notification"
when
    user.type == "VIP" AND urgency == "HIGH"
then
    send sms retry 3
    send email retry 1
end

rule "Night mode"  
when
    time.hour >= 22 OR time.hour <= 6
then
    send push only
end

rule "Default"
when
    true
then
    send email retry 1
end
```

### The Parser (Simplified)

```java
public class DslParser {
    
    public List<ParsedRule> parse(String dsl) {
        List<ParsedRule> rules = new ArrayList<>();
        // Real implementation would use ANTLR or similar
        
        // Simplified: parse "when X then Y" blocks
        Pattern rulePattern = Pattern.compile(
            "rule \"(.+?)\"\\s+when\\s+(.+?)\\s+then\\s+(.+?)\\s+end",
            Pattern.DOTALL
        );
        
        Matcher matcher = rulePattern.matcher(dsl);
        while (matcher.find()) {
            String name = matcher.group(1);
            String condition = matcher.group(2).trim();
            String action = matcher.group(3).trim();
            rules.add(new ParsedRule(name, condition, action));
        }
        
        return rules;
    }
}

public record ParsedRule(String name, String condition, String action) {}
```

### The Executor

```java
public class DslExecutor {
    
    private final NotifierRegistry registry;
    private final List<ParsedRule> rules;

    public DslExecutor(NotifierRegistry registry, String dsl) {
        this.registry = registry;
        this.rules = new DslParser().parse(dsl);
    }

    public void execute(User user, String message, Context context) {
        for (ParsedRule rule : rules) {
            if (evaluateCondition(rule.condition(), user, context)) {
                executeActions(rule.action(), user, message);
                return;
            }
        }
    }

    private boolean evaluateCondition(String condition, User user, Context context) {
        // Simplified condition evaluation
        // Real implementation would build expression tree
        return condition.equals("true") ||
               (condition.contains("VIP") && user.getType().equals("VIP"));
    }

    private void executeActions(String actions, User user, String message) {
        // Parse and execute each action
        // "send sms retry 3" -> registry.create("sms"), apply retry decorator
        System.out.println("Executing: " + actions + " for user: " + user.getName());
    }
}
```

### What Changed

| Rule Engine | DSL |
| --- | --- |
| Flat rules in tables | Structured rules with syntax |
| Limited condition logic | Full condition expressions |
| Single actions | Composed action sequences |

### Pros

- Express complex business logic
- Domain experts can read/write rules
- Version control for business logic

### Cons

- Must build/maintain parser
- Syntax errors are possible
- Steeper learning curve

### When to Stop Here

- Business rules are complex (AND/OR, nesting, sequences)
- Domain experts need to author rules
- You're building a product around configurability

---

## The Evolution Ladder

```
If-Else
   ↓  "Same operation, different behavior"
Polymorphism
   ↓  "Same behavior, different types"  
Generics
   ↓  "Remove factory switch"
Registry
   ↓  "Behavior as data"
Table-Driven
   ↓  "Decisions as data"
Rule Engine
   ↓  "Complex rules need syntax"
DSL
```

Each step:
- Reduces code churn for new features
- Increases flexibility
- Shifts change from code → data → language

---

## Side-by-Side Comparison

| Stage | New Feature Requires | Who Can Add | Type Safety | Complexity |
| --- | --- | --- | --- | --- |
| If-Else | Modify existing code | Developer | ✅ Full | Low |
| Polymorphism | New class | Developer | ✅ Full | Low |
| Generics | New class + types | Developer | ✅ Full | Medium |
| Registry | Register class | Developer | ⚠️ Partial | Medium |
| Table-Driven | Add config row | Ops/Dev | ❌ Runtime | Medium |
| Rule Engine | Add rule row | Product/Ops | ❌ Runtime | High |
| DSL | Write DSL rule | Domain Expert | ❌ Runtime | High |

---

## Decision Guide

```
Is behavior truly varying by type?
       │
       No → Stay with If-Else (Stage 1)
       │
       Yes
       │
Will you have 5+ implementations?
       │
       No → Polymorphism is enough (Stage 2)
       │
       Yes
       │
Do implementations need different types?
       │
       No → Skip Generics
       │
       Yes → Add Generics (Stage 3)
       │
       ↓
Do you need runtime selection by name?
       │
       No → Stay with DI / direct instantiation
       │
       Yes → Add Registry (Stage 4)
       │
       ↓
Are implementations mostly same algorithm, different params?
       │
       No → Stay with Registry + Classes
       │
       Yes → Go Table-Driven (Stage 5)
       │
       ↓
Do you need conditional business logic externalized?
       │
       No → Stay Table-Driven
       │
       Yes → Add Rule Engine (Stage 6)
       │
       ↓
Are rules too complex for flat tables?
       │
       No → Stay with Rule Engine
       │
       Yes → Build DSL (Stage 7)
```

---

## When NOT to Evolve

Each stage adds:
- Indirection
- Debugging complexity
- Learning curve

**Stop evolving when:**

| Signal | Action |
| --- | --- |
| Adding features is easy | Stay where you are |
| Team struggles to debug | Consider stepping back |
| Config changes cause outages | Add more validation, or use code |
| "We might need this" | Don't evolve for hypotheticals |

**The best architecture is the simplest one that solves your actual problem.**

---

## Real-World Examples

| System | What They Use | Why |
| --- | --- | --- |
| Kubernetes | DSL (YAML manifests) | Declarative infrastructure |
| Spring | Registry + Annotations | Plugin architecture |
| Drools | Full Rule Engine + DSL | Complex business rules |
| Apache Camel | DSL (Route definitions) | Integration patterns |
| Stripe | Table-Driven | Webhook configurations |
| AWS IAM | Policy DSL (JSON) | Access control rules |

---

## Final Takeaway

### The Spectrum

```
Code-Driven ←——————————————————————→ Configuration-Driven

  If-Else    Polymorphism    Registry    Table    Rules    DSL
     │            │             │          │        │       │
  Everything   Behavior      Creation   Params   Logic  Complex
  in code      abstracted    dynamic    in data  in data  rules
```

### What This Blog Covers

This blog describes **configuration-driven** systems:
- Behavior controlled by *authored rules*
- Humans write the config
- Config is deployed explicitly
- Behavior is deterministic

This is different from **data-driven** systems:
- Behavior emerges from *runtime data*
- ML models make decisions
- Feedback loops optimize behavior
- Behavior adapts automatically

The typical evolution:

1. **Code-driven** (if-else)
2. **Configuration-driven** (tables, rules, DSL) ← This blog
3. **Data-driven** (ML, optimization, real-time signals)

Most business systems stop at stage 2. Configuration-driven architectures are often a *prerequisite* for true data-driven systems.

### The Insight

> If-else is often a **future interface**, not a mistake.

Don't abstract prematurely. Let patterns emerge from real code. When you see the same operation with different behaviors, that's your signal to evolve.

**Start simple. Evolve when it hurts. Stop when it works.**