---
title: Spring Data JPA 101
search: true
tags: 
  - JAVA
  - Spring
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

## Basic concepts

- **ORM**: Object-Relation Mapping. The process of mapping object-oriented entities to entity-relationship models.

- **JPA**: Java Persistence API. It's a Java specification for accessing, presenting and managing data between Java objects and relational databases.

- **Spring Data JPA**: It aims to significantly improve the implementation of data access layers by reducing the effort to the amount that’s actually needed. As a developer, you write your repository interfaces, including custom finder methods, and Spring will provide the implementation automatically.


## Set up Dev environment

1. Add dependencies in _build.gradle_

2. Set up _application.properties_  
  in `./src/main/resources/application.properties`
    ```bash
    spring.datasource.url=jdbc:postgresql://localhost/questionmarks
    spring.datasource.username=postgres
    spring.datasource.password=mysecretpassword
    spring.datasource.driver-class-name=org.postgresql.Driver
    
    spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL9Dialect
    spring.jpa.properties.hibernate.temp.use_jdbc_metadata_defaults = false
    
    //The last two properties on the code snippet above were added to suppress an annoying exception that occurs when JPA (Hibernate) tries to verify PostgreSQL CLOB feature.
    ```
3. Create a table in the database

## Set up an entity

1. Set up _Model_, aka., _Entity_
    - Add `@Entity` annotation to the class
    - `@Id` and `@GeneratedValue(strategy=GenerationType.AUTO)`
    - `@Table(name = “TABLE_NAME”)` is required if your table name is different from the class name
    - add column annotation to our fields if the fields’ name differ from table columns name
      ```java
      @Column(name="title")
      private String title; 
      ```
    - `@NotNull` avoid persisting empty data for these fields.
    
2. Set up **ManyToOne** Model Relationships
  - `@ManyToOne` indicates a many-to-many relationship.  
    E.g., many questions can exist in one exam.
  - `@JoinColumn` indicates that, in the one-to-many relationship, in the **One** side, it exists a field like `One_id` in **Many** side as a _foreign key_.  
  E.g., in **Question Model** there will be a column called `exam_id`, in the table that supports Question, to reference the **exam** that owns this question.
3. Set up **one-to-many** Model Relationships  
Assume a _Person_ class has a list of _Addresses_ of type _Address_:
    ```java
    @Entity
    public class Person {
        @OneToMany(targetEntity = com.data.Address.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
        private List<Address> addresses;
        ...
    }    
    ```
    Hibernate will automatically generate entity tables and association tables for you, so you have three tables created:

    - person
    - address
    - person_addresses


4. Creating a Repository Class
  - Create an interface extends JpaRepository
  - Add `@Repository` annotation to this interface
  
## @JoinTable, many-to-many 
In this part, we use a differenct case, projects vs. tasks. If we want to have join table like **Project_Tasks**, in which contains **project_id** and **task_id**, we need to use `@JoinTable`

**Project** entity
```java
@Entity
public class Project {

    @Id
    @GeneratedValue
    private Long pid;

    private String name;

    @JoinTable
    @OneToMany
    private List<Task> tasks;
}
```
**Task** entity:
```java
@Entity
public class Task {

    @Id
    @GeneratedValue
    private Long tid;

    private String name;
```

![02-07-2015-03.jpg](https://i.loli.net/2018/05/06/5aeec465c0bb3.jpg =480x852)

customize joined table. In **project** entity, tasks property

```java
@JoinTable(
        name = "MY_JT",
        joinColumns = @JoinColumn(
                name = "PROJ_ID",
                referencedColumnName = "PID"
        ),
        inverseJoinColumns = @JoinColumn(
                name = "TASK_ID",
                referencedColumnName = "TID"
        )
)
@OneToMany
private List<Task> tasks;
```
![02-07-2015-10.jpg](https://i.loli.net/2018/05/06/5aeec522e32c9.jpg =480x852)


 
## JPA CRUD

- `findAll()`
    ```sql
    SELECT * FROM blog
    ```
    
- `findOne(param)`
    ```sql
    SELECT * FROM blog WHERE id=param LIMIT 1
    ```

- `save(blog)`:  
save the entry to the database. It will create a new record if a new **blog** item is supplied and update an existing one if an existing item is supplied
    ```sql
    INSERT INTO blog(ttile,content) VALUES (blog.title, blog.content)  
    
    UPDATE blog SET title=blog.title, content=blog.content WHERE id=blog.id
    ```
- `delete(param)`
    ```sql
    DELETE FROM blog WHERE id=param
    ```
    
## Custom JPA Queries

- The “findBy” clause is the main query keyword. What follows is the “Column Name” then the query “Constrain” such as Contains, Containing, GreatherThan, LessThan etc.
- “And” and “Or” are used as a conjunction to join two or more query criteria similar to MySQL’s “AND” and “OR”


## References 

- [Integrating Spring Data JPA, PostgreSQL, and Liquibase](https://auth0.com/blog/integrating-spring-data-jpa-postgresql-liquibase/?utm_source=medium&utm_medium=sc&utm_campaign=spring_data_jpa)

- [Spring JPA One-to-Many Query Examples with Property Expressions](https://medium.com/@evonsdesigns/spring-jpa-one-to-many-query-examples-281078bc457b)

- [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

- [Building a Spring Boot REST API — Part III: Integrating MySQL Database and JPA](https://medium.com/@salisuwy/building-a-spring-boot-rest-api-part-iii-integrating-mysql-database-and-jpa-81391404046a)

- [JPA “@JoinTable” annotation](https://stackoverflow.com/questions/5478328/jpa-jointable-annotation)