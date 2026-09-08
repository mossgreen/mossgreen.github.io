---
description: "OpenAI and Anthropic use the same word for two architectures. OpenAI puts the agent loop in your application. Anthropic puts it in a subprocess. Their SDKs reveal why."
title: "Two Definitions of an Agent"
tags:
- ai
- llm
- agents
- sdk
- software engineering
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

**Anthropic and OpenAI have different answers to how you build an agent.**

**TL;DR**

- **OpenAI runs the loop inside your program**, using your API key and calling functions you write.
- **Anthropic runs it in another program.** Its package has no HTTP client and no loop. It starts the `claude` executable and talks over a pipe.


## 1. The parts of an agent program

An **agent program** repeats three steps: a language model chooses an action, the system carries it out, and the result returns to the model.

To do that, its runtime must handle five things: the **loop**, **model calls**, **tool execution**, **context**, and **limits**. An SDK can implement them or start a program that does.

The main question is where the loop runs: inside your program, or inside a program it starts?

## 2. The OpenAI Agents SDK: the loop runs in your program

The Python package contains a plain `while True:` loop. It calls the model from your process through an `AsyncOpenAI` client, using your key. Tools are functions you write:

```python
@function_tool
async def check_url(url: str) -> str:
    """Fetch a URL; return the status code."""
    ...

agent = Agent(name="link-auditor", tools=[check_url], model="gpt-5.1")
result = await Runner.run(agent, input=task)
```

The SDK calls `check_url` in your process, so you can set a breakpoint anywhere. The API exposes program parts: `Agent`, `Handoff`, `ModelProvider`. Even its errors name failures in the program: `MaxTurnsExceeded`, `ToolTimeoutError`.

OpenAI states its principle plainly: use "built-in language features to orchestrate and chain agents, rather than needing to learn new abstractions."

Here, an agent is Python you write around a loop the SDK supplies.

## 3. The Claude Agent SDK: the loop runs in another program

`claude-agent-sdk` contains one-tenth as much Python as OpenAI's package. The difference is deliberate: no HTTP client, no reference to `api.anthropic.com`, no agent loop.

Instead, it starts a subprocess. It turns your options into command-line flags, then exchanges JSON over stdin and stdout. Recent versions bundle the `claude` executable, so 1 MB of Python becomes a 231 MB install. That subprocess is the agent, and it connects to Anthropic itself.

```python
options = ClaudeAgentOptions(
    tools=["Read", "Bash", "WebFetch", "Write"],
    permission_mode="acceptEdits",
    cwd=str(project_dir),
)
async for message in query(prompt=task, options=options):
    ...
```

You do not write the built-in `Read` or `Bash`; they live on the far side of the pipe. Options such as `cwd`, `env`, and `sandbox` set the conditions under which the process runs. The errors are `CLINotFoundError` and `ProcessError`.

Anthropic's stated principle is to give agents "a computer, allowing them to work like humans do." That is what the tools above provide.

Here, an agent is a process with a machine at its disposal.

## 4. Why they diverged

The difference follows from their history. OpenAI's SDK descends from **Swarm**, a 2024 "educational framework" for multi-agent orchestration. It kept Swarm's vocabulary of agents and handoffs. Anthropic's SDK descends from **Claude Code**, which shipped first as a product. When Anthropic renamed the SDK in 2025, it said the same machinery "can power many other types of agents, too."

One began as a framework embedded in a program. The other began as a program. Their SDKs preserve those origins.

## 5. Where each part lives

| | OpenAI Agents SDK | Claude Agent SDK |
|---|---|---|
| Agent loop | Your process | A process yours starts |
| Model calls | Your process, with your key | The subprocess, with credentials you supply |
| Tools | Your process, or OpenAI's servers | The subprocess, plus tools you register |
| Context | Objects in your process | The subprocess |
| Limits | Runner options and code | Process options |
| Installed size | 9 MB | 231 MB, platform-specific |
| What you can inspect | Every line of the loop | The messages crossing the pipe |

Neither side is pure. The Claude SDK can run Python tools you register, and OpenAI offers hosted tools that run on its servers. Tools cross the boundary in both directions; the loop does not.

## 6. What you gain and give up

With OpenAI, each local tool is code in your repository. You can inspect, test, and restrict every action, but you must build the actions you need. Anthropic supplies file, shell, and web tools at once, but their implementations sit across a process boundary, outside your repository.

The boundary also affects the choice of backend. OpenAI exposes `ModelProvider`, which you can replace. Inside the `claude` executable, you name the model but not the provider.

If the agent is part of an application, OpenAI keeps it in your code. If its job is to operate a computer, Anthropic supplies the process and tools. The same word names two things:

```text
OpenAI:    an agent is a program you compose.
Anthropic: an agent is a program you configure.
```

## References

- Anthropic, ["Building agents with the Claude Agent SDK"](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) — the rename, and the "Giving Claude a computer" principle
- [OpenAI Agents SDK documentation](https://openai.github.io/openai-agents-python/) — the design principles quoted above
- [Swarm](https://github.com/openai/swarm) — the experimental predecessor

Read against `openai-agents==0.18.2` and `claude-agent-sdk==0.2.116`.
