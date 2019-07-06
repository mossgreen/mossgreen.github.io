---
title: Core Spring Training Documentation
search: true
tags: 
  - Spring
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Study Notes for Core Spring Training Document.

Mobules:
1. INTRODUCTION TO SPRING
2. SPRING JAVA CONFIGURATION: A DEEPER LOOK
3. ANNOTATION-BASED DEPENDENCY INJECTION
4. FACTORY PATTERN IN SPRING
5. ADVANCED SPRING: HOW DOES SPRING WORK INTERNALLY?
6. ASPECT-ORIENTED PROGRAMMING
7. TESTING A SPRING-BASED APPLICATION
8. DATA ACCESS AND JDBC WITH SPRING
9. DATABASE TRANSACTIONS WITH SPRING
10. SPRING BOOT INTRODUCTION
11. SPRING BOOT DEPENDENCIES, AUTO-CONFIGURATION AND RUNTIME
12. JPA WITH SPRING AND SPRING DATA
13. SPRING MVC ARCHITECTURE AND OVERVIEW
14. REST WITH SPRING MVC
15. SPRING SECURITY
16. ACTUATORS, METRICS AND HEALTH INDICATORS
17. SPRING BOOT TESTING ENHANCEMENTS

---
## 1. INTRODUCTION TO SPRING

### 1.1 Java configuration and the Spring application context

```java
@Configuration @PropertySource("classpath:db/datasource.properties") public class DataSourceConfig {

@Value("${driverClassName}") private String driverClassName; ...

@Bean public static PropertySourcesPlaceholderConfigurer


propertySourcesPlaceholderConfigurer() {

return new PropertySourcesPlaceholderConfigurer(); }

@Bean public DataSource dataSource() throws SQLException { DriverManagerDataSource ds = new DriverManagerDataSource(); ds.setDriverClassName(driverClassName); ds.setUrl(url); ds.setUsername(username); ds.setPassword(password); return ds; }

}
```



### 1.2 `@Configuration` and `@Bean` annotations
1. The `@Bean` annotation is used to tell Spring that the result of the annotated method will be a bean that has to be managed by it. The `@Bean` annotation together with the method are treated as a **bean definition**, and the method name becomes the **bean id**. 
2. The configuration also requires a bean of type `PropertySourcesPlaceholderConfigurer` to replace the placeholders set as arguments for the `@Value` annotated properties.
3. In using Java Configuration, component scanning is enabled by annotating the configuration class with @ComponentScan.
4. When the name is not defined for a bean declared with Bean, the Spring ioC names the bean with the annotated method name. the name can be set by populating the name attribute. the same attribute can receive as argument an array of names. the first one becomes the name; the rest become aliases.
    ```java
    @Bean(name={"one", "two"})// //bean name = one, alias = two
    ```
5. When the name is not defined for a bean declared with Component, the Spring ioC creates the name of the bean from the name of the bean type, by lowercasing the first letter.


### 1.3 `@Import`: working with multiple configuration files

### 1.4 Defining bean scopes

### 1.5 Launching a Spring Application and obtaining Beans

---
## 2. SPRING JAVA CONFIGURATION: A DEEPER LOOK

### 2.1 External properties & Property sources
### 2.2 Environment abstraction
### 2.3 Using bean profiles
### 2.4 Spring Expression Language (SpEL)
### 2.5 How it Works: Inheritance based proxies

---
## 3.  ANNOTATION-BASED DEPENDENCY INJECTION
### 3.1 Autowiring and component scanning
### 3.2 Java configuration versus annotations, mixing.
### 3.3 Lifecycle annotations: @PostConstruct and @PreDestroy
### 3.4 Stereotypes and meta-annotations

---
## 4. FACTORY PATTERN IN SPRING

### 4.1 Using Spring FactoryBeans


