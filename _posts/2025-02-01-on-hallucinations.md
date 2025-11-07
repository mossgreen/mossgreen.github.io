---
title: AI Hallucinations Explained
tags:
  - LLM
  - AI
  - Prompt Engineering
search: true
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---
AI creates compelling stories but fabricates facts. Learn to spot and stop hallucinations.

AI hallucinations happen when AI systems make up false information and present it as fact. This is one of the biggest problems with AI today. Learning how to spot and prevent these made-up facts is crucial for anyone using AI.

## What Causes AI Hallucinations?

### Problems with Training Data
AI learns from text on the internet. But the internet isn’t always correct.

- Missing or wrong information: AI fills gaps by guessing.
- Conflicting facts: Training data may contain contradictory versions of reality.
- Example: An AI trained on incomplete history books might confidently say Napoleon was 6 feet tall (he was actually around 5'7").
- Example: If you ask about a tiny startup, AI might invent a CEO because the real one isn’t in its training data.

Technical insight: 
Training data sampling matters. If an AI sees some facts more often than others, it will prioritize those in its predictions, even if they’re wrong. Careful curation and balanced sampling can reduce hallucinations.

### How AI Models Work
AI predicts the next word based on probabilities learned from its training data. It doesn’t “know” facts—it identifies patterns in language.

- Pattern matching instead of truth-seeking: AI tries to sound human rather than accurate.
- Overconfidence: AI often presents guesses as facts.
- Example: Ask AI about a made-up person like "Dr. Sarah Johnson, the famous marine biologist," and it might create a full biography with fake research.- Example: Ask about “the history of Gondor,” and it will tell a story—because it doesn’t know Gondor is fictional.

Technical insight:
This is related to the language modeling objective—maximizing likelihood of next token, not factual correctness.

### Bad/Vague Questions and Context
- Unclear prompts: AI guesses what you mean.
- Leading questions: AI can mirror your bias instead of providing truth.
- Example: Asking "What are the health benefits of crystal healing?" may get a list of fake medical benefits instead of the truth: there’s no scientific proof crystals heal anything.

### Outdated Information
- AI is limited to its training cutoff date.
- Missing recent events can lead to wrong answers.
- Example: An AI trained in 2022 might give wrong information about who won the 2024 elections in US

### Always Trying to Help

AI is designed to provide answers rather than say “I don’t know,” which can lead to **fabricated responses**.

### Self-Delusion (Differentiating Generated vs. Given Data)
- One hypothesis suggests that LLMs hallucinate because they cannot differentiate between the data they are given (input) and the data they generate (output)
- If a model generates an initial incorrect statement, it may "snowball" by continuing to hallucinate to justify that initial wrong assumption
- This means a model can expand upon slightly out-of-the-ordinary sequences to produce outrageously wrong facts


## How to Spot Hallucinations

### Fact-Checking Methods
- Check multiple sources.
- Question exact numbers, dates, or quotes without references.
- Example: If AI claims "73% of people prefer blue cars," ask for the study—it probably doesn’t exist.

### Logic Tests
- Look for contradictions or implausible claims.
- Example: If AI says a historical person lived from 1850-1920 but also fought in World War II (1939-1945), something's wrong

### Source Checking
- Verify citations: Check if the sources AI mentions actually exist and say what AI claims
- Check expert credentials: Make sure quoted experts are real people with the right background
- Example: If AI cites "Dr. Smith's 2023 study in Nature magazine," you should be able to find this study online

### Warning Signs
- Overconfidence about disputed topics.
- Perfect round numbers without explanation.
- Too-convenient examples.
- Example: "Einstein once said in a private letter to his friend..." with no way to check if this letter exists

### AI as a Judge
- Use AI models to evaluate other AI models' outputs. 
- GPT-3.5 and GPT-4 have demonstrated effectiveness in measuring factual consistency, with tools like GPT-judge achieving high accuracy in predicting truthfulness

### Self-Verification (SelfCheckGPT)
-  Generate multiple responses to a query; if these responses significantly disagree, the original output is likely a hallucination. 
- This method can be expensive due to the number of AI queries required.

## How to Prevent and Fix Hallucinations

### Prompt Engineering Techniques
- Provide sufficient and relevant context
- Write clear and explicit instructions: adopting personas, using delimiters, specifying steps, providing examples, and controlling output length
- Ask models for concise responses (less token, lessly wrong)
- Utilise chain-of-thought (CoT), "think step by step"

### Data and Model Improvements
- Retrieval-Augmented Generation (RAG): Connect AI to verified external knowledge sources so it can pull facts instead of guessing.
- Fine-tune models with domain-specific, high-quality data
- Use web browsing or search APIs to allow agents to reference up-to-date information, reducing reliance on potentially outdated internal knowledge
- Structured databases: Use APIs or verified data to ground responses.
- Confidence signals: Let AI indicate uncertainty.
- Multiple AI models: Cross-check outputs for higher reliability.
- Example: Medical AI checks verified drug databases before suggesting treatment.

### Better Processes
- Human oversight for critical decisions.
- Multiple checkpoints and review steps.
- Specialized fine-tuning on high-quality domain data.
- Example: Medical AI requires a real doctor to approve recommendations before use.

### User Education and Safety
- Label AI-generated content.
- Teach AI to admit uncertainty.
- Encourage users to verify and critically assess outputs.
- Example: AI starting with: “Based on my training, which might be incomplete…” and offering verification suggestions.

### Company Policies
- Risk assessment: Categorize AI uses by how dangerous wrong information could be
- Regular checking: Continuously monitor AI outputs for mistakes and bias
- Learning from mistakes: Build systems that learn from found errors and fix them
- Example: News companies requiring human fact-checkers to verify all AI-written articles before publishing

## Key Takeaways
AI excels at storytelling, pattern recognition, and generating human-like text—but it’s not inherently truthful. Combining technical safeguards, human oversight, and clear processes can minimize hallucinations while keeping AI helpful.

> Remember: The goal isn't to make AI perfect overnight, but to build systems and habits that reduce wrong information while keeping the helpful things AI can do.

## todos
- theory about hallucinations
- designing metrics to measure hallucinations,

## References
- [AI Engineering by Chip Huyen](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)
