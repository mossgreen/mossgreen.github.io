---
title: Spring AOP in Spring Certification
search: true
tags: 
  - Spring
  - Spring AOP
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring AOP in Spring Certification(8%).

## What is the concept of AOP? 

AOP is **A**spect **O**riented **P**rogramming. 
AOP is a type of programming that aims to help with separation of cross-cutting concerns to increase modularity; it implies declaring an aspect class that will alter the behavior of base code, by applying advices to specific join points, specified by pointcuts.

**What problems does it solve?** 
**What two problems arise if you don't solve a cross cutting concern via AOP?**

Aims to help with separation of cross-cutting concerns to increase modularity.

1. Avoid **tangling**: mixing business logic and cross cutting concerns
2. Avoid **scattering**: code duplication in several modules

**What is a cross cutting concern?**
A **cross-cutting concern** is a functionality that is tangled with business code, which usually cannot be separated from the business logic.

**Name three typical cross cutting concerns**
- Auditing
- Security
- Transaction management

**Other examples of cross-cutting concerns**
- Logging
- Caching
- Internationalization
- Error detection and correction
- Memory management
- Performance monitoring
- Measuring statistics
- Synchronization

**Not a cross-cutting concerns**
- connecting to the database

**Two popular AOP libraries**
1. **AspectJ** is the original AOP technology which aims to provide complete AOP solution. More robust, more complicated. It uses three different types of weaving:
    1. Compile-time weaving
    2. Post-compile weaving
    3. Load-time weaving

    It doesn’t do anything at runtime as the classes are compiled directly with aspects.

2. **Spring AOP** aims to provide a simple AOP implementation across Spring IoC to solve the most common problems that programmers face. It makes use of  **only runtime weaving**.
    1. JDK dynamic proxy, **preferred**
    2. CGLIB proxy


## AOP Terminology, what is a pointcut, a join point, an advice, an aspect, weaving?

### Join point

- It's a point during the execution of a program, such as the execution of a method or the handling of an exception. 

- **In Spring AOP, a join point always represents a method execution**.

- The join point marks the execution point **where aspect behavior and base behavior join**.

- Spring AOP **only supports public method** invocation join points. 
    - CGLIB proxies intercept only public method calls! 
    - JDK proxies too

- Spring-driven **native AspectJ weaving** supports: private/ protected/ constructor methods and public method

Crosscutting concerns can happen at different program execution points called join points. 
Because of the variety of join points, you need a powerful expression language to help match them.

### Pointcut 

- Pointcut is a **predicate** used to identify join points.

- A pointcut is an **expression** to match a set of join points.

- It represents a point in the code where new behavior will be injected. 

- This allows for business logic agnostic code to be separated from the code, avoiding code cluttering.

- Pointcuts can be combined using the logical operators `&&` (and), `||` (or) and `!` (not).


### Aspect

- An aspect is a Java class that modularizes **a set of concerns** that cuts across multiple types and objects.

- You define an aspect by decorating a Java class with the` @Aspect` annotation. 

- Each of the methods in a class can become an **advice** with `@advice` annotation. 

- You can use five types of advice annotations: @Before, @After, @AfterReturning, @AfterThrowing, and @Around.

### Advice

- action taken by an aspect at a particular join point. 

- Different types of advice include "around," "before" and "after" advice.

- Spring models an advice as an `interceptor`, maintaining a chain of interceptors around the join point.

- Advice is the **additional behavior**, typically a cross cutting concern, that is to be executed at certain places (at join points) in a program.

- Specifies **what** to do, **where** to do it.

- I'ld like to understand it as "Enhancement"

### Weaving

- Weaving is the process of applying aspects to your target advice objects.

- linking aspects with other application types or objects to create an advised object. 

- Spring AOP: happens at **runtime** through dynamic proxies.

- AspectJ: supports both **compile-time**, **loadtime** and runtime weaving.

### Introduction

- By using introductions, you can **introduce new functionality** to an existing object dynamically.

- declaring additional methods or fields on behalf of a type.

It allows you not only to** extend the functionality** of existing methods but to **extend the set of interface**s and object implementations dynamically.

![spring-aop-diagram.jpg](https://i.loli.net/2019/05/20/5ce25f018b90c60842.jpg)


## How does Spring solve (implement) a cross cutting concern?

Spring uses proxy objects to implement the method invocation interception part of AOP. Such proxy objects wrap the original Spring bean and intercepts method invocations as specified by the set of pointcuts defined by the cross cutting concern.


## Which are the limitations of the two proxy-types?

Two proxy techniques:
1. JDK dynamic proxy
2. CGLIB proxy

**JDK dynamic proxy**

- JDK dynamic proxy uses technology found in the Java runtime environment and thus **require no additional libraries**. Proxies are created at runtime by generating a class that implements all the interfaces that the target object implements.

- JDK dynamic proxies is the **default** proxy mechanism used by Spring AOP.

**CGLIB proxy**

- It's included in the `spring-core` JAR.

- CGLIB proxies are created by generating a **subclass** of the class implementing the target object.

- The CGLIB proxy mechanism will be **used** by Spring AOP when the Spring bean for which to create a proxy does **not implement any interfaces**.

- It is possible to instruct Spring AOP to use CGLIB proxies by default: `@EnableAspectJAutoProxy(proxyTargetClass = true)`

- Spring Java configuration classes, annotated with `@Configuration`, will **always** be proxied using CGLIB.

**Limitations**

Both of them has the same limitation: **Invocation of advised methods on self**.     

If a method in the proxy calls another method in the proxy, and both match the pointcut expression of an advice, the advice will be executed only for the first method. This is the proxy’s nature: it executes the extra behavior only when the caller calls the target method.

- **JDK Dynamic Proxies Limitations**

    - Must implement an interface.
    - **Only public methods will be proxied**.
    - **any methods** found in the target object but not in any interface implemented by the target object cannot be proxied.
    - Aspects can be applied only to Spring Beans. That means 
    - Even if Spring AOP is not set to use CGLIB proxies, if a Join Point is in a class that does not implement an interface, Spring AOP will try to create a CGLIB proxy.
    - If a method in the proxy calls another method in the proxy, and both match the pointcut expression of an advice, the advice will be executed only for the first method. This is the proxy’s nature: it executes the extra behavior only when the caller calls the target method.

- **CGLIB Limitations**

    - Class and Methods **cannot be `final`**
    - **Only public and protected methods** can be proxied. 
    - **It takes more time to create a proxy object**, althrought it has better performance


## What visibility must Spring bean methods have to be proxied using Spring AOP?

1. **Only public methods** of Spring beans will be proxied

2. **Additionally** the call to the public method must originate from outside of the Spring bean.


## How many advice types does Spring support? Can you name each one?  What are they used for?

Advice: action taken by an aspect at a join point.
1. Before advice
2. After returning advice
3. After throwing advice
4. After (finally) advice
5. Around

**Details**

1. **Before advice**: 
    `@Before` always proceed to the join point unless an execution is thrown from within the advice code
    - Access control, security
    - Statistics

2. **After returning advice**: 
    `@AfterReturning` execution of a join point has completed without throwing any exceptions
    - statistics
    - Data validation

3. **After throwing advice**: 
    `@AfterThrowing` invoked after the execution of a join point that resulted in an exception being thrown
    - Error handling 
    - Sending alerts when an error has occurred.
    - Attempt error recovery

4. **After (finally) advice**: 
    `@After` method will execute after a join point execution, no matter how the execution ended (even exception happens).
    - Releasing resources 

5. **Around**:
    `@Around` Around advice can be used for all of the use-cases for AOP.
 
![IMAGE](https://i.loli.net/2019/06/01/5cf1f4f78070020870.jpg)


## Which two advices can you use if you would like to try and catch exceptions?

1. `@Around`. Only around advice allows you to catch exceptions **in an advice** that occur during execution of a join point.

    ```java
    @Aspect 
    public class Audience {
    
      @Pointcut("execution(** concert.Performance.perform(..))") 
      public void performance() {}
    
      @Around("performance()") 
      public void watchPerformance(ProceedingJoinPoint jp) { 
        try { 
          System.out.println("Taking seats"); 
          jp.proceed(); 
          System.out.println("CLAP CLAP CLAP!!!"); 
        } catch (Throwable e) { 
          System.out.println("Demanding a refund"); 
        }
      }
    }
    ```

2. `@AfterThrowing`. After throwing advice runs when a matched method execution exits by throwing an exception. The type Throwable is the superclass of all errors and exceptions in the Java language. So, the following advice will catch any of the errors and exceptions thrown by the join points.

    ```java
    @Aspect 
    public class CalculatorLoggingAspect {
    
      @AfterThrowing(
        pointcut = "execution(* *.*(..))",
        throwing = "e") 
      public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("An exception {} has been thrown in {}()", e, joinPoint.getSignature().getName()); 
      }
    }
    ```


## What do you have to do to enable the detection of the @Aspect annotation? What does @EnableAspectJAutoProxy do?

**three ways of declaring Spring AOP configuration**
- the ProxyFactoryBean, 
- the aop namespace, 
- and @AspectJ-style annotations. 

### Why do you want to use `@Aspect`?

Reduce duplication of pointcut expression. Aspect allows you define the pointcut once and then reference it every time you need it. The `@Pointcut` annotation defines a reusable pointcut within an `@Aspect` aspect. 

After you have an **AspectJ** class that contains a list of methods annotated with **@Pointcut**, you want to wire it as a Spring Bean. Each of the methods in a `@Aspect` class can become an advice. If you’re using JavaConfig, you can turn on auto-proxying by applying the `@EnableAspectJAutoProxy` annotation at the class level of the configuration class.

`@EnableAspectJAutoProxy` annotation enables support for handling components marked with AspectJ’s `@Aspect` annotation and is designed to be used on classes annotated with `@Configuration`.

### To enable annotation support in the Spring IoC container

1. you have to add `@EnableAspectJAutoProxy` to one of your configuration classes. 

2. To apply AOP, Spring creates proxies
    - by default it creates **JDK dynamic proxies**, which are interface-based.
    - It’s possible to create proxies by relying on **CGLIB**. To enable CGLIB, you need to set the attribute `proxyTargetClass=true` on the `@EnableAspectJAutoProxy` annotation.

```java
@Configuration
@ComponentScan 
@EnableAspectJAutoProxy 
public class SomeConfig {
  @Bean 
  public Audience audience() { 
    return new Audience(); 
  }
}
```

```java
@Aspect 
public class Audience {

  @Pointcut("execution(** concert.Performance.perform(..))") 
  public void performance() {}
}
```

**Spring Boot** provides a special AOP starter library that removes a little of the hassle of configuration. The `@EnableAspectJAutoProxy(proxyTarget Class = true)` annotation is **no longer** needed because the AOP Spring support is already enabled by default. The attribute does not have to be set anywhere either because Spring Boot automatically detects what type of proxies you need.


## If shown pointcut expressions, would you understand them?

The basic structure of a pointcut expression consists of **two parts**:

1. a pointcut **designator** and 
2. an **pattern** that selects join points of the type determined by the pointcut designator.

Spring AOP only supports **method execution** join points for beans declared in its IoC container. Otherwise, throw `IllegalArgumentException`.

###  Method Signature Patterns

For filtering according to the method signatures.

- the `execution` keyword can be used. 
- Its pattern is stated as follows:
    ```java
    execution( [scope] [ReturnType] [FullClassName].[MethodName] ([Arguments]) throws [ExceptionType])    
    ```
**pointcut expression**
- The scope of the methods could either be `public`, `protected`, or `private`.
- The `[ReturnType]` is **mandatory**
- The `[Modifers]` is **not mandatory** and if not specified **defaults to public**
- The `[MethodName]` is **not mandatory**, meaning no exception will be thrown at boot time
- The `[Arguments]` is mandatory. To bypass the Arguments filtering, you can specify two dots `..`

**Examples**
- This advice will match for all the methods of MyBean.
    ```java
    execution(* com.wiley.spring.ch8.MyBean.*(..))
    ```
- This advice will match for all the public methods of MyBean.
    ```java
    execution(public * com.wiley.spring.ch8.MyBean.*(..))
    ```
- This advice will match for all the public methods of MyBean that return a String.
    ```java
    execution(public String com.wiley.spring.ch8.MyBean.*(..))
    ```
- This advice will match for all the public methods of MyBean with the first parameter defined as long.
    ```java
    execution(public * com.wiley.spring.ch8.MyBean.*(long, ..))
    ```

### Type Signature Patterns

For filtering methods according to its types—like interfaces, class names, or package names. 

- Key word: `winthin`.
- The type signature pattern is as follows, **type name** could be replaced with `package name` or `class name`.
    ```java
    within(<type name>)
    ```
**Examples**
- This advice will match for all the methods in all classes of the com.wiley package and all of its subpackages.
    ```java
    within(com.wiley..*)
    ```
- This advice will match for all the methods in the MyService class.
    ```java
    within(com.wiley.spring.ch8.MyService)`
    ```
- This advice will match for all the methods of classes that implement the MyServiceInterface.
    ```java
    within(MyServiceInterface+)
    ```
- This advice will match for MyBaseService class and for all of its subclasses.
    ```java
    within(com.wiley.spring.ch8.MyBaseService+)
    ```
- Combine Pointcut Expressions. Matches the join points within classes that implement either the ArithmeticCalculator or UnitCalculator interface
    ```java
    within(ArithmeticCalculator+) || within(UnitCalculator+)
    ```

### Other alternative Point‐cut designators

1. `bean(*Service)`: It’s possible to filter beans according to their names with the bean keyword. 
The point‐cut expression given above will match for the beans that have the suffix Service in their names.

2. `@annotation(com.wiley.spring.ch8.MarkerMethodAnnotation)`: It’s possible to filter the methods according to an annotation applied on. 
The point‐cut expression here states that the methods that have the MarkerMethodAnnotation annotation will be advised.

3. `@within(com.wiley.spring.ch8.MarkerAnnotation)`: While point‐cut expressions with the within keyword match a package, class, or an interface, it’s also possible to restrict filtering of the classes **according to an annotation** that the class would have. Here, the classes with the MarkerAnnotation will be advised by the @within keyword.

4. `this(com.wiley.spring.ch8.MarkerInterface)`: This point‐cut expression will filter the methods of any proxy object that implements the MarkerInterface.

### Wildcards

1. `..`
This wildcard matches any number of arguments within method definitions, and it matches any number of packages within the class definitions.

2. `+`
This wildcard matches any subclasses of a given class.

3. `*`
This wildcard matches any number of characters.


### Declare Pointcut Parameters

```java
@Aspect 
public class CalculatorLoggingAspect { 
  @Before("execution(* *.*(..)) && target(target) && args(a,b)") 
  public void logParameter(Object target, double a, double b) { 
    log.info("Target class : {}", target.getClass().getName()); 
    log.info("Arguments : {}, {}", a,b); 
  } 
}
```

```java
@Aspect 
public class CalculatorPointcuts {
  @Pointcut("execution(* *.*(..)) && target(target) && args(a,b)")
  public void parameterPointcut(Object target, double a, double b) {} 
}

@Aspect 
public class CalculatorLoggingAspect {

  @Before("CalculatorPointcuts.parameterPointcut(target, a, b)") 
  public void logParameter(Object target, double a, double b) { 
    log.info("Target class : {}", target.getClass().getName()); 
    log.info("Arguments : {}, {}"a,b); 
  } 
}
```

### @Pointcut

1. Point‐cuts can be defined with this annotation by providing a method declaration.
2. The return type of the method should be `void` and the parameters of the method should match the parameters of the point‐cut.
3. There is no need to define the method body because it will be omitted.

**use  pointcut directly**
```java
@Component 
@Aspect 
public class ExecutionOrderBefore {

  @Before(value = "execution(public * *(..)) and args(param)") 
  public void before(JoinPoint joinPoint, String param) { 
    System.out.println("Before Advice. Argument: " + param); 
  }
}
```

**Rewrite with the @Pointcut**
```java
@Pointcut("execution(public * *(..))") 
public void anyPublicMethod() { }

@Before("anyPublicMethod()") 
public void beforeWithPointcut(JoinPoint joinPoint) { }
```


## What would be the correct pointcut expression to match both getter and setter methods?

**Pointcut expression to match both getter and setter methods**
```java
execution(void set*(*)) || execution(* get*())
```

- Method execution of methods which name starts with “**set**” and that return void and takes one single parameter.

- Method execution of methods which name starts with “**get**” and that returns arbitrary type and takes no parameters.


## What is the JoinPoint argument used for?

- The parameter must, if present, be the first parameter of the advice method.

- When the advice is invoked, the parameter will hold a reference to an object that holds static information about the join point as well as state information.

From a join‐point we canaccess 

1. the target object with `getTarget()`, 
2. the method signature with `getSignature()`, and 
3. the arguments of the method with the `getArgs()` methods.

The `ProceedingJoinPoint`, an extension of `JoinPoint` that can be used **only in around advice**. It adds the `proceed()` method that is used to call the target method.

```java
@Aspect 
@Component
public class UserRepoMonitor { 

  @Before("com.ps.aspects.PointcutContainer.serviceUpdate()") 
  public void beforeServiceUpdate(JoinPoint joinPoint) throws Throwable {
  
    Object[] args = joinPoint.getArgs();
    String text = (String)args[1];
    String className = joinPoint.getSignature().getDeclaringTypeName();
    String methodName = joinPoint.getSignature().getName();
    
    if (StringUtils.indexOfAny(text, new String[]{"$", "#", "&", "%"}) != -1) { 
      throw new IllegalArgumentException("Text contains weird characters!"); 
    }
  }
}
```


## What is a ProceedingJoinPoint? When is it used?

- `ProceedingJoinPoint` class is a parameter to an **around advice, only**. 

- This type is used as the first parameter of a method implementing an around advice.

- When it’s ready to pass control to the advised method, it will call ProceedingJoinPoint’s `proceed()` method, whch is used to execute the actual method.

```java
@Aspect public class Audience {

  @Pointcut("execution(** concert.Performance.perform(..))") 
  public void performance() {}

  @Around("performance()") 
  public void watchPerformance(ProceedingJoinPoint jp) { 
      try { 
        System.out.println("Silencing cell phones"); 
        System.out.println("Taking seats");
        
        jp.proceed();  //it’s crucial that you remember to call
        
        System.out.println("CLAP CLAP CLAP!!!"); 
      } catch (Throwable e) { 
        System.out.println("Demanding a refund"); 
      }
  }
}
```

## References

1. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
2. [Beginning Spring](https://www.amazon.com/Beginning-Spring-Mert-Caliskan-ebook/dp/B00T1JV8TI) 
3. [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition/)
4. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
5. [Spring Notes from Giberson Brendan](https://quizlet.com/266872659/container-dependency-and-ioc-flash-cards/)
6. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
7. [howtodoinjava - Spring AOP Tutorial Example](https://howtodoinjava.com/spring-aop-tutorial/)