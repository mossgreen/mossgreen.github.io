---
title: Java Bean VS Spring Bean
search: true
tags: 
  - Java
  - Spring
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

A Java object can be a JavaBean, a POJO and a Spring bean all at the same time.

## Java Bean

**JavaBeans** are classes that encapsulate many objects into a single object (the bean). The name "Bean" was given to encompass the following standards, which aims to create reusable software components for Java.

1. Must implement Serializable.
2. It should have a public no-arg constructor.
3. All properties in java bean must be private with public getters and setter methods.

### JavaBean conventions

1. The class should be serializable.
2. Have a public default constructor.
3. class properties are private, accessed by getter and seter.

### Advantages
1. properties, events, and methods can be reused in other applications
2.  register events
3.  can be saved to persistent storage and restored

### Disadvantages
1. public no-arg constructor cannot guatantee a proper initialization
2. Java Beans are mutable in nature.
3. Boilerplate code, like getter and setter.

## Spring Bean

Spring beans are just object instances that are managed by the Spring IOC container. They're created based on `BeanDefinition`.

### Bean Definition
`BeanDefinition` describe the properties of a bean. 
It contains the following meta data:
1. A package-qualified class name
2. Bean behavioral configuration: scope, lifecycle callbacks, and so forth
3. collaborators or dependencies
4. Other configuration settings

**`BeanDefinition` properties**
- class
- name
- scope
- constructor arguments	
- properties
- autowiring mode	
- lazy-initialization mode	
- initialization method	
- destruction method	

### three different of defining a Spring bean

1. Using stereotype `@Component` annotation
2. using `@Bean` annotation in a custom Java configuration class
3. `XML` configuration


## POJO

POJO is an acronym for Plain Old Java Object. The term was coined by Martin Fowler et. al., as a ‘fancy’ way to describe ordinary Java Objects that do not require a framework to use, nor need to be run in a application server environment. It is often used to distinguish simpler, lightweight Java objects from ‘heavyweight’ code like EJBs. The use of these kind of lightweight objects in programming is described in books such as “POJOs in Action” and advocated by frameworks like Spring.


## Java Bean VS Spring Bean

1. Java Bean is maintend by JVM, Spring bean is managed by Spring IOC.
2. Java Bean is always serializeable, Spring Bean doesn't need to.
3. Java Bean must have a default no-arg constructor, Spring Bean doesn't need to.
4. A Java object can be a JavaBean, a POJO and a Spring bean all at the same time.


## References
1. [Wikipedia: JavaBeans](https://en.wikipedia.org/wiki/JavaBeans#JavaBean_conventions)
2. [Spring Reference: The IoC container](https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/beans.html)
3. [What is a Spring Bean?](https://www.baeldung.com/spring-bean)