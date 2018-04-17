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

**What is immuatable**
An immutable object is one that will not change state after it is instantiated. 

**How to declare a immutable class**
- Declare class final
- Make the fields final and initialize them in the constructor
- Only getters no setters
- Ensure references types immutability,
  - like methods don't change contents; 
  - don't share references outside of the class
  - return **deep copy** of the object, so taht original contents remain the same

**Advantages**: Thread safe, or say concurrency

**Drawbacks**: To ensure immutability, methods in immutable classes may end-up creating numerous copies of the objects.

## Two ways of declaring String object

1. Create a String via constructor  
When we crate a _String_ via new constructor, JVM creates a new object and sotre it in **heap** seperated with other strings.

```java
String s1 = new String("a");
```
2. Crate it in string Pool, aka. interning  
  
Because String Object is immutable, JVM can store one copy of literal in pool.  
When we create a String variable and assign a value to it, JVM firstly try to find it in string pool. If found, will return the reference. Otherwise, an object will be added to the pool and reference being returned.

```java
String s2 = "a";
```

3. Manual Intering  
If we crate a _String_ object, however we want it being stored in string pool, we can manually interning.

```java
String inPool = new String("Moss will in pool").intern();
```

**Demo**

```java
String s1 = new String("a");
String s2 = "a";
String s3 = s1.intern();

assetTrue(s1 == s2);
assetTrue(s2 == s3);
```
- s1 is created on heap as an object but not in string pool
- s2 is created on stack and added to string pool
- s3 is in string pool

The `String#intern()` method places the string into the pool of strings (interns the string), and returns the reference to the interned version.

## StringBuilder vs. StringBuffer

Because _String_ is immutable, Java uses String Builder and String Buffer to hold mutable sequence of charactors. E.g., 

```java
String immutable = "moss";
immutable + ", how are you";

Print(immutable); // "moss"
immutable = immutable + ", are you ok?";

Print(immutable); //moss, are you ok?
```

For short, StringBuilder was introduced in Java 1.5 as a replacement for StringBuffer. I recommand to use StringBuilder all the time. However their differences are:

1. StringBuffer is synchronized and therefore thread-safe. StringBuilder is compatible with StringBuffer API but with no guarantee of synchronization.

2. Theoritically, StringBuilder is faster. In small iterations, the performance difference is insignificant.





## JDBC template sql statement concatenation

In my company, a database table could have as many as 100 fileds. When we create a row from API, we need to specify, like, 100 fileds one by one. 

```java
String sql = "INSERT INTO table_name (col_01 " +  
" ,col_02 " +  
" ,col_03 " +  
" ,....,col_99 )" +  
" VALUES(?, ?,?,?)";
```

In this case, we should not use StringBuilder.


