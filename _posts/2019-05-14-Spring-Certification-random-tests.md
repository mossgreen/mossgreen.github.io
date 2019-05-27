---
title: Random Questions for Spring Professional Certification
search: true
tags: 
  - Java
  - Spring
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Answer some questions before the test.


## What are the modules of Spring Framework?

![IMAGE](https://i.loli.net/2019/05/27/5ceb8556e1a0161486.jpg)

### Core Container

- spring-core, 
- spring-beans, 
- spring-context, (`ApplicationContext`)
- springcontext-support, and 
- spring-expression (Spring Expression Language)

The `spring-core` and `spring-beans` modules provide the fundamental parts of the framework, including the **IoC** and **Dependency Injection** features.

### Data Access/Integration

- JDBC, 
- ORM, 
- OXM, (Object/XML mapping)
- JMS, (contains features for **producing** and **consuming messages**) 
- Transaction modules.

### Web

- spring-web, 
- spring-webmvc and 
- spring-websocket
- Portlet


## What types of Dependency injection does spring supports?

Dependency injection is a process whereby objects define their dependencies, that is, the other objects they work with, only through 
- constructor arguments, 
- arguments to a factory method, or 
- properties 

that are set on the object instance after it is constructed or returned from a factory method.

### Constructor argument resolution   
Constructor-based DI is accomplished by the container invoking **a constructor with a number of arguments, each representing a dependency**.


```java
public class SimpleMovieLister {

// the SimpleMovieLister has a dependency on a MovieFinder 
private MovieFinder movieFinder;

// a constructor so that the Spring container can inject a MovieFinder 
public SimpleMovieLister(MovieFinder movieFinder) { this.movieFinder = movieFinder; }

// business logic that actually uses the injected MovieFinder is omitted...
}
```

### Setter-based dependency injection

Setter-based DI is accomplished by the container calling setter methods on your beans after invoking **a no-argument constructor** or** no-argument static factory method** to instantiate your bean.

```java
public class SimpleMovieLister {

// the SimpleMovieLister has a dependency on the MovieFinder 
private MovieFinder movieFinder;

// a setter method so that the Spring container can inject a MovieFinder 
public void setMovieFinder(MovieFinder movieFinder) { this.movieFinder = movieFinder; }

// business logic that actually uses the injected MovieFinder is omitted...
}
```

### comparsion

- The Spring team generally advocates constructor injection as it enables one to implement application components as **immutable objects** and to ensure that **required dependencies are not null**. 
- Furthermore constructor-injected components are always returned to client (calling) code in a **fully initialized state**. 
- As a side note, a large number of constructor arguments is a bad code smell, implying that the class likely has too many responsibilities and should be refactored to better **address proper separation of concerns**.
- Setter injection should primarily only be used for **optional dependencies** that can be assigned reasonable default values within the class.


## What is the dependency resolution process? 

1. The ApplicationContext is created and initialized with configuration metadata that describes all the beans. Configuration metadata can be specified via XML, Java code, or annotations.

2. For each bean, its dependencies are expressed in the form of properties, constructor arguments, or arguments to the static-factory method if you are using that instead of a normal constructor. These dependencies are provided to the bean, when the bean is actually created.

3. Each property or constructor argument is an actual definition of the value to set, or a reference to another bean in the container.


- The Spring container validates the **configuration of each bean** as the **container is created**. 
- However, the bean **properties** themselves are **not set until the bean is actually created**. 
- Beans that are singletonscoped and set to be pre-instantiated (the default) are created when the container is created. 



## What are the IoC containers in Spring?

The `org.springframework.beans` and `org.springframework.context` packages are the basis for Spring Framework’s IoC container.

The **BeanFactory** provides the configuration framework and basic functionality, and the **ApplicationContext** adds more enterprise-specific functionality.

### ApplicationContext
- `ApplicationContext` is a **subinterface of BeanFactory**.
- Implementations in standalone applications
  - ClassPathXmlApplicationContext 
  - FileSystemXmlApplicationContext
- It adds easier integration with Spring’s AOP features; 
  - message resource handling (for use in internationalization), 
  - event publication; and 
  - application-layer specific contexts such as the `WebApplicationContext` for use in web applications.
  
### BeanFactory
- The `BeanFactory` interface provides an advanced configuration mechanism capable of managing any type of object.
- application-layer specific contexts: `WebApplicationContext`
- Use an `ApplicationContext` **unless** you have a good reason for not doing so.
- Spring makes heavy use of the `BeanPostProcessor` extension point (**to effect proxying** and so on
- To explicitly register a BeanFactoryPostProcessor when using a BeanFactory implementation
    ```java
    DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
    XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(factory);
    reader.loadBeanDefinitions(new FileSystemResource("beans.xml"));
    

    // bring in some property values from a Properties file 
    PropertyPlaceholderConfigurer cfg = new PropertyPlaceholderConfigurer();
    cfg.setLocation(new FileSystemResource("jdbc.properties"));

    // now actually do the replacement cfg.postProcessBeanFactory(factory); 
    
    ```
    
---

## By default a bean is lazily loaded. <-- False

- By default, ApplicationContext implementations **eagerly** create and configure all singleton beans as part of the initialization process. 
- By default a bean is **eagerly** loaded.
- A lazy-initialized bean tells the IoC container to create a bean instance when it is first requested, rather than at startup.


## Which class can be used to call Stored Procedures in spring? SimpleJdbcCall

1. **JdbcTemplate** is the classic Spring JDBC approach and the most popular. This "lowest level" approach and all others use a JdbcTemplate under the covers.

2. **NamedParameterJdbcTemplate** wraps a JdbcTemplate to provide named parameters instead of the traditional JDBC "?" placeholders. This approach provides better documentation and ease of use when you have multiple parameters for an SQL statement.

3. **SimpleJdbcInsert** and **SimpleJdbcCall** optimize database metadata to limit the amount of necessary configuration. This approach simplifies coding so that you only need to provide the **name of the table or procedure** and provide a map of parameters matching the column names.

4. RDBMS Objects including **MappingSqlQuery**, **SqlUpdate** and **StoredProcedure** requires you to create reusable and thread-safe objects during initialization of your data access layer.

## What is true about cross-cutting concerns?

√ The functions that span multiple points of an application are called cross cutting concerns.

X Cross-cutting concerns are conceptually separate from the application's business logic.

X Logging is one of the examples of cross cutting concerns.


## Which class can be extended to create custom event in spring? ApplicationEvent.

1. the event should extend ApplicationEvent
2. the publisher should inject an ApplicationEventPublisher object
3. the listener should implement the ApplicationListener interface

```java
public class CustomEvent extends ApplicationEvent{
   public CustomEvent(Object source) {
      super(source);
   }
   public String toString(){
      return "My Custom Event";
   }
}
```
