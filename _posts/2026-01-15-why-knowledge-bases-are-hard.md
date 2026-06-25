---
featured: true
description: "A knowledge base looks like a search box. Underneath it is a four-stage RAG pipeline where every stage fails silently. A comprehensive walk through the failure points — ingestion, retrieval, assembly, generation — plus the concerns that cut across all of them, how to evaluate the system, and where the field is going."
title: 'Why Building a Knowledge Base Is Harder Than It Looks'
tags:
- rag
- llm
- retrieval
- ai architecture
- evaluation
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

An AI knowledge base looks like a search box. You point it at your company's documents, type a question, and get an answer back.

It isn't. Underneath is a pipeline, and every stage fails without an error — just a confident, wrong answer. What makes it work is not a better model but structure and measurement around the pipeline. You only learn it is broken if you measure. This post walks the stages, the concerns that cut across them, how to evaluate it, and where the field is heading.

## What a knowledge base is — and why you need one

A knowledge base is an organized, searchable collection of your documents and facts. The idea predates AI by decades — a company wiki, a help center, or Stack Overflow is a knowledge base. What's new is connecting one to an LLM.

You need that connection because a model's training is fixed and generic: it never saw your internal documents, it's frozen at a cutoff date, and asked about something it doesn't know, it often makes something up. A knowledge base grounds the model in your specific, current information and lets it cite its sources. 

Doing it well, though, is more than embedding search and a vector database — and that gap is the rest of this post.

## A knowledge base is a pipeline, not a feature

A knowledge base doesn't *have* to use RAG. Two alternatives, each with a catch:

- **Fine-tune** the knowledge into the model — but it's expensive to keep current.
- **Paste everything** into the prompt, now that context windows hold a million tokens — but it breaks down on cost, latency, and recall as the corpus grows.

For knowledge that's large, changing, or needs citations, the dominant approach is **Retrieval-Augmented Generation (RAG)**.

RAG comes from a 2020 paper by Patrick Lewis and co-authors at Facebook AI Research. Instead of relying only on what a model memorized during training (*parametric* memory), you give it an external index to look things up in at answer time (*non-parametric* memory).

The pipeline is short to describe: chunk your documents, embed them, store the vectors, retrieve the closest, put them in the prompt, and generate an answer. Those same steps, named and grouped, are the **four stages** — each easy to name and hard to do well.

Each also fails in its own way. Barnett and colleagues' 2024 field report, *Seven Failure Points When Engineering a Retrieval Augmented Generation System*, cataloged seven failures across the pipeline; none throws an error, which is why they surface only in production:

1. **Ingestion** — split your documents into pieces and store them.
   - *#1 missing content* — the answer was never in the corpus.
2. **Retrieval** — find the pieces that match the question.
   - *#2 missed the top-ranked documents* — the right piece existed but ranked too low.
3. **Assembly** — choose and order what goes in the prompt.
   - *#3 not in context* — the right piece never made it into the prompt.
4. **Generation** — write an answer grounded in those pieces.
   - *#4–7 not extracted, wrong format, wrong specificity, incomplete* — the answer was in the prompt but the model still got it wrong.

Walk the pipeline and the difficulty shows up at every stage.

## Stage 1 — Ingestion: garbage in, confident garbage out

This is the stage that matters most and gets demoed least. Three separate problems bite here.

### Chunking — how you cut the documents

Before anything is searchable, you cut documents into passages. The size is a trade-off:

- **Too small** — you cut off the context a passage needs to mean anything.
- **Too big** — every result is half-irrelevant, which dilutes the match.

There is no universal right size — Chroma's evaluation shows the choice measurably moves retrieval accuracy — and a chunk that reads fine to a human can be meaningless once it is separated from the page around it.

The common fix is redundancy: overlap the chunks, or store them at several sizes. It helps, but it inflates the index, retrieves the same passage twice, and still never tells a chunk what document or section it came from. Two better moves:

- **Split on meaning**, not a fixed token count.
- **Label each chunk** with where it sits — Anthropic's *Contextual Retrieval* uses an LLM to prepend a one-line "here's where this sits" note to every chunk before indexing.

### Conflicting and stale knowledge — what's in the corpus

Retrieval surfaces whatever you fed it, and it cannot reconcile:

- two documents that disagree,
- a document six months out of date,
- knowledge that lives in someone's head and was never written down.

If the answer is not in the corpus, no search method can conjure it. This is Barnett's first failure point, *missing content* — an ingestion problem, not a retrieval one.

### Documents that aren't text — formats beyond plain text

A real corpus is wiki pages, but also screenshots, diagrams, and whiteboard photos. To make an image searchable, two options:

- **Convert it to text first** — OCR for typed text, plus a vision model to describe diagrams and charts, then index that. Standard, but lossy and brittle.
- **Embed the image directly** — models like ColPali skip OCR and embed the page screenshot into the vector space. Strong on charts and dense layouts.

The hard cases stay hard. Whiteboard photos defeat both — handwriting plus freehand boxes and arrows is the worst input either approach has, and even ColPali's authors flag handwritten documents as outside what they tested. Audio and video need transcription before any of this applies. Every new format is another preprocessing step that can fail.

## Stage 2 — Retrieval: finding the needle

Once the documents are in, you have to find the right pieces for a question. The common mistake is treating this as a choice between two search methods. It isn't: you need both, plus a second pass to sort them and some help with the question itself.

### Lexical vs semantic — run both, don't choose

Two families of search, each with a long pedigree:

- **Lexical search (BM25)** matches words. The workhorse behind Lucene and Elasticsearch, rooted in the probabilistic-relevance work of Robertson and Spärck Jones. Ask for error code `TS-999` and it finds the literal string — but it has no idea that "can't log in" and "authentication failure" are the same thing.
- **Semantic search** matches meaning. Dense Passage Retrieval (Karpukhin et al., 2020) and late-interaction models like ColBERT (Khattab & Zaharia, 2020) embed text so "can't log in" lands near "authentication failure" — the nearest-neighbour lookup itself handled by an index such as HNSW. But it can sail past the exact `TS-999` and return generic content instead.

Neither wins outright, so you run both and fuse the results (Reciprocal Rank Fusion, Cormack et al., 2009). On Anthropic's own benchmarks, measured as the reduction in top-20 retrieval failures, the methods are additive:

- Semantic embeddings alone: 35% fewer failures.
- Plus lexical search: 49%.
- Plus a reranking step: 67%.

This doesn't take two systems: engines like Elasticsearch and OpenSearch run BM25, vector search, and RRF in a single index.

### Which results to keep — recall, then rerank

The instinct is a similarity-score cutoff: keep the strong matches, drop the rest. Two traps. First, the score is real but the line you draw on it usually isn't backed by anything. Second, the instinct itself is wrong. You don't aim for a clean result set at retrieval time — you retrieve widely for *recall*, then let a **reranker** (a model that scores how well each candidate answers the query) do the precision work. Public answer engines work this way: retrieve many candidates, surface only a handful. Get this wrong and you hit Barnett's second failure point — the right document existed but never ranked high enough to be seen.

### The query itself — rewriting the question

A user types "the billing issue" and means one of forty. You can ask them to clarify, or rewrite the query for them — HyDE drafts a *hypothetical* answer and searches with that instead of the bare question. How far to go is a product judgment, not a solved problem.

## Stage 3 — Assembly: ordering the context

You've found good chunks. Now you decide what actually goes into the prompt, and in what order. Both matter.

### How much goes in — too little, too much

Return one chunk and you've under-answered. Dump twenty and you've buried the answer in noise. More context is not automatically better.

### What order — lost in the middle

Position changes what the model uses. *Lost in the Middle* (Liu et al., 2023) showed that models reliably use information at the **start and end** of a long context and miss what's in the **middle** — even models built for long contexts. So you add a pass to rerank, compress, and order the context before generating (Fusion-in-Decoder, Izacard & Grave, 2021, is the classic way to combine many passages), and it costs money and latency on every query. A retrieved chunk that never makes it into the final prompt is Barnett's third failure point, *not in context*: finding a passage and getting it in front of the model are two different things.

## Stage 4 — Generation: grounding

The last stage is the hardest to defend against. Even when the system retrieves the *correct* source, the model can ignore it, blend it with its own assumptions, or fabricate around it.

### Grounding isn't retrieval — finding the truth vs stating it

This covers the back half of Barnett's list. The answer was sitting in the context and the model still didn't extract it (#4), ignored the requested format (#5), was too vague or too specific (#6), or was simply incomplete (#7). Finding the truth and stating it are two different problems, and solving the first does not solve the second.

### Defenses — ground the model on purpose

The fixes are mechanical: instruct the model to answer *only* from the provided context, force it to attach a citation to every claim, and have it say "not in the documents" when nothing supports an answer. None is free, and none is perfect — which is exactly why the system needs measurement, below.

## Cross-cutting concerns: permissions, freshness, cost

Some problems don't live in one box. They run through the whole pipeline, and they're the difference between "studied the papers" and "shipped the system."

**Access control.** Retrieval must respect who is allowed to see what. A document retrieved correctly that the user shouldn't see is not an answer — it's a data leak. So permissions have to be enforced at query time, filtering candidates *before* they reach the model. This is hard because permissions live in the source systems, differ per user, and change constantly; the index has to mirror them and stay in sync. In an enterprise corpus this is often the single hardest part of the build, and it has nothing to do with model quality.

**Freshness.** Documents change. The index has to keep up — incremental re-indexing, capturing changes from the source systems, expiring what's been deleted. A stale index returns old answers with full confidence and no error. A knowledge base with no refresh loop rots silently: stale answers, drifting relevance, no alarm bell.

**Cost and latency.** Every stage you add — hybrid search, a reranker, query rewriting, context compression — costs money and time on every query. The latency budget is a design constraint, not an afterthought. Sometimes the right call is a smaller pipeline, not a bigger one. The most autonomous design is rarely the one that ships.

## Evaluation: you can't tell whether it works

Here's what quietly sinks most projects. You have no answer key. There's no ground truth telling you if the system is good, and every failure mode above produces a confident answer — so you can't eyeball it. Teams ship and hope. As Hamel Husain puts it, your AI product needs evals; a knowledge base is only as good as the evals around it.

The fix is unglamorous but mechanical. Build a **golden set**:

- 50–200 examples of (question → ideal answer → source passage).
- Write them by hand, or generate them from your own docs and review them.
- Deliberately include the hard cases — ambiguous questions, questions with *no* answer in the corpus, multi-step questions — or you'll only ever measure the easy path.

Then score the two halves of the pipeline separately, because a system can fetch the right chunk and still hallucinate, or miss the chunk and still sound confident. Measure retrieval first — a generation problem you can't trace back to retrieval is hard to fix:

- **Retrieval:** recall@k (did the right passage make the top-k?), precision@k, MRR.
- **Generation:** *faithfulness* (is every claim backed by a retrieved passage? — this is your hallucination detector) and *answer relevance*.

A few notes:

- Grade generation with an LLM-as-judge — a strong model scoring answers against their sources — but calibrate it against a small human-graded sample, because judges favor longer answers and their own style.
- Frameworks like RAGAS and DeepEval implement all of this off the shelf.
- Fifty examples beat zero. You're not chasing a perfect score — you're building a ruler, so changes stop being guesses.

## The frontier: agentic retrieval and knowledge graphs

The pipeline so far is *single-shot*: retrieve once, assemble, answer. The frontier relaxes that.

**Adaptive and agentic retrieval.** Instead of retrieving once, the model drives the loop: it judges whether what it retrieved is good enough, then rewrites the query, retries, or fetches more — and does this over several hops for questions a single search can't answer. Self-RAG (Asai et al., 2024) and CRAG (Yan et al., 2024) are early, concrete versions. Retrieval stops being a fixed first step and becomes a tool the model calls.

**Knowledge graphs.** Flat chunks can't answer "what are the themes across *everything*." For that you need structure. Microsoft's **GraphRAG** uses an LLM to extract a knowledge graph from your documents automatically, which unlocks those whole-corpus questions. The catch is brutal and worth stating plainly: graph indexing can cost 100–1000× more than vector indexing, and Microsoft's own guidance is to *start small*. Don't build a graph speculatively. Reach for it only when you actually hit questions that require connecting entities across documents.

## What good looks like: Glean and Perplexity

Not the best embedding model. The systems that work treat a knowledge base as a **pipeline plus structure plus a feedback loop**. Two of them, at opposite ends of the spectrum:

**Glean** searches a company's internal tools, and its bet is structure. Instead of a flat pile of chunks it builds a *knowledge graph* of entities and relationships — people, projects, customers, documents — so it can reason across connected things, not just match text. It maps every source into one schema, fine-tunes embeddings per customer, enforces each user's permissions, and learns continuously from feedback. (Glean reports its search quality improving around 20% over six months from that feedback loop alone.)

**Perplexity** answers over the live web, and its bet is the pipeline. Real-time retrieval on every query, multi-stage ranking (lexical + semantic → cross-encoder rerank → a final pass weighing authority and recency), and — the move that matters — it embeds citations into the prompt *before* the model writes, rather than bolting sources on afterward. That's how the answer stays tied to evidence.

Different worlds, same shape:

> **hybrid retrieval → rerank → grounded generation, on top of real structure, with measurement wrapped around the whole thing.**

## Summary

The search box is the easy 10%. The other 90% is a pipeline — ingestion, retrieval, assembly, generation — where every stage has a well-documented way to fail silently, plus cross-cutting concerns (permissions, freshness, cost) that no single stage owns, held together by structure and measurement rather than by a clever model.

That's the real reason building a knowledge base is hard: not because any single piece is exotic, but because all of them have to work at once — and you only find out they didn't if you bothered to measure.

Build a golden set with fifty examples. Add reranking to your retrieval. Label your chunks. Enforce permissions at query time. Then measure again, and repeat until the system is honest about what it doesn't know — that's when it starts being useful.

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

**The frontier**

- **Adaptive retrieval (Self-RAG)** — Asai et al., "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection," ICLR 2024. [arXiv:2310.11511](https://arxiv.org/abs/2310.11511)
- **Corrective retrieval (CRAG)** — Yan et al., "Corrective Retrieval Augmented Generation" (2024). [arXiv:2401.15884](https://arxiv.org/abs/2401.15884)
- **Knowledge graphs (GraphRAG)** — Microsoft Research, "GraphRAG" (2024). [github.com/microsoft/graphrag](https://github.com/microsoft/graphrag)

**Evaluation**

- **Your AI product needs evals** — Hamel Husain (2024). [hamel.dev/blog/posts/evals](https://hamel.dev/blog/posts/evals/)
- **RAG is more than embedding search / Systematically Improving Your RAG** — Jason Liu (2023–2024). [jxnl.co/writing](https://jxnl.co/writing/)
- **RAGAS** — Es et al., "RAGAS: Automated Evaluation of Retrieval Augmented Generation" (2023). [arXiv:2309.15217](https://arxiv.org/abs/2309.15217)
