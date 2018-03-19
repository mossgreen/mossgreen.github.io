---
title: Prepare for OCAJP, (6)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Exceptions.

## Common Exception Types

1. Runtime Exceptions  
  They don’t have to be handled or declared. They can be thrown by the programmer or by the JVM Common runtime exceptions include the following:
    - ArithmeticException, when devide by zero
    - ArrayIndexOutOfBoundsException
    - ClassCastException
    - IllegalArgumentException, when an illegal or inappropriate argument
    - NullPointerException
    - NumberFormatException

2. Checked Exceptions  
  Checked exceptions have Exception in their hierarchy but not RuntimeException. They must be handled or declared.
    - FileNotFoundException
    - IOException
    
3. Errors  
  Errors extend the Error class. They are thrown by the JVM and **should not** be handled or declared.
  - ExceptionInInitializerError, when static initializer fails
  - StackOverflowError
  - NoClassDefFoundError