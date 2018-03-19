---
title: Prepare for OCAJP, (4)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Methods and Encapsulation.  

## Methods

1. Optional Specifiers

    ```java
    void public walk3() {} // DOES NOT COMPILE, should be public void
    
    public final void walk(){}
    
    //static final
    public static final void walk(){}
    public final static void walk(){}
    
    default void walk2() {} // DOES NOT COMPILE, default is not a valid access modifier
    public modifier void walk(){} // DOES NOT COMPILE, modifier is not a valid optional modifier
    public void final walk() {} // DOES NOT COMPILE, should be final void
    
    //final public
    final public vid walk(){}
    ```
2. Varargs
  - Varargs is a little different than an array.
  - A vararg parameter **must be the last element** in a method’s parameter list.
  - **Only one** vararg parameter per method is allowed.

    ```java
    public void walk3(int... nums, int start) { } // DOES NOT COMPILE, varargs goes last
    public void walk4(int... start, int... nums) { } // DOES NOT COMPILE, cannot have two varargs
    ```

3. Access
  - Default (Package Private): private and other classes in the same package.
  - The protected access modifier: adds the ability to access members of a parent class.
  
  
## Static vs. Instance
- A static method or instance method can call a static method because static methods don’t require an object to use
- Only an instance method can call another instance method
- In static method, cannot call an instanc method
- All uppercase letters with underscores between constant words
- Using static variables to count the number of instances:
  ```java
  public class Counter {
    private static int count; 
    public Counter() { count++; }
    
    public static void main(String[] args) { 
      Counter c1 = new Counter(); 
      Counter c2 = new Counter(); 
      Counter c3 = new Counter(); 
      System.out.println(count); // 3 
    }
  }
  ```
- Static Imports  
  - Regular imports are for importing classes.   
  - Static imports are for importing static members of classes.

    ```java
    
    import static statics.A.TYPE; 
    import static statics.B.TYPE; // DOES NOT COMPILE, duplicated name
    
    import static java.util.Arrays; // DOES NOT COMPILE, cannot import class
    
    import static java.util.Arrays.asList;  // static import
    static import java.util.Arrays.*; // DOES NOT COMPILE, key words: import statuc
    
    public class BadStaticImports { 
      public static void main(String[] args) { 
        Arrays.asList("one"); // DOES NOT COMPILE 
     }
    }
    ```

    It's okay to be `asList("one")`, but **not** `Arrays.asList("one")`.   
    Reason is that we didn't import `Arrays` class.
    {: .notice--danger}


## Methods

1. Overloading and Varargs  
    Java treats `varargs` as if they were an `array`. This means that the method signature is the same for both methods.
  ```java
  public void fly(int[] lengths) { } 
  public void fly(int... lengths) { } // DOES NOT COMPILE, cannot overload
  ```
2. Constructors
  - Java-created constructor is called **the default constructor**. This happens during the compile step.
  - **private constructor** prevents default constructors being generated and other classes from instantiating the class
  - private constructor is useful when a class only has static methods or the class wants to control all calls to create new instances of itself.
  - Constructors can be called only by writing new before the name of the constructor
  - `this()` call must be the first noncommented statement in the constructor.
    ```java
    public Hamster(int weight) { 
      System.out.println("in constructor");// ready to call this 
      this(weight, "brown"); // DOES NOT COMPILE, because it's after print
    }
    ```
    
3. Orders of Initialization
    1. superclass
    2. Static variable declarations and static initializers in the order they appear in the file.
    3. Instance variable declarations and instance initializers in the order they appear in the file.
    4. The constructor.

4. JavaBeans naming conventions

    ```java
    //Properties are private
    private int numEggs;
    
    //Getter methods begin with is if the property is a boolean
    public boolean isHappy() { return happy; }
    
    //Getter methods begin with get if the property is not a boolean
    public int getNumEggs() { return numEggs; }
    
    //Setter methods begin with set
    public void setHappy(boolean happy) { this.happy = happy; }
    
    //rule for property name
    public void setNumEggs(int num) { numEggs = num; }
    ```

5. Creating Immutable Classes
  - Immutable classes are helpful because you know they will always be the same.
  - It also helps with performance by limiting the number of copies

## Predicates
- Lambdas work with interfaces that have only one method, called **functional interfaces—interfaces**
- ArrayList declares a removeIf() method that takes a Predicate