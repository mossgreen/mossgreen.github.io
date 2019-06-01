---
title: Spring AOP in Spring Certification
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring AOP in Spring Certification.

## What is the concept of AOP? 
AOP is **A**spect **O**riented **P**rogramming, which refers to a type of programming that aims to increase modularity by allowing the separation of cross-cutting concerns.

**Which problem does it solve?** 
Aims to help with separation of cross-cutting concerns to increase modularity.

- Avoid **tangling**: mixing business logic and cross cutting concerns
- Avoid **scattering**: code duplication in several modules

**What is a cross cutting concern?**
A **cross-cutting concern** is a functionality that is tangled with business code, which usually cannot be separated from the business logic.

**Name three typical cross cutting concerns**

- Auditing
- Security
- Transaction management
- Logging
- Caching
- Internationalization
- Error detection and correction
- Memory management
- Performance monitoring
- Synchronization

## AOP Terminology, what is a pointcut, a join point, an advice, an aspect, weaving?

### Join point

In Spring AOP, a joint point is always a **method execution**. 
The join point marks the execution point **where aspect behavior and base behavior join**.

**Spring AOP only** supports public method invocation join points. 
Compare to **AspectJ** which supports **all** of the above listed join point types and more.

Only public Join Points can be advised.

> Crosscutting concerns can happen at different program execution points called join points. Because of the variety of join points, you need a powerful expression language to help match them.


### Pointcut 

- It represents a point in the code where new behavior will be injected. This allows for business logic agnostic code to be separated from the code, avoiding code cluttering.
- A pointcut is an expression to match a set of join points,

- Pointcuts can be combined using the logical operators `&&` (and), `||` (or) and `!` (not).

pointcut expression: 
`execution( [Modifiers] [ReturnType] [FullClassName].[MethodName] ([Arguments]) throws [ExceptionType])`
  
- The `[ReturnType]` is **mandatory**
- The `[Modifers]` is **not mandatory** and if not specified **defaults to public**
- The `[MethodName]` is **not mandatory**, meaning no exception will be thrown at boot time
- The `[Arguments]` is mandatory.

**use  pointcut directly**
```java
@Aspect 
@Component 
public class UserRepoMonitor { 

  private static final Logger logger = Logger.getLogger(UserRepoMonitor.class);
  
  @Before("execution( * com.ps.repos.*.*UserRepo+.update*(..))
    || execution (* com.ps.services.*Service+.update*(..)))") 
  public void beforeUpdate(JoinPoint joinPoint) throws Throwable { 
  
    String className = joinPoint.getSignature().getDeclaringTypeName(); 
    String methodName = joinPoint.getSignature().getName(); 
    logger.info(" ---> Method " + className + "." + methodName + " is about to be called"); 
  }
}
```

**Seperate pointcut in another class**
```java

public class PointcutContainer {

  @Pointcut("execution (* com.ps.services.*Service+.update*(..))
              && args(id,pass) && target (service)") 
  public void serviceUpdate(UserService service, Long id, String pass) { } 
}

/*NB: UserRepoMonitor uses PointcutContainer.serviceUpdate() method*/

@Aspect 
@Component 
public class UserRepoMonitor { 

  private static final Logger logger = Logger.getLogger(UserRepoMonitor.class);
  
  @Before("com.ps.aspects.PointcutContainer.serviceUpdate(service, id, pass)") 
  public void beforeServiceUpdate (UserService service, Long id, String pass) throws Throwable { 
  
  logger.info(" ---> Proxied object " + service.getClass());
  
  if (StringUtils.indexOfAny(pass, new String{"$", "#", "$", "%"}) != -1) { 
    throw new IllegalArgumentException("Text for " + id + " contains weird characters!");
    }
  }
}
```

### Aspect
- An aspect is a Java class that modularizes a set of concerns (e.g., logging or transaction management) that cuts across multiple types and objects.

- Typically one aspect encapsulates one cross cutting concern, as to adhere to the single responsibility principle.

```java
@Aspect 
@Component 
public class UserRepoMonitor { 
  private static final Logger logger = Logger.getLogger(UserRepoMonitor.class);
  
  @Before ("execution(public com.ps.repos.˙JdbcTemplateUserRepo+.findById(..))") 
    public void beforeFindById(JoinPoint joinPoint) throws Throwable {
    String methodName = joinPoint.getSignature().getName();
    logger.info(" ---> Method " + methodName + " is about to be called"); 
  }
}
```

### Advice
- Advice is associated with a pointcut expression, and runs **before**, **after**, or **around** method executions matched by the pointcut.
- Advice is the additional behavior, typically a cross cutting concern, that is to be executed at certain places (at join points) in a program.
- Specifies **what** to do, **where** to do it.

```java
@Around("execution(public * com.ps.repos.*.*Repo+.find*(..))")
public Object monitorFind(ProceedingJoinPoint joinPoint) throws Throwable { 
  String methodName = joinPoint.getSignature().getName(); 
  logger.info(" ---> Intercepting call of: " + methodName); 
  long t1 = System.currentTimeMillis(); 
  try {
    //put a pause here so we can register an execution time 
    Thread.sleep(1000L); 
    return joinPoint.proceed(); 
  } finally { 
    long t2 = System.currentTimeMillis(); 
    logger.info(" ---> Execution of " + methodName + " took: " + (t2 - t1) / 1000 + " ms."); 
  }
}
```

### Weaving

Weaving is the process of applying aspects to your target advice objects.

- Spring AOP: happens at **runtime** through dynamic proxies.
- AspectJ framework: supports both **compile-time** and **loadtime** weaving.


### Introduction
By using introductions, you can **introduce new functionality** to an existing object dynamically.

It allows you not only to extend the functionality of existing methods but to extend the set of interfaces and object implementations dynamically.

![spring-aop-diagram.jpg](https://i.loli.net/2019/05/20/5ce25f018b90c60842.jpg)

## How does Spring solve (implement) a cross cutting concern?
Spring uses proxy objects to implement the method invocation interception part of AOP. Such proxy objects wrap the original Spring bean and intercepts method invocations as specified by the set of pointcuts defined by the cross cutting concern.

Two proxy techniques:
### JDK dynamic proxies

- JDK dynamic proxies uses technology found in the Java runtime environment and thus **require no additional libraries**. Proxies are created at runtime by generating a class that implements all the interfaces that the target object implements.

- Thus **any methods** found in the target object but not in any interface implemented by the target object cannot be proxied.

- JDK dynamic proxies is the **default** proxy mechanism used by Spring AOP.

### CGLIB proxies

- CGLIB is a third-party library.

- CGLIB proxies are created by generating a subclass of the class implementing the target object. This makes it possible to proxy not only methods implemented in interfaces, but in fact **all public methods** of the class.

- The CGLIB proxy mechanism will be **used** by Spring AOP when the Spring bean for which to create a proxy does **not implement any interfaces**.

- It is possible to instruct Spring AOP to use CGLIB proxies by default: `@EnableAspectJAutoProxy(proxyTargetClass = true)`

- Spring Java configuration classes, annotated with `@Configuration`, will **always** be proxied using CGLIB.


## Which are the limitations of the two proxy-types?
Both of them has the same limitation: **Invocation of advised methods on self**.

A proxy implements the advice which is executed prior to invoking the method on a Spring bean. The Spring bean being proxied is not aware of the proxy and when a calling a method on itself, the proxy will not be invoked.

### JDK Dynamic Proxies (Spring AOP)
- Must implement an interface.
- Only public methods will be proxied.
- Aspects can be applied only to Spring Beans.
- Even if Spring AOP is not set to use CGLIB proxies, if a Join Point is in a class that does not implement an interface, Spring AOP will try to create a CGLIB proxy.
- If a method in the proxy calls another method in the proxy, and both match the pointcut expression of an advice, the advice will be executed only for the first method. This is the proxy’s nature: it executes the extra behavior only when the caller calls the target method.

### CGLIB
- Class and Methods cannot be final
- Only public and protected methods can be proxied

## What visibility must Spring bean methods have to be proxied using Spring AOP?
- **Only public methods** of Spring beans will be proxied
- **Additionally** the call to the public method must originate from outside of the Spring bean.

## How many advice types does Spring support. Can you name each one?  What are they used for?
- **Before**: always proceed to the join point unless an execution is thrown from within the advice code
  - Access control, security
  - Statistics

- **After returning**: execution of a join point has completed without throwing any exceptions
  - statistics
  - Data validation

- **After throwing**: invoked after the execution of a join point that resulted in an exception being thrown
  - Error handling 
  - Sending alerts when an error has occurred.
  - Attempt error recovery

- **After (finally)**: invoke no matter what happened.
  - Releasing resources 

- **Around**: Around advice can be used for all of the use-cases for AOP.
 
![IMAGE](https://i.loli.net/2019/06/01/5cf1f4f78070020870.jpg)


## Which two advices can you use if you would like to try and catch exceptions?

**Only around advice allows** you to catch exceptions in an advice that occur during execution of a join point.

```java
@Around("execution(public * com.ps.repos.*.*Repo+.find*(..))")
public Object monitorFind(ProceedingJoinPoint joinPoint) throws Throwable { 
  String methodName = joinPoint.getSignature().getName(); 
  logger.info(" ---> Intercepting call of: " + methodName); long t1 = System.currentTimeMillis(); 
  try {
    //put a pause here so we can register an execution time 
    Thread.sleep(1000L); 
    return joinPoint.proceed(); 
  } finally { 
    long t2 = System.currentTimeMillis(); 
    logger.info(" ---> Execution of " + methodName + " took: " + (t2 - t1) / 1000 + " ms."); 
  }
}
```

## What do you have to do to enable the detection of the @Aspect annotation? What does @EnableAspectJAutoProxy do?

**In order to use aspects in Spring App:**
1. `spring-aop` as a dependency

2. declare an` @Aspect` class and declare it as a bean as well (using @Component or @Bean or XML typical bean declaration element)

3. declare an **@Advice method** , with `@Before` and **pointcut expression**

4. **enable aspects support** by annotating a configuration class with `@EnableAspectJAutoProxy`

5. (optional) add CGLIB as a dependency and enable aspects support using subclassed proxies by annotating a configuration class with `@EnableAspectJAutoProxy(proxyTa rgetClass = true)`


## If shown pointcut expressions, would you understand them?

For example, in the course we matched getter methods on Spring Beans, what would be the correct pointcut expression to match both getter and setter methods?

The basic structure of a pointcut expression consists of **two parts**; a pointcut **designator** and an **pattern** that selects join points of the type determined by the pointcut designator.

`execution(void set*(*)) || execution(* get*())`  
- Method execution of methods which name starts with “set” and that return void and takes one single parameter.

- Method execution of methods which name starts with “get” and that returns arbitrary type and takes no parameters.

## What is the JoinPoint argument used for?
- The parameter must, if present, be the first parameter of the advice method.
- When the advice is invoked, the parameter will hold a reference to an object that holds static information about the join point as well as state information.

```java
@Aspect 
@Component
public class UserRepoMonitor { 

  private static final Logger logger = Logger.getLogger(UserRepoMonitor.class);
  
  @Before("com.ps.aspects.PointcutContainer.serviceUpdate()") 
  public void beforeServiceUpdate(JoinPoint joinPoint) throws Throwable {
  
    Object[] args = joinPoint.getArgs();
    String text = (String)args[1];
    
    if (StringUtils.indexOfAny(text, new String[]{"$", "#", "&", "%"}) != -1) { 
      throw new IllegalArgumentException("Text contains weird characters!"); 
    }
  }
}

```
## What is a ProceedingJoinPoint? When is it used?

- `ProceedingJoinPoint` class is a parameter to an **around advice**. 
- This type is used as the first parameter of a method implementing an around advice.


## References

1. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
1. [Beginning Spring](https://www.amazon.com/Beginning-Spring-Mert-Caliskan-ebook/dp/B00T1JV8TI) 
2. [Spring Notes from Giberson Brendan](https://quizlet.com/266872659/container-dependency-and-ioc-flash-cards/)
3. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
4. [howtodoinjava - Spring AOP Tutorial Example](https://howtodoinjava.com/spring-aop-tutorial/)

