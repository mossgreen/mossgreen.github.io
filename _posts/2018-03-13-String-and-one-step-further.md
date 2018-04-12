---
title: String, and one step further
search: true
tags: 
  - HTML
  - FORM
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
String sometimes blow people's mind

TODOS
---
1. Immutable class
2. Declare String
3. String Builder vs. String Builder
4. JVM
5. Spring JDBC Template


## String is immuatable

### What is immuatable
An immutable object is one that will not change state after it is instantiated. 

### How to declare a immutable class
- Declare class final
- Make the fields final and initialize them in the constructor
- Only getters no setters
- Ensure references types immutability,
  - like methods don't change contents; 
  - don't share references outside of the class
  - return **deep copy** of the object, so taht original contents remain the same

### Advantages:
- Thread safe, or say concurrency

### Drawbacks

- To ensure immutability, methods in immutable classes may end-up creating numerous copies of the objects.

### Simple Demo

```java
public final class Immutable
{
    private final String name;

    public Immutable(String name) 
    {
        this.name = name;
    }

    public String getName() { return this.name; } 

    // No setter;
}
```

