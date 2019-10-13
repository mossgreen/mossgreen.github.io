---
title: Refactoring Legacy Code using Golden Master 
search: true
tags: 
  - Legacy
  - Unit testing
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

How to deal with the code that you're afraid to touch? 

#  Legacy Code

## Legacy Code Definition

I've got some ideas from: 

1. Book ["Working Effectively with Legacy Code"](https://www.amazon.com/dp/0131177052/)

    > The main thing that distinguishes legacy code from non-legacy code is tests, or rather a lack of tests. We can get a sense of this with a little thought experiment: how easy would it be to modify your code base if it could bite back, if it could tell you when you made a mistake? It would be pretty easy, wouldn't it? Most of the fear involved in making changes to large code bases is fear of introducing subtle bugs; fear of changing things inadvertently. With tests, you can make things better with impunity. To me, the difference is so critical, it overwhelms any other distinction. With tests, you can make things better. Without them, you just don’t know whether things are getting better or worse. -- Michael Feathers

2. Stackoverflow thread:  [Legacy Code](https://stackoverflow.com/questions/4174867/what-is-the-definition-of-legacy-code)

    > code that gets inherited by a team or a programmer from somewhere else.

3. Wikipedia item [Legacy Code](http://https://en.wikipedia.org/wiki/Legacy_code)

    > source code inherited from someone else and source code inherited from an older version of the software

Digging deep, I've learnt pioneers' core concerns. Rather than talking about the liternal meaning, I prefer to say "**Code that develpers are afraid to change.**"

What a coincidence, when I read "[Defining Legacy Code](Defining%20Legacy%20Code%0Ahttps://dzone.com/articles/defining-legacy-code)", and "[Surviving Legacy Code with Golden Master and Sampling](https://blog.thecodewhisperer.com/permalink/surviving-legacy-code-with-golden-master-and-sampling)" the authers hold the same opinion. :)

### What makes code legacy code

We afraid to change may due to serveral reasons
- APIs are out-of-date
- Platform are not supported anymore
- Bad designed code
- No documentation
- It's buggy, and without test


## What should we do: Golden Master

Before starting to change any legacy system you need to know you will not introduce any defects when changing the code. Gold Master Testing is a technique for evaluating complex legacy systems.

### The real gold master

![IMAGE](quiver-image-url/49715A29707A3290D5B446760D603BB2.jpg =440x438)

In audio mastering, a [golden master](https://en.wikipedia.org/wiki/Mastering_(audio)) is a model disk used as a reference to create disks in the old vinyl industry. This disk was cut in metal and it would contain the sound transferred from a microphone. In the software world we took this name and we started using it for a fixed reference of a system output, paired with a system input.

### Golden Master technique steps

In Adrian Bolboaca's [Legacy Coderetreat serials](https://blog.adrianbolboaca.ro/2014/04/legacy-coderetreat/), he lists the following steps:

1. Find the way the system delivers its outputs  
    Check for clear outputs of the system: console, data layer, logger, file system, etc.

2. Find a way to capture the output of the system without changing the production code
    Example: Introduce an interface and use another implementation.

3. Find a pattern of the outputs
    The output of the system could be text or a data structures tree or another type of stream. Starting from this output type you can decide if you could go on to the next step.

4. Generate enough random inputs and persist the tuple input/output

5. Write a system test to check the SUT against the previously persisted data

6. Commit the test

7. Check test behaviour and coverage
    - Use a test coverage tool to see where the system tests touch the SUT
    - Start changing the SUT in order to see the golden master test go red.

8. If not enough behaviours are covered, go to 3


## Principles while dealing with legacy code

- Maximize safety
- Mininum change

## Think positive

**Andrew Smith** comments on the positive side of refactoring legacy code.

1. It improves your ability to refactor code
2. It improves your ability to learn about a codebase, and how it's grown over time
3. It improves your ability to interpret codebases you've not working on before
4. If a codebase that you were involved in then it allows you to realise how far YOU'VE come too!
5. It feels rewarding to "modernise" code!


## My practice

//todo

## Reference

1. [Surviving Legacy Code with Golden Master and Sampling](https://blog.thecodewhisperer.com/permalink/surviving-legacy-code-with-golden-master-and-sampling)
2. [Legacy Coderetreat: Part 3 – Golden Master](https://blog.adrianbolboaca.ro/2014/05/golden-master/)
3. [Working Effectively with Legacy Code](https://www.amazon.com/dp/0131177052/)