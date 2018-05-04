---
title: Java Constructors 101
search: true
tags: 
  - JAVA
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

> The method that constructs your object.

## Basic concepts

- **Does not** have a return type, not even void
- The name has to be the exact same as **class name**

Here is the basic format of a constructor
```java
public ClassName (parameter_list) [throws exception] {
  //code goes here
}
```
## Rules
1. Constructor chaining is always happening
2. `this([args])` chains inside of classes
3. `super([args])` chains to the parent class
4. `this([args])` and `super([args])` cannot co-exist
5. All constructors that don't have a `this([args])` will have a `super([args])`

## Default constructor

If you don't specify a constructor, the compiler will give you one.

E.g., your code
```java
public class Person {}
```

Code in compiler
```java
public class Person {
   Person() {
     /*super; *///will talk about it later
   }
}
```

##  No-arg constructor

You specify a constructor, without args. 

E.g., your code
```java
public class Person {
   Person() { }
}
```

It's compiled to the same code as the default constructor

## Signature differences

- **Allowed modifiers**:  
  public, protected, private, or none (package default)  

- **Not allowed modifiers**:  
  abstract, final, native, static, or synchronized.

If a class only has static methods, you may want its constructor to be `private`, in order to make it cannot create a new instance.

##  Constructors with parameters

If you want your object being constructed with some values, you could initialize it in a constructor.

E.g., you have a **Person** class, want to initialize it with **name** 
```java
public class Person {

    private String name;

    public Person(String name) {
        this.name = name;
    }
}
```

Note that, if you specify a constructor, compiler hence won't create a default one for you.   

Following code doesn't compile because a no-arg constructor is needed.

```java
class Person {

   public String name;

   public Person(String name) {
       this.name = name;
   }

   public static void main(String[] args) {
       Person p = new Person();  // Cannot apply
   }
}
```

## this(): chaining constructors

`this` enables constructors chaining inside one class.

E.g., if you want to have three constructors, one doesn't have any parameter, one takes in `name`, one takes in `name` and `age`.

```java
public class Person {

    public String name;
    public Integer age;

    public Person() { }

    public Person(String name) {
        this.name = name;
    }

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
}
```

If you want your person's name is **Moss** by default, you can do

```java
public Person() {
    this("Moss");
}
```
Then, objects will have a default name "Moss".
```java
public static void main(String[] args) {
    Person p = new Person(); // p.name is "Moss"
}
```

So, what if a requirement is that **name** by default is **Moss**, **age** is **18**. Unless you specify a **name** or **age**. Note the usage of `this()`

```java
public class Person {

    public String name;
    public Integer age;

    public Person() {     
      this("Moss");       // call the constructor below
    }

    public Person(String name) {
        this("Moss",18);  // call the constructor below
    }

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
}
```

**Task: find an error here**

```java
public Person(String name) {
    this(18);
    this.name = name;
}

public Person(Integer age) {
    this("Moss");
    this.age = age;
}

//answer: compile fails, recursive constructor invocation
```

Rules:

1. `this()` is an explicit constructor invocation
2. `this()` always be the first line
3. At least one constructor couldn't have `this()`, becasue at least one constructer needs to call parent class's constructer
4. Constructors' order doesn't matter

## super(): find your parent

The compiler inserts a `super();` statement at the beginning of child class constructor. Just like  `this([args])`, it's also part of **constructor chaining**. 

When you create an object, if it doesn't have a parent class, then an implicit `super();` points to the `Object class`. If it does have a parent class, `super([args]);` points to the corresponding constructors.

See following example, **Student** class extends **Person** class. `Person` class has an implicit constructor. **Student** class has a no-arg constructor, in which exists an implicit `super();`, will call the default constructor in **Person**.

```java
class Person {
    public Integer age;
    //default constructor, inserted by the compiler
}

public class Student {

    public String name;

    public Student() {
        //  super(); inserted by compiler
    }
}
```

However, if we give **Person** a parameterized constructor, following code won't compile. Because parent class lost its default no-arg constructor. When subclass call `super()`, there is no such constructor in the parent class. SAD!

```java
class Person {
    public Integer age;

    public Person(Integer age) {
        this.age = age;
    }
}

public class Student extends  Person{

    public String name;

    public Student() {
          super();  //call non-arg constructor in parent class
    }
}
```

In order to make above code compile, you can either 
a. add a default constructor in parent
b. pass in property parameter in `super([parameter]);` of subclass.

Rules
1. `super();` always be the first line of a constructor
2. `super()` and `this()` cannot co-exist
3. If parent class doesn't have a no-arg constructor, you cannot call no-arg `super()`




