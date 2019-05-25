---
title: Spring REST in Spring Certification
search: true
tags: 
  - Restful
  - Spring
  - Spring REST
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Boot in Spring professional certification.

## What is Spring Boot?

The main goal of Spring Boot is to quickly create **Spring-based** applications without requiring developers to write the same boilerplate configuration again and again. 

The key Spring Boot features include:
- Spring Boot starters   
- Spring Boot autoconfiguration.
- Elegant configuration management
- Spring Boot actuator. 
- Easy-to-use embedded servlet container support.


## What are the advantages of using Spring Boot?

- Spring Boot starters   
These starters are pre-configured with the most commonly used library dependencies so you don’t have to search for the compatible library versions and configure them manually. E.g., the `spring-boot-starter-data-jpa` starter module includes all the dependencies required to use Spring Data JPA, along with Hibernate library dependencies, as Hibernate is the most commonly used JPA implementation.

- Spring Boot autoconfiguration. Spring Boot configures various components automatically, by registering beans based on various criteria. The criteria can be:
    - Availability of a particular class in a classpath
    - Presence or absence of a Spring bean
    - Presence of a system property
    - Absence of a configuration file   
    
    For example, if you have the spring-webmvc dependency in your classpath, Spring Boot assumes you are trying to build a SpringMVC-based web application and automatically tries to register DispatcherServlet if it is not already registered.

- Elegant configuration management
  -  Spring supports `@PropertySource`
  -  Spring Boot uses densible defaults and powerful type-safe property binding to bean properties.
  -  Spring Boot supports having deparate configuration files for different profiles without requiring much configuration.

- Spring Boot actuator. It provides a wide variety of such production-ready features:
  - Can view the application bean configuration details
  - Can view the application URL mappings, environment details, and configuration parameter values
  - Can view the registered health check metrics

- Easy-to-use embedded servlet container support.  
It creates a JAR type module and embed the servlet container in the application to be a self-contained deployment unit.


## Why is it “opinionated”?

- It follows the “Convention Over Configuration” approach.
- It pre-configures Spring app by reasonable defaults.
- It's highly customizable


## How does it work? How does it know what to configure?

Spring Boot configures various components automatically, by registering beans based on various criteria. The criteria can be:
    - Availability of a particular class in a classpath: `@ConditionalOnClass`, on the other hand `@ConditionalOnMissingBean`
    - Presence or absence of a Spring bean: `@ConditionalOnBean`, `@ConditionalOnMissingBean`
    - Presence of a system property
    - Absence of a configuration file   

## What things affect what Spring Boot sets up?

Spring Boot provides many custom `@Conditional` annotations to meet developers’ autoconfiguration needs based on various criteria, each of which can be used to control the creation of Spring beans.

- `@ConditionalOnClass`
- `@ConditionalOnMissingClass`
- `@ConditionalOnBean`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`
- `@ConditionalOnResource`
- `@ConditionalOnWebApplication`
- `@ConditionalOnNotWebApplication`


## How are properties defined? Where is Spring Boot’s default property source?

Properties controlling the behavior of Spring Boot applications can be defined using:
- Property files. A property file contains key-value pairs. Example: requestreceiver.timeout=5000
- YAML files
- Environment variables. Used to control application behavior in different environments.
- Command-line arguments: Example: java -jar myspringbootapp.jar –server.port=8081
  

```java
@Configuration 
public class AppConfig {

  @Bean @Profile("DEV") 
  public DataSource devDataSource() { 
  // ...
  }
  
  @Bean @Profile("PROD") 
  public DataSource prodDataSource() { 
  //...
  }
}
```

The **default properties** of a Spring Boot application are stores in the application’s JAR in a file named “**application.properties**”. When developing, this file is found in the `src/main/resources directory`.


## Would you recognize common Spring Boot annotations and configuration properties if you saw them in the exam?

### Annotations

- `@SpringBootApplication` enables the following three annotations
  1. @EnableAutoConfiguration: enable Spring Boot’s auto-configuration mechanism
  2. @ComponentScan: enable @Component scan on the package where the application is located
  3. @Configuration: allow to register extra beans in the context or import additional configuration classes

- Other common Spring Boot Annotations:
  - `@EnableConfigurationProperties`. Enables support for Spring beans annotated with `@ConfigurationProperties`
  - `@ConfigurationProperties`. Allows for binding a selected group of configuration properties to a class
  - `@WebMvcTest`. Annotation used in Spring MVC tests testing only Spring MVC components.
  - @SpringBootTest
  - @DataJpaTest

### configuration properties
Commonly, but** not always**, Spring Boot configuration properties use the following format:
```properties
spring.xxx.yyy=somevalue
```
- **xxx**: the name of the technology or area that the property controls.
- **yyy**: consists of one or more strings specifying the property in question separated with decimal dots or dashes.


## What is the difference between an embedded container and a WAR?

- An **embedded container** is packaged in the application **JAR-file** and will contain only one single application. 

- A **WAR-fil**e will need to be deployed to a **web container**, such as Tomcat, before it can be used. The web container to which the WAR-file is deployed may contain other applications.


## What embedded containers does Spring Boot support?
- Tomcat,
- Jetty,
- Undertow servers.


## What does @EnableAutoConfiguration do?

The `@EnableAutoConfiguratio`n annotation enables the autoconfiguration of Spring ApplicationContext by:
1. scanning the classpath components and 
2. registering the beans that match various conditions. 

Spring Boot provides various autoconfiguration classes in `spring-boot-autoconfigure{version}.jar`, and they are typically:
1. annotated with `@Configuration` to mark it as a Spring configuration class and 
2. annotated with `@EnableConfigurationProperties` to bind the customization properties and one or more conditional bean registration methods.


## What about @SpringBootApplication?
`@SpringBootApplication` enables the following three annotations:
  1. @EnableAutoConfiguration: enable Spring Boot’s auto-configuration mechanism
  2. @ComponentScan: enable @Component scan on the package where the application is located
  3. @Configuration: allow to register extra beans in the context or import additional configuration classes


## Does Spring Boot do component scanning? Where does it look by default?

- `@ComponentScan` or `@SpringBootApplication` enables component scanning.
- The base package(s) which to scan for components can be specified using the **basePackages element** in the `@ComponentScan` annotation or by specifying one or more classes that are located in the base package(s)

```java

@Configuration @EnableJpaRepositories(
  basePackages = "com.apress.demo.orders.repositories",
  entityManagerFactoryRef = "ordersEntityManagerFactory",
  transactionManagerRef = "ordersTransactionManager" ) 
public class OrdersDBConfig {}
```


## What is a Spring Boot starter POM? Why is it useful?
**Starter POMs** are that all the dependencies needed to get started with a certain technology have been gathered. 

A developer can rest assured that there are no dependencies missing and that all the dependencies have versions that work well together.

## Spring Boot supports both Java properties and YML files. Would you recognize and understand them if you saw them?

**Properties**
```properties
environments.dev.url=https://dev.example.com
environments.dev.name=Developer Setup
environments.prod.url=https://another.example.com
environments.prod.name=My Cool App
```

**YAML**
```yaml
environments:
	dev:
		url: https://dev.example.com
		name: Developer Setup
	prod:
		url: https://another.example.com
		name: My Cool App

```

## Can you control logging with Spring Boot? How?

```
// todo
```


## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)


