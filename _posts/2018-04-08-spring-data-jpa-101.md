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
- `@Basic`
- `@Transient`
- `@Basic`
- `@Temporal`
- `@Table`
- `@Column`
  - **ImprovedNamingStrategy**

- `@Id`
- `@GeneratedValue`
    - default is AUTO, let database to make the decision as to how identifiers should be created.
        ```java
        @Id @GeneratedValue(strategy = GenerationType.AUTO) 
        private Long id;
        ```
    - use a sequence, an identity column, or a special table for generating new IDs
        ```java
        @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="COMMENT_ID_SEQ")
        ```
    - UUID-based generation


## Set up Model Relationships

- uni-direction
- bi-direction

### Cascading Parent-child relationships

- **parent-child** relationships, meaning that one entity owns or encapsulates a collection of another entity.

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

- [Spring Persistence with Hibernate, 2nd edition](https://www.apress.com/gp/book/9781484202692/)- 