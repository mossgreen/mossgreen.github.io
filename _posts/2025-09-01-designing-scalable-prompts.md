---
title: Scalable Prompt Design
tags:
  - LLM
  - Prompt engineering
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide

---
Separate stable concepts from changing details. Your prompts become maintainable, not messy.

Like a lot of developers, when I first started working with LLMs I wrote prompts in a very ad-hoc way. They worked… until they didn’t. Every new requirement meant I had to re-write or patch together instructions. It quickly turned into prompt soup — hard to maintain, inconsistent, and fragile.

That got me thinking: what if I applied the same design principles I use when writing software?

Specifically, I looked at the SOLID principles. These ideas have been around for decades in software engineering, but it turns out they map really well to prompt engineering too. While some principles are not relevent, I still managed to have a simple but powerful lesson:
separate the stable concepts from the changing implementation.

## From Messy Prompt to Structured Design

Here’s an early example from my practice.

I started with something like this:

```text
The current date time is 2023-09-11T20:29:42.  
The user locale is: en_AU.  
User input: I want to buy a red apple  

Please disregard previous messages and do not infer any data from existing information.  
You are an assistant designed to extract JSON from text. Users will provide a string of text, and your task is to respond with information extracted from the text, formatted as a JSON object with a fixed structure.  

Instructions:  
1. No Chat History Utilization...  
2. JSON Structure...  
3. Output Format...  
4. Extracted Values Options...  
```

It worked, but the problem was obvious: everything — rules, definitions, options, and instructions — lived in one big block. Updating it meant carefully threading new details into the whole thing.

## Thinking in SOLID

So I stopped and asked: how would I design this if it were code?

That’s when the SOLID principles clicked.

Single Responsibility Principle (SRP)
The system prompt should only introduce stable concepts. The user prompt should only handle case-by-case details.

Open/Closed Principle (OCP)
The system prompt should be closed to modification but open to extension. I don’t want to rewrite my whole base prompt whenever I add a new field.

## Redesigning with Interfaces and Implementations

Here’s how I rewrote the structure:

System Prompt (the interface, or say the concept):

```java
private static final String SYSTEM_PROMPT = """
A response is a JSON that consists of userIntent and extractedValues.
The userIntent is one of the matching value from the intent_options based on the user request.
The extractedValues consist of key-value pairs.
The key of an extractedValue is a field name.
The value of an extractedValue is an array, extracted from user request based on a field's instruction.
If a field has options, the value must be one of the options, otherwise leave it empty.

**definitions**
A field_type consists of the following attributes:
- name: name of the field_type
- instruction: the information to extract from a user request

A field consists of the following attributes:
- name: field name
- type: field type
- options: it's an optional attribute. A list of options that will match the user input
""";

```

This doesn’t change often. It defines the “contract.”

User Prompt (the implementation):

```java
private static final String INTENT_OPTIONS = """
intent_options consist the following values:
- product purchase
- book a dinner
- sell a car
- order a service
""";

private static final String FIELD_TYPES = """
Available field_types are:
- name: text
  instruction: 
- name: number
  instruction: 
- name: email
  instruction: 
- name: monetary
  instruction: 
""";

private static final String FIELDS = """
Available fields:
- name: username
  type: text
  description: username of the user
- name: budget
  type: monetary
  description: budget of the product or service
- name: email
  type: email
  description: email of the user
- name: location
  type: text
""";
```

## Why This Matters

Separating concepts from implementation has a few big advantages:

- Reusability: one system prompt can support many use cases.
- Maintainability: I only update the user prompt when details change.
- Scalability: I can add new domains (like booking, shopping, or services) without rewriting the core logic.

It’s the same mindset I use in software design: keep the foundation stable, plug in details as needed.

## Wrapping Up

The big insight here is simple:

System prompts = stable interface

User prompts = flexible implementation

It’s the same separation of concerns we use in software design — just applied to LLMs.

So the next time you’re writing a prompt, ask yourself:

Am I defining the interface (the stable rules)?

Or am I filling in the implementation (the case-specific details)?

Thinking this way has made my prompts far more scalable — and honestly, a lot less stressful to maintain.

⚡ That’s my experience. It’s not a universal rulebook, but I’ve found that thinking it this way before answering my own prompt questions keeps me from painting myself into a corner.

