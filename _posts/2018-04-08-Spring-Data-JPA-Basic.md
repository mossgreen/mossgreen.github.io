---
title: Spring Data JPA Basic
search: true
tags: 
  - JPA
  - Spring Data JPA
  - Hibernate
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


## 2. Define entities

### 2.1 Persistence annotations**

Persistence annotations can be applied at three different levels: class, method, and field.

The mapping annotations can be categorized as being in one of two categories: logical annotations and physical annotations. 

Understanding and being able to distinguish between these two levels of metadata will help you make decisions about where to declare metadata, and where to use annotations and XML.

1. **The logical annotations**: 
describe the entity model **from an object modeling view**. They are tightly bound to the domain model and are the sort of metadata that you might want to specify in UML or any other object modeling language or framework. 

2. **The physical annotations**: 
relate to the concrete **data model in the database**. They deal with tables, columns, constraints, and other **database-level artifacts **that the object model might never be aware of otherwise.
    - 


Other rules:
1. The mapping annotations for a property must be on the `getter` method.
2. By convention, the logical mapping should appear first, followed by the physical mapping. This makes the object model clear.


### 2.2 logical annotations (object modeling)


1. `@Entity` and `@Id` annotations need to be specified to create and map an entity to a database table.

2. The `@Id` annotation indicates
    1. the id field is the persistent identifier or primary key for the entity 
    2. the field access should be assumed private.
3. `@Access`
    - entity default access mode is `AccessType.FIELD`.
    - Override the access of data through field access.
    - If use property access, filed should be marked as `@Transient`.
    ```java
    @Entity 
    @Access(AccessType.FIELD) 
    public class Employee {
    
        @Transient 
        private String phoneNum;
        
        @Access(AccessType.PROPERTY) 
        @Column(name="PHONE") 
        protected String getPhoneNumberForDb() { }
    }
    ```
4. Lazy Fetching
    ```java
    @Basic(fetch=FetchType.LAZY) 
    @Column(name="COMM") 
    private String comments;
    ```    
    - LAZY means that the provider might defer loading the state for that attribute until it is referenced.
    - The default is to load all basic mappings eagerly.
    - is meant only to be a hint to the persistence provider to help the application achieve better performance.
    - never a good idea to lazily fetch simple types
    - **should be considered** are when there are many columns in a table (for example, dozens or hundreds) or when the columns are large (for example, very large character strings or byte strings)
    - lazy loading at the attribute level is not normally very beneficial.
    - At the relationship level, however, lazy loading can be a big boon to enhancing performance. It can reduce the amount of SQL that gets executed, and speed up queries and object loading considerably.
    - on a single-valued relationship, the related object is guaranteed to be loaded eagerly.
    - Collection-valued relationships default to be lazily loaded
5. Enumerated Types  
    - ORDINAL and STRING
    - using strings will solve the problem of inserting additional values in the middle of the enumerated type, but it will leave the data vulnerable to changes in the names of the values.
    - In general, storing the ordinal is the best and most efficient way to store enumerated types as long as the likelihood of additional values inserted in the middle is not high. New values could still be added on the end of the type without any negative consequences.
6. Temporal Types  
    - Temporal types are the set of time-based types that can be used in persistent state mappings.
    - three enumerated values of DATE, TIME, and TIMESTAMP
7. Transient State  
    - Attributes that are part of a persistent entity but not intended to be persistent can either be modified with the transient modifier in Java or be annotated with the `@Transient` annotation.
8. Identifier Generation  
    1. Automatic ID Generation
    2. ID Generation Using a Table
    3. ID Generation Using a Database Sequence
    4. ID Generation Using Database Identity


### 2.3 Relationships

1. One to One
2. One to Many
3. Many to One
4. Many to Many

Regarding the following questions: 
Q1: Can a B belong to more than one A?
Q2: Can an A have more than one B?

The answers to these questions can be formed into a truth table:
|Q1 Answer |Q2 Answer   |Relationship Between A and B|
|---|---|---|
|NO|NO|One to One|
|YES|NO|Many to One|
|NO|YES|One to Many|
|YES|YES|Many to Many|


Directions:

1. When each entity points to the other, the relationship is **bidirectional**. 
2. If only one entity has a pointer to the other, the relationship is said to be **unidirectional**.
3. A bidirectional relationship is considered as a pair of unidirectional relationships.

Mappings
1. X-To-One: Single-Valued Associations
    1. Many-to-one 
        - unidirection
        - idirection
    2. One-to-one 
        - unidirection
        - idirection

2. X-To-Many: Collection-Valued Associations
    1. One-to-many
        - unidirection
        - idirection
    2. Many-to-many
        - unidirection
        - idirection

### 2.3.1 X-To-One

Single-Valued Associations are the source entity refers to at most one target entity: 
- many-to-one
- one-to-one

1. many-to-one is the most common mapping. 
    - E.g., more than one employee works in the same department.
    - A many-to-one mapping is defined by annotating the attribute in the source entity (the attribute that refers to the target entity) with the `@ManyToOne` annotation.
    - Data base term 'foreign key column', in JPA, they're called **join columns**, and the `@JoinColumn` annotation.
    - Many-to-one mappings are always on the owning side of a relationship
        - one of the two sides will have the join column in its table. 
        - `@JoinColumn` is always defined on the owning side of the relationship.
        - The side that does not have the join column is called inverse side. 
    ```java
    @Entity 
    public class Many {
        @ManyToOne
        @JoinColumn(name="many_id")
        private One one;
    }
    ```

2. One-to-One Relationship
    ```java
    @Entity 
    public class SourceOne {
    
        @Id private long id; 
        private String name; 
        
        @OneToOne 
        @JoinColumn(name="PSPACE_ID") 
        private TargetOne targetOne;
    }
    ```

3. Bidirectional One-to-One Mappings
When TargetOne points back to the SourceOne.
    1. either side can be the owner, so the join column might end up being on one side or the other. This would normally be a data modeling decision, not a Java programming decision.
    2. `@JoinColumn` annotation is with owner.
    3. a `mappedBy` element to indicate that the owning side is not here. 
        - The value of `mappedBy` is the name of the attribute in the owning entity that points back to the inverse entity.
        - a bidirectional association cannot have mappedBy on both sides.
        - a bidirectional association, mappedBy cannot absent on both sides. Otherwise the provider would treat each side as an independent unidirectional relationship. This would be fine except that it would assume that each side was the owner and that each had a join column.
    ```java
    @Entity 
    public class TargetOne {

        @Id 
        private long id; 
        
        private int lot; 
        private String location; 
        
        @OneToOne(mappedBy="targetOne") 
        private SourceOne sourceOne;
    }
    ```

### 2.3.2 X-To-Many

Collection-Valued Associations means source entity associated with collection.
- One to many
- Many to many

1. bidirectional One-to-Many Mappings
one-to-many association is almost always **bidirectional** and the “one” side is not normally the owning side. 
    1. The many-to-one side should be the owning side, so the join column should be defined on that side.
    2. the target entities should have many-to-one associations back to the source entity object.
    3.  The target side, or inverse side needs to include the `mappedBy` element.
    4.  Failing to specify the `mappedBy` element in the `@OneToMany` annotation will cause the provider to treat it as a **unidirectional one-to-many** relationship that is defined to use a join table
    ```java
    @Entity 
    public class Target { 
    
        @Id 
        private long id; 
        private String name; 
        
        @OneToMany(mappedBy="source") 
        private Collection<Source> sources;
    }
    ```

2. bidirectional Many-toMany Mappings  
A many-to-many mapping is expressed on both the source and target entities as a `@ManyToMany` annotation on the collection attributes. When a many-to-many relationship is **bidirectional**, both sides of the relationship are many-to-many mappings.
    - The only way to implement a many-tomany relationship is with a separate join table. Each many-to-many relationship must have one.
    - A join table consists simply of two foreign key or join columns to refer to each of the two entity types.
    - The @JoinTable annotation is used to configure the join table for the relationship.
    - no matter which side is designated as the owner, the other side should include the mappedBy element; otherwise, the provider will think that both sides are the owner and that the mappings are separate unidirectional relationships.
    ```java
    @Entity 
    public class SourceMany { 
    
        @Id 
        private long id; 
        private String name; 
        
        @ManyToMany
        @JoinTable(name="SourceMany_TargetMany", 
          joinColumns=@JoinColumn(name="SourceMany_ID"),
          inverseJoinColumns=@JoinColumn(name="TargetMany_ID"))
        private Collection<TargetMany> targetManys;
    }
    ```
    ```java
    @Entity 
    public class TargetMany { 
    
        @Id 
        private long id; 
        private String name; 
        
        @ManyToMany(mappedBy="targetManys") 
        private Collection<SourceMany> SourceManys;
    }
    ```
3. Unidirectional Collection Mappings.  
In two unidirectional collection-valued cases, the source code is similar to the earlier examples, but there is no attribute in the target entity to reference the source entity, and the mappedBy element will not be present in the @OneToMany annotation on the source entity. The join table must now be specified as part of the mapping.
    1. many-to-many mapping
    2. one-to-many mapping  
        - using a join table, 
        - to map a unidirectional mapping without using a join table. It requires the foreign key to be in the target table, or "many" side of the relationship, **even though the target object does not have any reference to the "one" side**. This is called a unidirectional one-to-many target foreign key mapping, because the foreign key is in the target table instead of a join table.
            - not specifying any mappedBy
            - we specify a @JoinColumn annotation on the one-to-many attribute to indicate the foreign key column.
            - the join column that we are specifying applies to the table of the target object, not to the source object

### 2.4 physical annotations

1. `@Table` 
    - default table name is the entity class name.
    - name element: `@Table(name="EMP")`
    - database **schema or catalog**
2. Column Mappings
    - The `@Basic` annotation can be thought of as a logical indication that a given attribute is persistent.
    - A number of annotation elements can be specified as part of @Column, but most of them apply only to schema generation.
    - name element is used when the default column name is not appropriate.
    -` @Column` can be used with `@Id` mappings.
3. `@JoinTable` annotation is a physical annotation and must be defined on the owning side of the relationship.

    Read-Only Mappings using `@Column` and `@JoinColumn` annotations
    1. options to set individual mappings to be read-only using the insertable and updatable elements of the @Column and @JoinColumn annotations
    2. default to true
    3. set to false if we want to ensure that the provider will not insert or update information in the table in response to changes in the entity instance
    4. Even though all of these mappings are not updatable, the entity as a whole could still be deleted.



### 2.5 Building the Domain Model

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
  ```
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

### 2.5  Cascading operation

The cascade attribute, in all the logical relationship annotations (@OneToOne, @OneToMany, @ManyToOne, and @ ManyToMany), defines the list of entity manager operations to be cascaded.

Cascade settings are unidirectional. This means that they must be explicitly set on both sides of a relationship if the same behavior is intended for both situations.

1. Cascade Persist

    ```java
    @Entity 
    public class Employee {
        @ManyToOne(cascade=CascadeType.PERSIST) 
        Address address;
    }
    ```

2. Cascade Remove
this should be applied only in certain cases. There are really only two cases in which cascading the `remove()` operation makes sense: 
    1. one-to-one 
    2. one-to-many (a clear parent-child relationship.)

    we have added the REMOVE cascade in addition to the existing PERSIST option. Chances are, if an owning relationship is safe to use REMOVE, it is also safe to use PERSIST.
    ```java
    @Entity 
    public class Employee {
        @OneToOne(cascade={CascadeType.PERSIST, CascadeType.REMOVE}) 
        ParkingSpace parkingSpace; 
        
        @OneToMany(mappedBy="employee", 
        cascade={CascadeType.PERSIST, CascadeType.REMOVE}) 
        Collection<Phone> phones; 
    }
    ```

### 2.6 bidirection VS unidirection
//todo

The association between a Blog and its Comment instances is best described as a one-to-many relationship. 

Inversely, the relationship between a Comment and its associated Blog is known as a many-to-one association. 

Because each entity is able to reference the other, the association is considered 

**bidirectional**. 
If one entity is able to reference another entity, but the inverse is not true, this is considered a **unidirectional** association.
if you don’t have a specific requirement to use bidirectional associations, it is easier to stick with a unidirectional approach, because bidirectional associations can require circular references and may end up complicating marshaling or serialization implementations.


`mappedBy` hint here to indicate that the inverse side of this relationship is referenced by the artEntities property in the Comment class. For bidirectional many-to-many associations, we need to tell Hibernate which side of the collection is the owner. By adding the mappedBy attribute to the Comment class, we are asserting that the Category class owns the relationship.

Except for the @ManyToOne annotation, all other multiplicity annotations have a mappedBy attribute.

By looking at its value, JPA identifies the attribute that it looks at to manage association between two entities. The side on which mappedBy is used can be seen as a mirror, or read‐only. Setting a value on this mirror property has no effect on creating or removing associations.

the absence of the mappedBy element in the mapping annotation implies ownership of the relationship, while the presence of the mappedBy element means the entity is on the inverse side of the relationship. the mappedBy element is described in subsequent sections.

```java
@Entity @Table(name = "POSTS") 
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;
  
    @Column(name = "title", nullable = false, length = 150) 
    private String title; 
  
    @OneToMany(mappedBy="post") 
    private List<Comment> comments;
}
```
```java
@Entity @Table(name = "COMMENTS") 
public class Comment {
  
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;
    
    @Column(name = "name", nullable = false, length = 150) 
    private String name;
    
    @ManyToOne(optional=false) @JoinColumn(name="post_id") 
    private Post post;

}
```

### 2.7 Second-Level Caching

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

### 2.8 Validation

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


## 3. Define Repositories

Three interfaces in Spring Data API:

1. CrudRepository

2. PagingAndSortingRepository, which extends CrudRepository. Do pagination and sort records.

3. JpaRepository, which extends PagingAndSortingRepository. Provides JPA-related methods, such as flushing the persistence context and deleting records in a batch.


## 4. Queries


## 5. Unit tests


## References 

- [Spring Persistence with Hibernate, 2nd edition](https://www.apress.com/gp/book/9781484202692/)
- [Pro JPA 2 in Java EE 8](https://www.amazon.com/Pro-JPA-Java-Depth-Persistence/dp/1484234197/)
- [Beginning Hibernate, 4th Edition](https://www.amazon.com/Beginning-Hibernate-Joseph-B-Ottinger-ebook/dp/B01MRIXZGP/)
- [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition)