---
title: Opinionated Final Variables in Java
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
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
        // this block has to be upper than constructor
        ANOTHER_ID = 333L; 
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

## Question and Answer

1. Improved performance?  
Not always, not really.

2. Why use `final`?  
Should use final based on clear design and readability.

3. When must use?
You have to mark something final so you can access it from within an anonymous inner class.

4. Benefits
> At first, it kind of looks awkward to see a lot of final keywords in your code, but pretty soon you'll stop noticing the word itself and will simply think, that-thing-will-never-change-from-this-point-on.



## References

1. [Why would one mark local variables and method parameters as “final” in Java?](https://stackoverflow.com/questions/316352/why-would-one-mark-local-variables-and-method-parameters-as-final-in-java)
2. [The “final” Keyword in Java](https://www.baeldung.com/java-final)
3. [Using the “final” modifier whenever applicable in Java](https://stackoverflow.com/questions/137868/using-the-final-modifier-whenever-applicable-in-java)
3. [When should one use final for method parameters and local variables](https://stackoverflow.com/questions/154314/when-should-one-use-final-for-method-parameters-and-local-variables)
