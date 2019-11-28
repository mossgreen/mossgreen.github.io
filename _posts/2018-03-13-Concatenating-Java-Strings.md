---
title: Concatenating Java Strings
search: true
tags: 
  - Java
  - OCP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Behavior of String literals is very confusing.

## String is immutable

**What is immutable**  
An immutable object is one that will not change state after it is instantiated. 

**How to declare an immutable class**

- Declare class final
- Make the fields final and initialize them in the constructor
- Only getters no setters
- Ensure references types immutability,
  - like methods don't change contents; 
  - don't share references outside of the class
  - return **deep copy** of the object, so that original contents remain the same

**Advantages**:  
Thread safe, or say concurrency

**Drawbacks**:  
To ensure immutability, methods in immutable classes may end-up creating numerous copies of the objects.

## Two ways of declaring a String object

1. Create a String via constructor  
When we create a _String_ via a new constructor, JVM creates a new object and store it in **heap** separated with other strings.
  ```java
  String s1 = new String("a");
  ```
2. Crate it in string Pool, aka. interning  
Because String Object is immutable, JVM can store one copy of literal in the pool.  
When we create a String variable and assign a value to it, JVM firstly tries to find it in the string pool. If found, will return the reference. Otherwise, an object will be added to the pool and reference being returned.  ```java
  String s2 = "a";
  ```
3. Manual Intering  
If we create a _String_ object, however, we want it is stored in the string pool, we can manually interning.
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
- s1 is created on the heap as an object but not in the string pool
- s2 is created on the stack and added to string pool
- s3 is in the string pool

The `String#intern()` method places the string into the pool of strings (interns the string), and returns the reference to the interned version.

## StringBuilder vs. StringBuffer

Because _String_ is immutable, Java uses _StringBuilder_ and _StringBuffer_ to hold the mutable sequence of characters. E.g., 
```java
String immutable = "moss";
immutable + ", how are you";

Print(immutable); // "moss"
immutable = immutable + ", are you ok?";

Print(immutable); //moss, are you ok?
```

For short, _StringBuilder_ was introduced in Java 1.5 as a replacement for _StringBuffer_. I recommend using _StringBuilder_ all the time. However, their differences are:

1. _StringBuffer_ is synchronized and therefore thread-safe. _StringBuilder_ is compatible with _StringBuffer_ API but with no guarantee of synchronization.

2. Theoretically, _StringBuilder_ is faster. In small iterations, the performance difference is insignificant.


## String concatenation

To be clear, here is the result:

1. Declare a string, you can `"+"` as many as you want, as long as that string is a final or effectively final, it's the fastest way. Because when it compiled, there will be only one String object, in the string pool. E.g., 
    ```java
    String s1 = "a"+"b"+"c"+...+"ccc";
    ```

2. If you declare multiple strings and use "+" concatenating them together. No good! it creates the same amount of strings in the string pool.
    ```java
    String a = "a";
    String b = "b";
    String c = "c";
    String s2 = a + b + c; 
    ```

3. In above case, if you declare String variables as **final**, after compiling, s2 will be one string object in the string pool.  
  ```java
  final String a = "a";
  final String b = "b";
  final String c = "c";
  String s2 = a + b + c; 
  // in compiled file: s2 = "abc"
  ```
4. If you declare a StringBuilder, append a lot of times, `toString()` in the end, it's ok. Only one StringBuilder object is created, and a String object is in the string pool. 
    ```java
    StringBuilder sb = new StringBuilder();
    sb.append("a").append("c")....append("ccc");
    sb.toString();
    ```

5. If you need to concatenate strings in a loop, **don't use** `"+"`. It creates different string objects in each loop in the string pool.

6. If you concatenate strings in a loop, **use** StringBuilder. It creates only one StringBuilder object and one string object in the string pool.


**Demo1** Shall use `"+"` to concatenate plain strings, or say effectively final strings

in **.java** file
```java
String s1 = "a" + "b" + "c";

String s2 = new StringBuilder("a").append("b").append("c").toString();
```

in **.class** file
```java
String s1 = "abc";
String s2 = "a" + "b" + "c";
```
TODO: Research, what does "+" in JIT do? Will s1 and s2 behave differently in JIT code?

**Demo2** Performance testing without loop

```java
import java.util.Date;

public class Main {

    private final static Long many_times = 10000L;

    public static void main(String[] args)
    {
        String a = "a";
        String b = "b";
        String c = "c";

        long start = System.currentTimeMillis();
        for (int i = 0; i < many_times; i++) {
            String string = "a"+"b"+"c";
            if (string.equals("abc")) {}
        }
        System.out.println("String+ inline cost time:" + (System.currentTimeMillis() - start) + "ms");

         start = System.currentTimeMillis();
        for (int i = 0; i < many_times; i++) {
            String string = a + b + c;
            if (string.equals("abc")) {}
        }
        System.out.println("string+ assign cost time:" + (System.currentTimeMillis() - start) + "ms");


        start = System.currentTimeMillis();
        for (int i = 0; i < many_times; i++) {
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append(a);
            stringBuffer.append(b);
            stringBuffer.append(c);
            String string = stringBuffer.toString();
            if (string.equals("abc")) {}
        }
        System.out.println("stringbuffer cost time:" + (System.currentTimeMillis() - start) + "ms");
    }
}
```

Result:
```java
// in 10000 times
//String+ inline cost time:1ms
//string+ assign cost time:7ms
//stringbuffer cost time:6ms
```

**Demo3** Performance testing in loop

```java
import java.util.Date;
public class Main {
    private final static Long many_times = 10000L;
    private static String sbDemo()
    {
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<many_times;i++) {
            sb.append("*");
        }
        return sb.toString();
    }

    private static String sDemo()
    {
        String s = "";
        for(int i=0;i<many_times;i++){
            s+="*";
        }
        return s;
    }

    public static void main(String[] args) {
        long now = System.currentTimeMillis();
        sbDemo();
        System.out.println("sb elapsed " + (System.currentTimeMillis() - now) + " ms");

        now = System.currentTimeMillis();
        sDemo();
        System.out.println("s elapsed " + (System.currentTimeMillis() - now) + " ms");
    }
}
```

Result: 

```java
// in 10000 times
//sb elapsed 3 ms
//s elapsed 201 ms

```


## JDBC template sql statement concatenation

In my company, a database table could have as many as 100 fields. When we create a row from API, we need to specify, like, 100 fields one by one. 
```java
String sql = "INSERT INTO table_name (col_01 " +  
" ,col_02 " +  
" ,col_03 " +  
" ,....,col_99 )" +  
" VALUES(?, ?,?,?)";
```

In this case, we should use String "+" concatenation. However, if we need to do logic in a loop, then we shall use StringBuilder.


## References

1. [Oracle Java Documentation](https://docs.oracle.com/javase/tutorial/java/data/strings.html)
2. [Guide to Java String Pool](http://www.baeldung.com/java-string-pool)
3. [StringBuilder and StringBuffer in Java](http://www.baeldung.com/java-string-builder-string-buffer)



