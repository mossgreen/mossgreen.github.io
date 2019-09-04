---
title: Spring Data JPA 101
search: true
tags: 
  - JAVA
  - JPA
  - Spring Data
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

## Basic concepts

- **ORM**: Object-Relation Mapping. The process of mapping object-oriented entities to entity-relationship models.

- **JPA**: Java Persistence API. It's a Java specification for accessing, presenting and managing data between Java objects and relational databases.

- **Spring Data JPA**: It aims to significantly improve the implementation of data access layers by reducing the effort to the amount that’s actually needed. As a developer, you write your repository interfaces, including custom finder methods, and Spring will provide the implementation automatically.


## JPA Configuration and Spring Configuration

1. Set up a JPA environment that knows about the domain objects.
2. Configure a database connection.
3. Manage the system’s transactions.
4. Inject all of that into the DAO.


## The Layers of a Persistence Tier

- The domain model
- The Data Access Object (DAO) layer
- The service layer (or service facade)


## Building the Domain Model

- `@Entity`
- `@Basic` The annotation takes two optional attributes
    1. optional and takes a Boolean. Defaulting to true, this can be set to false to provide a hint to schema generation that the associated column should be created NOT NULL. 
    2. The second is named fetch and takes a member of the enumeration FetchType. This is EAGER by default, but can be set to LAZY to permit loading on access of the value.
- `@Transient`
- `@Basic`
- `@Temporal` Some fields, such as calculated values, may be used at runtime only, and they should be discarded from objects as they are persisted into the database.
- `@Table` 4 attributes
    1. name of table
    2. its catalog
    3. its schema
    4. enforce unique constraints on columns in the table
    ```java
    @Entity 
    @Table( name="customer",
      uniqueConstraints={@UniqueConstraint(columnNames="name")} )
    public class Customer { }
    ```
- `@SecondaryTable` annotation provides a way to model an entity bean that is persisted across several different database tables.
- `@Column`
  - `name` permits the name of the column to be explicitly specified — by default, this would be the name of the property.
  - `length` permits the size of the column used to map a value (particularly a String value) to be explicitly defined. The column size defaults to 255.
  - `nullable` permits the column to be marked NOT NULL when the schema is generated. The default is that fields should be permitted to be null.
  - `unique` permits the column to be marked as containing only unique values. This defaults to false.
  ```java
  @Column(name="working_title",length=200,nullable=false) 
  String title;
  ``
- `@Id`
- `@GeneratedValue`: it takes a pair of attributes: strategy and generator.
    - strategy
        - default is AUTO, let database to decide how identifiers should be created.
            ```java
            @Id @GeneratedValue(strategy = GenerationType.AUTO) 
            private Long id;
            ```    
        - IDENTITY: The database is responsible for determining and assigning the next primary key.
        - SEQUENCE: Some databases support a SEQUENCE column type.
        - TABLE: This type keeps a separate table with the primary key values.
    - generator
        - use a sequence, an identity column, or a special table for generating new IDs
            ```java
            @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="COMMENT_ID_SEQ")
            ```
        - UUID-based generation


## Associations

1. One to One
2. One to Many
3. Many to one
4. Many to Many

Regarding the following questions: 
Q1: Can an email address belong to more than one user?
Q2: Can a customer have more than one email address?

The answers to these questions can be formed into a truth table:
![IMAGE](https://i.loli.net/2019/09/04/MmsSt8l6z91eQZk.jpg)

### Cascading Parent-child relationships

- **parent-child** relationships, meaning that one entity owns or encapsulates a collection of another entity. E.g., one garden has multiple flowers.

Whenever you create this bidirectional link, two actions are required:
1. You must add the Flower to the Flowers collection of the Garden. 
2. The item property of the Bid must be set.

```java
@OneToMany( orphanRemoval = true, 
    cascade = { javax.persistence.CascadeType.ALL }) 
public Set<Comment> getComments() { 
  return comments; 
}
```


## Second-Level Caching

With caching enabled, Hibernate first tries to find an entity or collection in the cache before trying to query the database. 

Since loading data from the cache is far less expensive than performing a database operation, caching is another effective strategy for improving application performance.

There are three types of caching options for Hibernate: 
1. domain, use `@Cache`
2. collection, use `@Cache`
3. query.

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


## Custom JPA Queries
//todo


## References 

- [Integrating Spring Data JPA, PostgreSQL, and Liquibase](https://auth0.com/blog/integrating-spring-data-jpa-postgresql-liquibase/?utm_source=medium&utm_medium=sc&utm_campaign=spring_data_jpa)

- [Spring JPA One-to-Many Query Examples with Property Expressions](https://medium.com/@evonsdesigns/spring-jpa-one-to-many-query-examples-281078bc457b)

- [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

- [Building a Spring Boot REST API — Part III: Integrating MySQL Database and JPA](https://medium.com/@salisuwy/building-a-spring-boot-rest-api-part-iii-integrating-mysql-database-and-jpa-81391404046a)

- [JPA “@JoinTable” annotation](https://stackoverflow.com/questions/5478328/jpa-jointable-annotation)

- [Hibernate Tips: How to map an entity to multiple tables](https://www.thoughts-on-java.org/hibernate-tips-how-to-map-an-entity-to-multiple-tables/)

- [Spring Persistence with Hibernate, 2nd edition](https://www.apress.com/gp/book/9781484202692/)

- [Beginning Hibernate, 4th Edition](https://www.amazon.com/Beginning-Hibernate-Joseph-B-Ottinger-ebook/dp/B01MRIXZGP/)