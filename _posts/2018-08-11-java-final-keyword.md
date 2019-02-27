---
title: Opinionated Final Variables in Java
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
I use final whenever it is appropriate. 

## Static final variables has two chances to initialize  
1. On declaration
2. In static initializer block
    ```java
    static final Long MY_ID = 111L;
    static final Long YOUR_ID;
    static {
        YOUR_ID = 222L;
    }
    ```

## Non-static final variables has three chagnes to initialize
1. On declaration
2. In initializer block
3. In the constructor

    **Note**: any final field must be initialized before the constructor completes.
    ```java
    final Long MY_ID = 111L;
    final Long YOUR_ID;
    final Long ANOTHER_ID;
    
    {
        ANOTHER_ID = 333L; // this block has to be upper than constructor
    }
    
    MyClass() {
        YOUR_ID = 222L;
    }
    ```

## Final Primitive Type is real final

If you try to reassign a value to an initialized final primitive variable, you will get this:

> Error: java: cannot assign a value to final variable i

## Final Reference Type has only the reference final

`final` is only about the reference itself, and not about the contents of the referenced object.

```java
void withCat (final Cat cat) {
    cat.setId(2);
}

public static void main(String[] args) {
    final Cat cat = new Cat();
    cat.setId(1);
}
```



## Other question

1. Improve performance?  
Not always, not really.

2. Why use `final`?  
Should use final based on clear design and readability.



## References

- [Why would one mark local variables and method parameters as “final” in Java?](https://stackoverflow.com/questions/316352/why-would-one-mark-local-variables-and-method-parameters-as-final-in-java)

- [The “final” Keyword in Java](https://www.baeldung.com/java-final)