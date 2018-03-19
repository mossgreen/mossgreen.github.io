---
title: Prepare for OCAJP, (5)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Design classes.

## Class Inheritance

1. Extending a class using keyword `extends`
2. Private variable in parent class
    1. Subclass cannot access parent class's private 
    2. If we have an instance of a subclass, that private variable from parent class exists
3. Class Access Modifiers
    - `public` can be referenced and used in **any class**
    - `default package private` by **subclass** or **class within same package**.
4. Java Objects  
    if you look at the inheritance structure of any class, it will always end with java.lang.Object on the top of the tree
5. Compiler Enhancements Constructor  
    - compiler inserts a no-argument constructor `super()`if the first statement is not a call to parent constructor.
      ```java
      //following definitions are equivalent
      
      public class Moss {                           }
      public class Moss { public Moss(){          } }
      public class Moss { public Moss(){ super(); } }
      ```
    - if parent class doesn't have a no-argument constructor, you **must** create one constructor in clild class, explicitly call a parent constructor via the `super()`
      ```java
      public class Mammal { public Mammal(int age) { } }
      
      public class Elephant extends Mammal { 
        public Elephant() {  }// DOES NOT COMPILE   
      }
      
      public class Elephant extends Mammal {
        public Elephant() { super(10); } //WILL COMPILE, an explicit call to a parent constructor.
      }
      ```
6. **Constructor Deﬁnition Rules**
    - First statement of every constructor is a call to another constructor. Within the class using `this()`, or to parent using `super()`.
    - The super() call may not be used after the first statement of the constructor.
    - If no `super()` exists, compiler will insert one at the beginning of constructor.
    - If the parent doesn’t have a no-argument constructor and the child doesn’t define any constructors, the compiler will **throw an error**
    - If the parent doesn’t have a no-argument constructor, the compiler requires an explicit call to a parent constructor **in each child constructor**.
    
    ```java
    class Primate { public Primate() { System.out.println("Primate"); } }
    class Ape extends Primate { public Ape() { System.out.println("Ape"); } }
    public class Chimpanzee extends Ape { public static void main(String[] args) { new Chimpanzee(); } }
    
    //Primate Ape
    ```
7. Calling Inherited Class Members
   - If the parent class and child class are part of the **same package**, the child class may also use any **default members** defined in the parent class.
   - A child class may **never access a private member** of the parent class
   - Can explicitly reference a member of the parent class by using the super keyword
   - Inheriting a class grants us access to the **public and protected members** of the parent class.

8. **Overriding a Method**: 
    - there is a method defined in both the parent and child class, you want to define a new version of an existing method in a child class. 
    - You declare a new method with **same signature and return type**. 
    - **signiature includes the name and lsit of input parameters**
    - use `super` to reference parent version method
    - clild class method must be at least as accessible or more accessbile than parent class
    - child class may not throw a checked exception newer or broader. (**no bigger exception**)
    - return value must be the same or a subclass
9. **Overloading**  
    - an overloaded method will use a **different signature** than an overridden method.
    - Check: access modifiers, return types and exceptions
      ```java
      public class Bird {
        public void fly() { System.out.println("Bird is flying");} 
        public void eat(int food) { System.out.println("Bird is eating "+food+" units of food"); }
      }
      
      public class Eagle extends Bird {
        public int fly(int height) { 
          System.out.println("Bird is flying at "+height+" meters"); return height; 
        } 
        
        public int eat(int food) { // DOES NOT COMPILE, return type not right
          System.out.println("Bird is eating "+food+" units of food");
          return food; 
        }
      }
      
      //fly() is overloaded, since signature changes from a no-argument constructor to one int argument
      //eat() is overridden, since signature is the same. 
      ```
    
10. **Hiding Static Methods**  
    - A **hidden method** occurs when a static method with same name and signature in both parent and child classes. 
    - Rules for overriding apply for hidden method. 
    - New rule: **stay static, or stay not static, remain the same**
    - if it has static, in method it will call parent variable
    - if don't have static, in will call instance variable
11. Inheriting Variables
    - **Hiding Variables**: you define a variable with the same name as a variable in a parent class.
    - explicit use of the `super` keyword to reference a hidden variable

## Abstract Classes  
**abstract class** marked with the _abstract_ keyword and cannot be instantiated.
**abstract method** marked with the _abstract_ keyword defined in an abstract class, no implementation is provided in the class

1.  abstract class vs. abstract method
  - An abstract class is **not required** to include any abstract methods.
  - An abstract class **may include nonabstract** methods and variables.
  - abstract class **cannot be marked as final**, because it must be extended.
  - An abstract method may only be defined in an abstract class.
  - An abstract method defined within an nonabstract class will cause complie error.
  - A method may not be marked as both abstract and private. Private method cannot be accessed by child.

2. Concreate Class  
A concrete class is the **first nonabstract subclass** that extends an abstract class.
A concrete class is **required** to implement all inherited abstract methods.

3. Extending an Abstract Class with Another Abstract
  - Abstract clases can extend other abstract classes are **not required to implement any** abstract method.
  - A concrete class that extends an abstract **must implement all** inherited abstract methods.
  - A concreate class is not required to implement an abstract  method, if an intermediate abstract class provides implementation.
  
    ```java
    public abstract class Animal { public abstract String getName(); }
    
    public abstract class BigCat extends Animal { 
      public String getName() {return "BigCat";}
      public abstract void roar();
    }
    
    public class Lion extends BigCat { 
      //getName() is no longer abstract by the time it reaches here
      public void roar() { System.out.println("The Lion lets out a loud ROAR!"); } 
    }
    ```
    
## Interfaces  

1. Definating an interface
  - An interface is defined with _interface_ keyword. 
  - Classes invokes it using _implements_ keyword.
  - Interfaces cannot be instantiated directly.
  - An interface is not required to have any methods.
  - Marking an **interface** as private, protected, or final will trigger a **compiler error**
  - Marking a **interface method** as private, protected, or final will trigger compiler errors

2. Inheriting an Interface
    1. An interface **extends** another interface
    2. An abstract class **implements** an interface
    3. An abstract class implements interface will inherits all abstracts method as its own abstract method
    4. The first concrete class that implements an interface, or extends that abstract class, **must** provide an implementation for all inherited abstract methods.
3. Multiple Inheritance
    - If two methods with **same signature** appear in two interfaces and implemented by a class, only need to implement once.
    - If two methods have different signature but input **parameters are different**, just implement seperately. It's method overloading.
    - **Unfortunately**, if the method name and input parameters are the same but the return types are different, won't compile.
4. Interface Variables
    - interface variables are constant, assumed to be **public satic final**.
    - Making it private or protected will trigger a compiler error.
    - The value of an interface variable **must be set** when it is declared since it is marked as final.
5. Default Interface Methods
    - A default method is defined within an interface with the **default** keyword.
    - A default method may **only be** declared within an interface and **not** within a class or abstract class.
    - If a method is marked as default, it **must** provide a method body.
    - A default method is **not assumed to be** static, final, or abstract, as it may be used or overridden by a class that implements the interface
    - Classes have the **option to override** the default method if they need to, but they are **not required to**.
    - If the class doesn’t override the method, the default implementation will be used.
6. Static Interface Methods
    - A static method defined in an interface is not inherited in any classes that implement the interface.
    - Use interface name to refer this method
    
## Polymorphism

1. Definition
  - **Polymorphism** An object can be accessed using a reference of itself, or a super class, or an interface.
  - A cast is **not required** if object is being reassigned to a super type or interface of the object.
  - In polymorphism, **only one object** is created.
  - Once this object is assigned a new type, it **only** can access members of that reference type.
  - Depending on the type of the reference, we may **only** have access to certain methods.
  - **Changing reference** type could allow you access new properties

2. Casting Objects
  - Once we changed the reference type, we **lost access** to more specific methods in that object
  - We **reclaim** reference by casting object back
  - We **explicitly** cast object to a subclass
  - **Doesn't require** explicit cast if it's from subclass to a superclass
  - **Compile error** if casts to unrelated types
  - **Runtime fail** `ClassCastException` if casts to related types, but object isn't an instance of that class
      
    ```java
    public class Bird {}
    public class Animal {}

    public class Fish extents Animal { 
      public static void main(String[] args) { 
        Fish fish = new Fish(); 
        Bird bird = (Bird)fish; // DOES NOT COMPILE, not related
        
        Animal animal = new Animal();
        Bird bird = (Bird) bird; //WILL COMPILE, throw ClassCastException.
        //reason is: basicly, this object is an Animal, nothing to do with a bird
      } 
    }
    ```
    
    we should perform cast only if the `isntanceof` operator returns true
    {: .notice--warning} 
      
3. Virtual Methods 
  - **Most important feature** of polymorphism is to support virtual methods.
  - A virtual method is a method in which the specific implementation is not determined **until runtime**.
  - All non-final, non-static, and non-private Java methods are considered virtual methods, since any of them can be **overridden at runtime**.
  - It's **special**! If you call a method on an object taht overrides a method, you get the overriden method. Even if the call to the method is on a parent reference, or within the parent class.
    
    ```java
    public class Bird {
      public String getName() { 
        return "Unknown"; 
      } 
      
      public void displayInformation() {
        System.out.println("The bird name is: "+getName()); 
      }
    }
    ```
    
    ```java
    public class Peacock extends Bird {
      public String getName() { return "Peacock"; } 
      
      public static void main(String[] args) {
        Bird bird = new Peacock();
        bird.displayInformation(); //The bird name is: Peacock
      }
    }
    ```
      
    1. `new Peacock()`,means it's a Peacock object. It has members: `getName()` from parent, `displayInfomation()` from parent and `getName()` from it self. 
    2. It can reach parent's `getName()`, by `super.getName()`.
    3. `Bird bird = new Peacock();` means the reference is a bird type
    4. `bird.displayInfomation()` will call this method in parent. However, it also triggers `getName()`
    5. this object is a Peacock, it has it's own `getName()`, so this one is being used
    6. what if peacock doesn't have this method? it will print: The bird name is: Unknown

4. Polymorphic Parameters  
    One of the **most useful** applications of polymorphism is the ability to pass instances of a subclass or interface to a method
    ```java
    public class Reptile                    { public String getName() { return "Reptile"; } }
    public class Alligator extends Reptile  { public String getName() { return "Alligator"; } }
    public class Crocodile extends Reptile { public String getName() { return "Crocodile"; } }
    
    public class ZooWorker {
      public static void feed(Reptile reptile) { 
        System.out.println("Feeding reptile "+reptile.getName()); 
      }
      
      public static void main(String[] args) { 
        feed(new Alligator());  //Feeding: Alligator 
        feed(new Crocodile());  //Feeding: Crocodile 
        feed(new Reptile());    //Feeding: Reptile
      }
    }
    ```
5. Method Overriding

    ```java
    public class Animal { public String getName() { return "Animal"; } }
 
    // DOES NOT COMPILE, beacause weaker access privileges
    public class Gorilla extends Animal { protected String getName() { return "Gorilla"; } }
    ```


