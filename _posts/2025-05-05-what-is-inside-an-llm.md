---
description: "A downloaded LLM file contains exactly two things: weights (billions of learned numbers, ~99.9% of the bytes) and metadata (a small header that says how to read them). Every byte was fixed at one of three moments — before, during, or after training. Using Qwen3-30B-A3B 8-bit as the walkthrough."
title: "What Is Inside an LLM File?"
tags:
- ai
- llm
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

I downloaded Qwen3-30B-A3B, 8-bit — released a week ago, at the end of April 2025. One file, about 32 GB. What exactly is in it?

Two things, and only two: **weights** and **metadata**. Everything in the file is one or the other.

**TL;DR**

- **Weights** are ~99.9% of the bytes: 30.5 billion learned numbers.
- **Metadata** is the rest: a small header that says how to read the numbers.
- **Nothing else.** No code, no text, no stored facts.
- **Every byte was fixed at one of three moments** — before, during, or after training.

```text
model file
├── weights (the numbers)                 ← learned · during training
│   ├── embedding table
│   ├── transformer layers × 48
│   │   ├── attention weights
│   │   └── expert weights (128 experts, 8 active)
│   └── output head
└── metadata (how to read the numbers)
    ├── architecture config               ← chosen by engineers · before training
    ├── tokenizer                         ← computed from text · before training
    └── quantization info                 ← computed from weights · after training
```

## 1. Weights — the numbers

A weight is one learned number. Training set its value; inference only reads it. The file groups the weights into three parts, in the order a token passes through them.

### 1.1 Embedding table

A lookup table with about 151,000 rows, one per vocabulary entry. It turns each token into a vector — the form the rest of the model computes on.

### 1.2 Transformer layers

48 identical layers, each holding two kinds of weights:

- **Attention weights** — matrices that let each token use information from the tokens before it.
- **Expert weights** — each layer holds 128 small networks called experts; a small router picks 8 per token. That is the name: 30B parameters stored, ~3B **a**ctive per token.

### 1.3 Output head

The reverse of the embedding table: it turns the final vector into a score for every vocabulary entry. The highest-scoring entry becomes the next token.

## 2. Metadata — how to read the numbers

| Part | Question it answers |
|---|---|
| Architecture config | What shape? — 48 layers, dimensions, expert counts |
| Tokenizer | How does text become token IDs, and back? |
| Quantization info | How do the stored 8-bit integers decode to real values? |

**Quantization** is why the file says "8-bit": each original 16-bit weight was rounded to fit in 8 bits — half the size, slightly less precision. The metadata stores the scale factors used to decode them.

## 3. One prediction, step by step

Give the model the text "The sky is" and ask for the next token. Every part of the file is used once, in order. (Real vectors here have 2048 numbers; the ones below are shortened to 4, and all values are made up for the example.)

**Step 1 — Tokenizer (metadata).** The text is split into tokens, and each token becomes an ID from the vocabulary: "The" → 785, " sky" → 12884, " is" → 374. This is a dictionary lookup; no weights are used yet.

**Step 2 — Embedding table (weights).** Each ID selects one row of the table. Row 12884 might be `[0.11, -0.62, 0.40, 0.05]`. The model now holds three vectors, one per token.

**Step 3 — Attention (weights).** The attention matrices compute, for the last position, how relevant each earlier token is:

```text
"The" → 0.05    " sky" → 0.80    " is" → 0.15
```

The last vector is replaced by a weighted average of all three, dominated by " sky". This is how the next-word prediction comes to depend on *sky* rather than on *is* alone.

**Step 4 — Router and experts (weights).** The router multiplies the vector by its own small matrix and gets one score per expert. The 8 highest-scoring experts (of 128) each transform the vector; the other 120 stay on disk, unused for this token.

Steps 3 and 4 repeat through all 48 layers.

**Step 5 — Output head (weights).** The final vector is multiplied against the output head, giving one score per vocabulary entry — about 151,000 scores:

| Token | Score |
|---|---|
| " blue" | 14.2 |
| " clear" | 11.9 |
| " falling" | 7.3 |
| " purple" | 5.1 |

**Step 6 — Tokenizer again (metadata).** The highest-scoring ID is converted back to text: " blue". Append it to the input and run all six steps again for the word after that.

Note what did *not* happen: the model never looked up the fact "the sky is blue" — no such sentence is stored. The score 14.2 exists because, in the training text, tokens like " blue" followed contexts like this one more often than others, and training adjusted the weights to reproduce that.

## 4. Where each part came from

| Part | When fixed | Decided by |
|---|---|---|
| Architecture config | Before training | Engineers |
| Tokenizer | Before training | An algorithm run on sample text |
| Weights | During training | Gradient descent |
| Quantization info | After training | Arithmetic on the finished weights |

**Before training.** Engineers chose the architecture — 48 layers, the vector width, 128 experts — within a compute budget, using small trial runs to predict how a large model would perform. The tradeoff is visible across the Qwen3 family: the 4B model has 36 layers, this one has 48, the 235B flagship has 94. A bigger budget buys more depth, but not proportionally — most of it goes into wider vectors and more experts instead, because layers run one after another, so every extra layer slows down each token, while extra width runs in parallel and does not. The tokenizer was built by an algorithm (byte-pair encoding): scan a large text sample, merge the most frequent pair of symbols into one token, repeat about 151,000 times. Common words end up as single tokens; rare words stay as fragments.

**During training.** All 30.5 billion weights start as random numbers. The model reads trillions of tokens — about 36 trillion, for Qwen3 — and, at each position, predicts the next one. After each wrong prediction, every weight is adjusted by a tiny amount in the direction that reduces the error. Billions of repetitions produce the final values. No person sets any weight. The training text itself — web pages, books, code, selected and mixed by the builders — is not stored; only the numbers it produced.

**After training.** A compression pass measured the range of each block of 16-bit weights and computed the scale factor that maps it to 8-bit integers. Nothing new is decided here; precision is traded for file size.

## 5. What is *not* inside

- **No code.** The file cannot run itself. A separate program (llama.cpp, Ollama, LM Studio) reads the metadata, loads the weights, and does the arithmetic.
- **No text.** There is no copy of the training data, no facts stored as sentences, nothing you can search. What the model "knows" exists only as the values of the 30 billion numbers.

So the one-line answer:

```text
An LLM file is a large array of learned numbers,
plus a small note that explains how to read them.
```
