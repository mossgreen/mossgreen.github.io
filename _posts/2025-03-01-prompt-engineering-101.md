---
title: Prompt Engineering 101
tags:
  - LLM
  - AI
  - Prompt engineering
  - transformer
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

The art and science of building LLM-based applications.

Large Language Models (LLMs) are transforming how we build intelligent applications. But using them effectively is not as simple as asking a question. The way you **ask**—the prompt—shapes the quality, reliability, and usefulness of the answer.  

This practice is called **prompt engineering**. And while it may look like “just writing instructions,” it is deeply connected to how LLMs—and their underlying Transformer architecture—work.  

---

## What is Prompt Engineering?  

At its simplest, **prompt engineering** is the design of inputs to LLMs so that their outputs are aligned with your goals.  

Think of it as writing a “program in natural language.” Instead of changing model weights or retraining, you shape the model’s behavior through the input text.  

The goal: **communicate effectively with AI to get predictable, useful results.**  

---

## Elements of a Good Prompt  

A strong prompt is not just a question—it has structure and purpose.  

- **Task Description / Instruction**  
  State what the model should do, what role it should take, and what format you expect.  
  - ❌ Weak: *“What do users think about our new feature?”*  
  - ✅ Better: *“Analyze customer feedback on our new analytics feature released last month. Identify positive and negative sentiments, and highlight the top three problems raised by users.”*  

- **Context**  
  Provide background—either static (general guidelines) or dynamic (retrieved in real-time). Rich context anchors the response and reduces hallucination.  

- **Examples (Few-Shot Prompting)**  
  Demonstrate the task with sample input-output pairs. This leverages **in-context learning**, a hallmark of Transformers.  

- **Constraints**  
  Limit style, tone, or length (e.g., *“Limit to 800 words, avoid technical jargon”*).  

- **Persona**  
  Define a role (e.g., *“You are a cybersecurity expert writing for executives”*) to shape tone and perspective.  

---

## Key Strategies and Best Practices  

- **Write Explicit Instructions** – Ambiguity increases error rates.  
- **Provide Sufficient Context** – Retrieval-Augmented Generation (RAG) dynamically injects external data to overcome context window limits.  
- **Break Down Complex Tasks** – Use *Chain-of-Thought* prompting (“think step by step”) or *prompt chaining* (multi-step sequences where one output feeds into the next).  
- **Specify Output Format** – JSON, CSV, bullet points—define it so outputs are machine-usable.  
- **Iterate and Evaluate** – Prompt engineering is experimental. Tools like *Prompt Flow* support versioning and evaluation.  
- **Give the Model Time to Think** – CoT or reflection strategies improve reasoning depth.  
- **Use Delimiters** – XML tags, triple quotes, or Markdown sections reduce ambiguity in parsing.  

---

## Why Prompt Engineering Works  

Prompt engineering works by aligning with how LLMs function:  

- **LLMs as Completion Engines**  
  At their core, LLMs are **autoregressive sequence models** trained to predict the next token. Prompts guide this continuation.  

- **Activating Latent Capabilities**  
  Training on massive corpora gives LLMs a “library” of reasoning patterns. A well-crafted prompt activates the relevant one.  

- **Guiding Without Retraining**  
  Prompts shape behavior without touching weights—faster and cheaper than fine-tuning.  

- **Improving Reliability**  
  Clear prompts reduce hallucination and variance across runs.  

- **Robustness**  
  Stronger LLMs tolerate minor variations in phrasing, while weaker models require very precise wording.  

---

## Inside the Black Box: How Prompts Influence LLMs  

- **Autoregressive, Token-by-Token Generation**  
  Models generate outputs sequentially, one token at a time. Reading long prompts is fast; generating long answers is slower (an *inference bottleneck*).  

- **In-Context Learning**  
  Examples in the prompt condition the model without retraining—few-shot prompting exploits this.  

- **Attention Mechanism**  
  Transformers weigh relationships between tokens. Information at the **start and end** of prompts is weighted more strongly than the middle (the *Valley of Meh*). Placement matters.  

- **Chain-of-Thought (CoT)**  
  Explicit reasoning requests (“think step by step”) simulate an internal monologue the model doesn’t naturally have.  

- **State of Mind**  
  A prompt sets a temporary “frame of reference,” conditioning what tokens are predicted next.  

---

## How Transformers Shape Prompt Engineering  

The Transformer architecture is the foundation of modern LLMs, and its characteristics directly shape how prompt engineering works.  

- **Attention Mechanism & Context Limits**  
  The attention mechanism weighs token importance, enabling flexible reasoning but also creating **context length limits**, since more tokens mean more computation.  
  Prompt engineering addresses this through:  
  - **Retrieval-Augmented Generation (RAG):** inject only the most relevant external context.  
  - **Summarization:** compress or drop less relevant content to fit the context window.  

- **Processing Order & the “Valley of Meh”**  
  Transformers process sequences token by token. Models attend more strongly to **the start and end** of a prompt, while the middle is weaker. Prompt engineers place instructions strategically to avoid this drop-off.  

- **Autoregressive Token Generation**  
  Transformers generate text one token at a time. They are fast at *reading* long prompts but slower at *writing* long completions. Techniques include:  
  - **Chain-of-Thought (CoT):** encourage step-by-step reasoning.  
  - **Prompt Chaining:** break complex problems into linked prompts.  

- **In-Context Learning (Few-Shot Prompting)**  
  Transformers can learn from examples inside the prompt itself, without retraining. Few-shot prompting leverages this to adapt models to domain-specific tasks.  

- **Post-Training & Alignment**  
  Most LLMs are aligned with human preferences (e.g., via **RLHF**). Prompts that specify roles, personas, or rules exploit this alignment for more reliable responses.  

---

## Good Examples of Prompt Engineering  

### Example 1: Customer Feedback  
- ❌ Weak: *“What do people think about our product?”*  
- ✅ Better: *“Analyze customer reviews of our mobile app released last month. Identify the top three positive themes and the top three complaints. Present results as bullet points with short explanations.”*  

### Example 2: Summarization  
- ❌ Weak: *“Summarize this article.”*  
- ✅ Better: *“Summarize the following article in three bullet points under 15 words each. Focus only on business impacts.”*  

### Example 3: Code Help  
- ❌ Weak: *“Write a Python function to process data.”*  
- ✅ Better: *“Write a Python function that takes a CSV of customer orders and returns total revenue by country. Use pandas and handle missing values.”*  

### Example 4: Persona  
- ❌ Weak: *“Explain blockchain.”*  
- ✅ Better: *“You are a financial advisor explaining blockchain to a non-technical client. Use simple language and one analogy.”*  

### Example 5: Creative Writing  
- ❌ Weak: *“Write a story about space.”*  
- ✅ Better: *“Write a 200-word science-fiction story about a lone astronaut on Mars who discovers a hidden cave. End with a cliffhanger.”*  

---

## Conclusion  

Prompt engineering is both **art and science**.  
It builds on an understanding of **how Transformers work internally** and applies **practical techniques** to shape model behavior.  

With well-designed prompts—structured, contextual, and aligned with model architecture—you can unlock the full power of LLMs without retraining.  

## References
- [AI Engineering by Chip Huyen](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)
