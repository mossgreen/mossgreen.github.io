---
title: Prototyping AI with Gradio
tags:
  - AI
  - gradio
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Build AI interfaces fast. Gradio turns Python functions into shareable web apps.

## First Demo

```python
import gradio as gr

def greet(name, intentsity):
    return "Hello, " + name + " !"*int(intentsity)

demo = gr.Interface(
    fn = greet,
    inputs = ["text", "slider"],
    outputs = ["text"],
)

url, _ = demo.launch(share=True)
print(f"App running at: {url}")
```

## Understanding the Interface Class
The Interface class has three core arguments:

- `fn`: the function to wrap a user interface (UI) around
- `inputs`: the Gradio component(s) to use for the input. The number of components should match the number of arguments in your function.
- `outputs`: the Gradio component(s) to use for the output. The number of components should match the number of return values from your function.

### gr

### Custom Demos with gr.Blocks
- a low-level approach for designing web apps with more customizable layouts and data flows
- For example, the popular image generation [Automatic1111 Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)


### Chatbots with gr.ChatInterface
specifically designed to create Chatbot UIs

## References
- [Agentic AI Explained: Workflows vs Agents](https://orkes.io/blog/agentic-ai-explained-agents-vs-workflows/)
