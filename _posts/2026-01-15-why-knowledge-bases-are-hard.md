---
featured: true
description: "RAG knowledge bases fail in predictable ways — bad chunking, weak retrieval, missing evaluation. A practical guide to the hidden failure points in RAG pipelines and how to build systems that actually work."
title: 'Why Building a Knowledge Base Is Harder Than It Looks'
tags:
- rag
- llm
- retrieval
- ai architecture
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

A knowledge base looks simple. Underneath, it is a pipeline — with many ways to break.

From the outside, it's three moves: connect your documents, ask a question, get an answer. Inside, it's a three-stage pipeline:

- **Ingest** — split your documents into small pieces.
- **Retrieve** — find the pieces that match the question.
- **Generate** — write an answer from them.

Every step can go wrong, and none of them throws an error: pick the wrong pieces, or misread the right ones, and you still get a confident answer — just a wrong one. That's why these systems sail through a demo and break in production. This post walks through where each step fails — and how to tell whether yours has.

## What a knowledge base is — and why you need one

A knowledge base is an organized, searchable collection of your documents and facts. The idea predates AI by decades — a company wiki, a help center, or Stack Overflow is a knowledge base. What's new is connecting one to an LLM.

You need that connection because a model's training is fixed and generic: it never saw your internal documents, it's frozen at a cutoff date, and asked about something it doesn't know, it often makes something up. A knowledge base grounds the model in your specific, current information and lets it cite its sources. Doing that well, though, is more than embedding search and a vector database (as Jason Liu argues) — and that gap is what the rest of this post is about.

## How it works: the RAG pipeline

A knowledge base doesn't *have* to use RAG. You could fine-tune the knowledge into the model, or — now that context windows hold a million tokens — paste every document into the prompt. But fine-tuning is expensive to keep current, and stuffing everything in breaks down on cost, latency, and recall as the corpus grows. For knowledge that's large, changing, or needs citations, the dominant approach is **Retrieval-Augmented Generation (RAG)** — and that's what this post is about.

RAG comes from a 2020 paper by Patrick Lewis and co-authors at Facebook AI Research. It has three stages:

1. **Ingest.** Split your documents into chunks, turn each chunk into a vector, and store them in a searchable index.
2. **Retrieve.** When a user asks a question, find the chunks most relevant to it and add them to the prompt.
3. **Generate.** The model writes an answer grounded in those chunks, with citations back to the source.

## Why it fails — stage by stage

Barnett et al. catalogued **seven failure points** in production RAG systems (CAIN 2024). They don't cluster in one place — they are spread across all three stages, and none of them throws an error. Each just yields a confident, plausible answer, which is why they sail through a demo and surface only in production. Here is where each one bites.

### Ingestion: getting documents in

This stage matters most and gets the least attention.

**Chunking.** You split documents into smaller pieces before storing them, and how you split them affects everything downstream.

- Too small: you cut off the context a passage needs.
- Too big: each result is partly irrelevant, so the match is weaker.

There is no single correct size, and a chunk can be useless once it's separated from the page it came from. Chroma's evaluation of chunking strategies shows the choice measurably moves retrieval accuracy — it is not a detail. The common fix is to add overlap, or store the text at several sizes, but that bloats the index, retrieves the same passage more than once (so you have to de-duplicate), and still doesn't tell a chunk which document or section it came from.

Better options:

- Split on meaning, not a fixed length.
- Label each chunk with where it sits in the document.
- Anthropic's *Contextual Retrieval* prepends a short line of context to each chunk before storing it, for exactly this reason.

**Conflicting or out-of-date documents.** Retrieval returns whatever you gave it. It can't reconcile two documents that disagree, a document that's months stale, or knowledge that was never written down. If the answer isn't in your documents, no search method can find it — this is Barnett's first failure point, *missing content*.

**Documents aren't always text.** A real document set includes wiki pages, but also screenshots, diagrams, and whiteboard photos. To search an image you have two choices:

- Turn it into text first — OCR for typed text, plus a vision model to describe diagrams, then store the text. Standard, but lossy and brittle.
- Store the page image directly with a model like ColPali, which skips OCR and embeds the page as a vector. Strong on charts and complex layouts.

The hard cases stay hard: ColPali's authors flag handwritten documents as outside what they tested, and audio and video have to be transcribed before any of this applies. Every new format adds a step that can fail.

### Retrieval: finding the right information

The common mistake is treating search as a choice between two methods. Both have been around for years:

- **Keyword search (BM25).** Matches words; the backbone of Lucene and Elasticsearch, from work by Robertson and Spärck Jones. Finds an exact string like the error code `TS-999`, but doesn't know that "can't log in" and "authentication failure" mean the same thing.
- **Semantic search.** Matches meaning, via methods like Dense Passage Retrieval (Karpukhin et al., 2020) and ColBERT (Khattab & Zaharia, 2020); the nearest-neighbour lookup itself is usually handled by an index such as HNSW (Malkov & Yashunin). Places similar ideas close together, but can miss the exact `TS-999` and return general text instead.

Neither is enough alone. Use both and fuse the results (Reciprocal Rank Fusion, Cormack et al., 2009). Anthropic's tests show the gain — measured as the reduction in top-20 retrieval failures:

- Contextual embeddings: 35% fewer failures.
- Plus keyword search: 49%.
- Plus a reranking step: 67%.

The methods people treat as alternatives work better together.

**Which results to keep.** The common approach sets a score cutoff and keeps the strong matches — but the cutoff is usually a guess. Better: retrieve many results, then use a **reranker** (a model that judges how well each result answers the question) to sort them, and surface only the top few. Public answer engines work this way — retrieving many candidates per query and showing only a handful. Get this wrong and you hit Barnett's second failure point: the right document was retrieved, but didn't rank high enough to be used.

**The question itself is also a problem.** A user types "the billing issue" when there are forty of them. You can ask them to be specific, or rewrite the query for them — HyDE writes a hypothetical answer first and searches with that. How far to go is a design choice, not a solved problem.

### Generation: assembling and answering

You've found good chunks. You're still not done.

**Too little or too much context.** One chunk and the answer may be incomplete; twenty and it can get lost. *Lost in the Middle* (Liu et al., 2023) found that models use information best at the start or end of a long context and often miss the middle — true even for models built for long contexts. So where a chunk sits in the prompt affects whether the model uses it, which is why systems add a step to rerank, shorten, and order the context before generating (Fusion-in-Decoder, Izacard & Grave, 2021, is the classic way to combine many passages). That step adds cost and latency to every query. A retrieved chunk that never makes it into the final prompt is Barnett's third failure point.

**Finding the answer is not the same as using it.** Even with the correct source in front of it, the model can ignore it, blend it with its own assumptions, or make something up. This covers the rest of Barnett's failure points: the answer was there but not extracted (#4), the requested format was ignored (#5), the reply was too vague or too specific (#6), or it was incomplete (#7). Finding the right information and stating it correctly are two separate problems.

## How to do it properly

Doing it properly means improving two things at once: how you **structure** documents going in, and how you **retrieve** them coming out. Most tutorials stop at flat chunks and naive search — and improving only one side just leaves the other as the bottleneck.

The shape is the same everywhere: hybrid retrieval, then reranking, then grounded generation, on top of documents that have been labeled and linked. Two common variants:

- **Structure-first.** Build a knowledge graph of entities and relationships (people, projects, documents) rather than flat chunks. Map every source into one format, enforce permissions at query time, and link related documents so "the billing issue" resolves to the right one. Internal corporate tools tend this way — the value compounds as the graph grows richer.
- **Pipeline-first.** Run full retrieval on every query: hybrid keyword + semantic search, a cross-encoder reranker, then a final pass for authority and recency. Add citations to the prompt before the model writes, so the answer stays tied to its sources. Public-facing tools tend this way — the value is freshness and breadth.

If you need to answer "what are the themes across everything" questions that flat retrieval can't, there's a graph version: Microsoft's **GraphRAG** uses an LLM to build a knowledge graph from your documents. It's powerful but expensive — graph indexing can be orders of magnitude more costly than vector indexing, and Microsoft's own advice is to start small. Don't build a graph unless you actually need to connect entities across documents.

More advanced systems make retrieval *adaptive*: the model judges whether what it retrieved is good enough and retries or corrects when it isn't (Self-RAG, Asai et al., 2024; CRAG, Yan et al., 2024).

## How to evaluate it

This is how you answer the question the demo couldn't: does it actually work? You have no answer key, and every failure mode above produces a confident answer — so you can't eyeball it. Without measurement, a knowledge base goes stale and no one notices. As Hamel Husain argues, your AI product needs evals — a knowledge base is only as good as the evals you build around it.

Start with a **golden set**:

- 50–200 examples of (question → ideal answer → source passage).
- Write them by hand, or generate them from your documents and review them.
- Include hard cases: vague questions, questions with no answer, multi-step questions. Otherwise you only test the easy path.

Score the two stages separately, because a system can find the right chunk and still make something up, or miss it and still sound confident. Measure retrieval first — a generation problem you can't trace back to retrieval is hard to fix (Liu, *Systematically Improving Your RAG*):

- **Retrieval:** recall@k (did the right passage make the top-k?), precision@k, MRR.
- **Generation:** faithfulness (is every claim backed by a source? this catches made-up answers) and answer relevance.

A few notes:

- Grade generation with an LLM-as-judge (a strong model scoring answers against the sources), but check it against a few human-graded examples — judges favor longer answers and their own style.
- Tools like RAGAS and DeepEval do this for you.
- Fifty examples beat zero. The goal is a ruler, not a perfect score.

## Summary

The demo is the easy part. The rest is a pipeline — getting documents in, finding them, assembling them, generating the answer — and every stage has a known, silent way to fail.

What separates a system that demos well from one that works isn't a cleverer model. It's structure (labeled, linked documents), retrieval that combines keyword and semantic search with reranking, and measurement around the whole thing. You only find out it's broken if you measure it.

Build a golden set with fifty examples. Add reranking to your retrieval. Label your chunks. Then measure again, and repeat until the system is honest about what it doesn't know — that's when it starts being useful.

## References

**Foundations**

- **RAG (the origin)** — Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS 2020. [arXiv:2005.11401](https://arxiv.org/abs/2005.11401)
- **RAG survey** — Gao et al., "Retrieval-Augmented Generation for Large Language Models: A Survey" (2023). [arXiv:2312.10997](https://arxiv.org/abs/2312.10997)
- **Seven Failure Points** — Barnett et al., "Seven Failure Points When Engineering a Retrieval Augmented Generation System," CAIN 2024. [arXiv:2401.05856](https://arxiv.org/abs/2401.05856)

**Ingestion**

- **Contextual Retrieval** — Anthropic, "Introducing Contextual Retrieval" (2024). [anthropic.com/news/contextual-retrieval](https://www.anthropic.com/news/contextual-retrieval)
- **Chunking strategies** — Smith & Troynikov, "Evaluating Chunking Strategies for Retrieval," Chroma Research (2024). [research.trychroma.com/evaluating-chunking](https://research.trychroma.com/evaluating-chunking)
- **Multimodal retrieval (ColPali)** — Faysse et al., "ColPali: Efficient Document Retrieval with Vision Language Models" (2024). [arXiv:2407.01449](https://arxiv.org/abs/2407.01449)

**Retrieval**

- **Keyword search (BM25)** — Robertson & Spärck Jones (1976); Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009)
- **Dense retrieval (DPR)** — Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering," EMNLP 2020
- **Late interaction (ColBERT)** — Khattab & Zaharia, "ColBERT," SIGIR 2020
- **Vector index (HNSW)** — Malkov & Yashunin, "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs," IEEE TPAMI 2018. [arXiv:1603.09320](https://arxiv.org/abs/1603.09320)
- **Rank fusion (RRF)** — Cormack, Clarke & Büttcher, "Reciprocal Rank Fusion," SIGIR 2009
- **Query rewriting (HyDE)** — Gao et al., "Precise Zero-Shot Dense Retrieval without Relevance Labels" (2022). [arXiv:2212.10496](https://arxiv.org/abs/2212.10496)

**Assembly & generation**

- **Fusion-in-Decoder** — Izacard & Grave, "Leveraging Passage Retrieval with Generative Models for Open Domain Question Answering," EACL 2021. [arXiv:2007.01282](https://arxiv.org/abs/2007.01282)
- **Lost in the Middle** — Liu et al., "Lost in the Middle: How Language Models Use Long Contexts," TACL 2024. [arXiv:2307.03172](https://arxiv.org/abs/2307.03172)
- **Adaptive retrieval (Self-RAG)** — Asai et al., "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection," ICLR 2024. [arXiv:2310.11511](https://arxiv.org/abs/2310.11511)
- **Corrective retrieval (CRAG)** — Yan et al., "Corrective Retrieval Augmented Generation" (2024). [arXiv:2401.15884](https://arxiv.org/abs/2401.15884)

**Architecture**

- **Knowledge graphs (GraphRAG)** — Microsoft Research, "GraphRAG" (2024). [github.com/microsoft/graphrag](https://github.com/microsoft/graphrag)

**Evaluation**

- **Your AI product needs evals** — Hamel Husain (2024). [hamel.dev/blog/posts/evals](https://hamel.dev/blog/posts/evals/)
- **RAG is more than embedding search / Systematically Improving Your RAG** — Jason Liu (2023–2024). [jxnl.co/writing](https://jxnl.co/writing/)
- **RAGAS** — Es et al., "RAGAS: Automated Evaluation of Retrieval Augmented Generation" (2023). [arXiv:2309.15217](https://arxiv.org/abs/2309.15217)
