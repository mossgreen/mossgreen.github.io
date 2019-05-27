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

Found some tests on Internet. Might be helpful. Who knows.


##  What are the IoC containers in Spring?

1. BeanFactory
2. ApplicationsContext


- IocContextFactory
- BeanContext


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



