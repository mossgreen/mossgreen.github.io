---
title: 3 Ways to Improve LLM Answer Quality
tags:
  - LLM
  - Prompt engineering
  - RAG
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Starts with a little effort.

## The short answer
To get noticeably better responses from any large-language model you can pull three main levers:

1. Prompt engineering – craft clearer, more structured prompts.

2. Retrieval-Augmented Generation (RAG) – give the model fresh, task-specific documents at run time.

3. Parameter-efficient fine-tuning (LoRA / DoRA) – train small “adapter” weights so the model internalises your domain.

## comparasion

| Approach  | What it is  |Key benefit	   | Main challenge	  | Java-friendly tooling|
|---|---|---|---|---|
|Prompt engineering	   |Writing instructions, examples and constraints inside the prompt so the frozen model behaves as you want   | Instant improvement—no retraining or new infra needed  |Fragile and iterative: vague wording, token limits and hallucinations still bite.	   |Spring AI & langeChain   |
| RAG  | A pipeline that first retrieves relevant document chunks (via embeddings search) and then injects them into the prompt before generation  | Up-to-date, source-grounded answers; fewer hallucinations  | Needs a vector store, retrieval logic and careful filtering; bad snippets = bad answers  | Weaviate or Lucene for retrieval + DJL / Spring AI for generation; projects like LangChain4j wrap the pattern  |
| LoRA / DoRA fine-tuning	  | Train tiny low-rank adapter matrices while keeping the original model frozen (LoRA); DoRA further freezes the sign of each weight and only learns magnitudes, improving accuracy at the same cost  | Lets you specialise a huge model on modest hardware—only a few million extra parameters  |Requires task data and some GPU time; still early-days for full Java workflows   | Fine-tune with PEFT in Python, then load the merged weights with DJL; or call the tuned model over gRPC/HTTP.|

## Take-aways

1. Start with prompts—it’s free and immediate.
2. Add RAG when you need current or proprietary knowledge.
3. Fine-tune with LoRA/DoRA when the model must internalise your tone, policy or task logic.

Mastering all three techniques gives you a flexible toolbox for squeezing the best possible answers out of any LLM.

## References
- [Retrieval-augmented generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
- [Prompt Engineering Techniques with Spring AI](https://spring.io/blog/2025/04/14/spring-ai-prompt-engineering-patterns)

Last Updated:  2014 May