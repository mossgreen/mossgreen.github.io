---
title: Spring Data JPA Basic
search: true
tags: 
  - Hibernate
  - JPA
  - Spring Data JPA
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Additional capabilities beyond core spring and JPA.

## 0. Concepts

- **ORM**: Object-Relation Mapping. The process of mapping object-oriented entities to entity-relationship models.
- **Hibernate**: ORM frameworks, relies heavily on POJOs.
- **JPA**: Java Persistence API. It's a Java specification for accessing, presenting and managing data between Java objects and relational databases.
- **Spring Data**: It's an umbrella project that simplifies Java persistence through a very lean and consistent API that works on top of JDBC, JPA, and other NoSQL product APIs.
- **Spring Data JPA**: It's a subset of Spring Data and a very useful DSL (Domain Specific Language) based module that provides maximum reduction to boilerplate code for interacting with databases.

### The Layers of a Persistence Tier

- The domain model
- The Data Access Object (DAO) layer
- The service layer (or service facade)

### Developing applications with Spring Data JPA

1. Configuration
2. Define entities
3. Define repositories
4. optimizing queries

## 1. JPA Configuration and Spring Configuration

1. Set up a JPA environment that knows about the domain objects.
2. Configure a database connection.
3. Manage the system’s transactions.
4. Inject all of that into the DAO.

## 2. Associations, Relationships, Mappings

### 2.1 How to define association types

Regarding the following questions:

1. **Q1**: Can a B belong to more than one A?
2. **Q2**: Can an A have more than one B?

The answers to these questions can be formed into a truth table:
|Q1 Answer |Q2 Answer   |Relationship Between A and B|
|---|---|---|
|NO|NO|One to One|
|YES|NO|Many to One|
|NO|YES|One to Many|
|YES|YES|Many to Many|

### 2.2 How to decide association directions

1. When each entity points to the other, the relationship is **bidirectional**.
2. If only one entity has a pointer to the other, the relationship is **unidirectional**.
3. A bidirectional relationship is considered as a pair of unidirectional relationships.

### 2.3 Mapping Best Practices

1. One-to-One
    - Unidirectional/bidirectional `@OneToOne` with `@MapsId` and bidirectional `@OneToOne` with Bytecode Enhancement is efficient
2. One-to-Many
    - The most common mapping: Bidirection `@OneToMany`
    - Efficient:
        - Bidirectional `@OneToMany`
        - unidirectional `@ManyToOne`
    - less efficient
        - Bidirectional `@OneToMany` with `@JoinColumn(name = "foo_id", insertable = false, updatable = false)`,
        - unidirectional`@OneToMany` with `Set`, `@JoinColumn` and/or `@OrderColumn`
    - inefficient
        - Unidirectional `@OneToMany` with `List`
3. Many-to-Many
    - efficient
        - Unidirectional/bidirectional `@ManyToMany` with Set and the alternative (relying on two bidirectional `@OneToMany` associations)
    - less efficient
        - Unidirectional/bidirectional `@ManyToMany` with `@OrderColumn`
    - inefficient
        - Unidirectional/bidirectional `@ManyToMany` with List

## 3. Domain models

The motivating goal behind the analysis and design of a domain model is to capture the essence of the business information for the application’s purpose.

Each domain class defines the properties to be persisted to the database, as well as the relationships between one class and another.

Every JPA entity has some associated metadata that describes it. It enables the persistence layer to recognize, interpret, and properly manage the entity from the time it is loaded through to its runtime invocation.

Entity metadata may be specified in two ways: annotations or XML. XML is kind of old school, let's just fucus on annotations.

### 3.1 Entity Annotations overview

Two type of annotations: Persistence annotations vs. mapping annotations, or say physical annotations vs. logical annotaions.

1. **Persistence annotations**
    - describing the **physical** schema, relate to the concrete **data model in the database**.
    - They deal with tables, columns, constraints, and other **database-level artifacts** that the object model might never be aware of otherwise.
    - It can be applied at three different levels: class, method, and field.

2. The **Logical mapping annotations**:
    - describe the entity model **from an object modeling view**.
    - They are tightly bound to the domain model and are the sort of metadata that you might want to specify in UML or any other object modeling language or framework.
    - describing the object model, the association between two entities etc.
    - By convention, the logical mapping should appear first, followed by the physical mapping. This makes the object model clear.

Understanding and being able to distinguish between these two levels of metadata will help you make decisions about where to declare metadata, and where to use annotations and XML.

### 3.2 Persistence annotations

// todo

### 3.3 Logical mapping annotations

// todo

### 3.4 Data Types

// todo

- Enumerated Types  
  - ORDINAL and STRING
  - using strings will solve the problem of inserting additional values in the middle of the enumerated type, but it will leave the data vulnerable to changes in the names of the values.
  - In general, storing the ordinal is the best and most efficient way to store enumerated types as long as the likelihood of additional values inserted in the middle is not high. New values could still be added on the end of the type without any negative consequences.
- Temporal Types  

## 4.0 Validation

Spring uses Hibernate implementation of Bean Validation.
Validation has two models:

- annotation model.
- dynamic API that can be invoked from any layer, and on almost any bean.

1. annotation model.
Adding constraints to an object can be as simple as annotating the class, its fields, or properties.
    - `@AssertTrue` element must be true.
    - `@Past` element must be a date in the past.
    - `@Future` element must be a date in the future.

2. dynamic API.
The main API class for invoking validation on an object is the `javax.validation.Validator` class.
    - in container mode, a Validator instance may be injected into any Java EE component that supports injection.

        ```java
        @Resource
        Validator validator;

        public void newEmployee(Employee emp) {

            Set<ConstraintViolation<Employee>> violations = validator. validate(emp);
        }
        ```

    - in Java SE mode, a Validator instance is obtained from a `javax.validation.ValidatorFactory`.

        ```java
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        ```

**Customise constraints**
Each new constraint is composed of two parts:

1. the annotation definition
2. the implementation or validation classes

Constraint Annotations. There are three elements that are mandatory in every constraint annotation.

1. the `message` element, and how it can be used to set a default exception message when constraints are not met.
2. `groups` element is used when the validation of a constraint should occur as part of one or more sets of related other constraint checks.
3. `payload` element, which is just a place to pass contextmetadata to the validation class

    ```java
    @Constraint(validatedBy={EvenNumberValidator.class})
    @Target({METHOD, FIELD})
    @Retention(RUNTIME)
    public @interface Even {
        String message() default "Number must be even";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
        boolean includeZero() default true;
    }
    ```

**Constraint Implementation Classes**
two methods that must be implemented are `initialize()` and `isValid()`.

1. The `initialize()` method is invoked first and passes in the annotation instance that caused the validating class to be invoked in the first place. We take any state from the instance and initialize the validation class with it.
2. when the `isValid()` method is called we can validate the value passed to us according to the parameters of the constraint that is annotating it.

## 5 Second-Level Caching

With caching enabled, Hibernate first tries to find an entity or collection in the cache before trying to query the database.

Since loading data from the cache is far less expensive than performing a database operation, caching is another effective strategy for improving application performance.

There are three types of caching options for Hibernate:

1. domain, use `@Cache`
2. collection, use `@Cache`
3. query.

//todo

```java
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ArtEntity implements Serializable {

    @OneToMany(orphanRemoval = true,
        cascade = { javax.persistence.CascadeType.ALL })
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    public Set<Comment> getComments() { return comments; }

}
```

## 6. Define Repositories

Three interfaces in Spring Data API:

1. CrudRepository

2. PagingAndSortingRepository, which extends CrudRepository. Do pagination and sort records.

3. JpaRepository, which extends PagingAndSortingRepository. Provides JPA-related methods, such as flushing the persistence context and deleting records in a batch.

## 7. Queries

```java
//todo
```

## 8. Unit tests

```java
//todo
```

## References

- [Spring Persistence with Hibernate, 2nd edition](https://www.apress.com/gp/book/9781484202692/)
- [Pro JPA 2 in Java EE 8](https://www.amazon.com/Pro-JPA-Java-Depth-Persistence/dp/1484234197/)
- [Beginning Hibernate, 4th Edition](https://www.amazon.com/Beginning-Hibernate-Joseph-B-Ottinger-ebook/dp/B01MRIXZGP/)
- [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition)
- [Hibernate Annotations](https://docs.jboss.org/hibernate/stable/annotations/reference/en/html_single/#entity-mapping)
- [Rapid Java Persistence and Microservices](https://www.apress.com/gp/book/9781484244753)
- [Spring Boot Persistence Best Practices](https://www.apress.com/gp/book/9781484256251)

Update: Jun 2020
