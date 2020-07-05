---
title: Java Block IO Concepts
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Explain Java IOs to a beginner.

## Questions

- What is IO
- Where does it happen? Memory
- Understand the direction, InputStream vs OutputStream
- Why `InputStream`, what is a stream?
- Why Byte Stream is the most basic stream?
- Byte Stream is inefficient, why? BufferedInputStream vs. BufferedOutputSteam，
- Target of IO: binery files, or text file?
  - for text files: byte -> characters: InputStreamReader vs. OutputStreamWriter
  - binery: stream
- Target of IO: file system: FileReader vs. FileWriter (human can read and write, this is for human to manipulate the file system)
  - InputStreamReader vs OutputStreamWriter: byte stream to human readable/writable.
  - Reader and writer class represents all human read/writeable streams
  - efficient way to do this: BufferedReader vs. BufferedWriter

## References

- [Zhihu: why java IO looked so complicated](https://www.zhihu.com/question/67535292/answer/1248887503)
- [Java IO – Conversions](https://www.baeldung.com/java-io-conversions)

Last modified: July 2020
