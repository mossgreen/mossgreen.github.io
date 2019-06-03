---
title: Spring Data Management in Spring Certification
search: true
tags: 
  - Java
  - Spring
  - Spring Data
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Data Management in Spring Professional Certification.

## What is the difference between checked and unchecked exceptions?

**Checked exceptions**: Java compiler **requires** to handle. E.g., `Exception`
**Unchecked exceptions**: compiler not require to declare. E.g., `RuntimeException`

### Why does Spring prefer unchecked exceptions?
Checked exceptions reqires handling, result in **cluttered code** and **unnecessary coupling**. 
E.g., when `SQLException` happens, nothing you can do. 

### What is the data access exception hierarchy?

Each data access technology has its own exception types, such as 
- **SQLException** for direct JDBC access, 
- **HibernateException** used by native Hibernate, or 
- **EntityException** used by JPA 

what Spring does is to handle technology‐specific exceptions and translate them into its own exception hierarchy. The hierarchy is to isolate developers from the particulars of JDBC data access APIs from different vendors.

Spring's `DataAccessException` and sub classes are unchecked exception. They are part of the `spring-tx` module.  Spring data access exception family has **three main branches**:

1. **non-transient** exceptions, `org.springframework.dao.NonTransientDataAccessException`
    - which means that retrying the operation will fail unless the originating cause is fixed.
    - The most obvious example here is searching for an object that does not exist.

2. `RecoverableDataAccessException`
    - when a previously failed operation might succeed if some recovery steps are performed, 
    - usually closing the current connection and using a new one.
    - E.g., a temporary network hiccup

3. **transient** exception, `springframework.dao.TransientDataAccessException`.
    - which means that retrying the operation might succeed without any intervention. 
    - These are **concurrency or latency exceptions**. 
    - For example, when the database becomes unavailable because of a bad network connection in the middle of the execution of a query, an exception of type `QueryTimeoutException` is thrown. The developer can treat this exception by **retrying the query**. 


## How do you configure a DataSource in Spring? Which bean is very useful for development/test databases?

Spring offers several options for configuring data-source beans in your Spring application, including these:
1. Data sources that are defined by a **JDBC driver**
2. Data sources that are looked up by **JNDI**
3. Data sources that pool connections


### DataSource in an App that deployed to Server, Use JDNI lookup

Benefits:
1. they can be managed completely external to the application, allowing the application to ask for a data source when it’s ready to access the database. Moreover, 
2. data sources managed in an application server are often pooled for greater performance and can be hot-swapped by system administrators.

You can use `JndiObjectFactoryBean` to look up the DataSource from JNDI:

```xml
<beans>
    <jee:jndi-lookup id="dataSource" jndi-name="/jdbc/SpitterDS" resource-ref="true" />
</beans>
```

```java
@Bean 
public JndiObjectFactoryBean dataSource() { 
  JndiObjectFactoryBean jndiObjectFB = new JndiObjectFactoryBean();
  jndiObjectFB.setJndiName("jdbc/SpittrDS"); 
  jndiObjectFB.setResourceRef(true); 
  jndiObjectFB.setProxyInterface(javax.sql.DataSource.class); 
  
  return jndiObjectFB; 
}
```

**In SpringBoot, obtain a DataSource from JNDI**
```properties
spring.datasource.jndi-name=java:jdbc/customers
```

### Configure a pooled data source directly in Spring
Although Spring doesn’t provide a pooled data source, plenty of suitable ones are available, including the following open source options:

```java
@Bean public BasicDataSource dataSource() {
  BasicDataSource ds = new BasicDataSource(); 
  ds.setDriverClassName("org.h2.Driver"); 
  ds.setUrl("jdbc:h2:tcp://localhost/~/spitter"); 
  ds.setUsername("sa"); 
  ds.setPassword(""); 
  ds.setInitialSize(5); //the pool to start with five connections
  ds.setMaxActive(10); 
  return ds;
}
```

**In SpringBoot, configure the datasource**
```properties
spring.datasource.hikari.maximum-pool-size=5 
spring.datasource.hikari.minimum-idle=2 
spring.datasource.hikari.leak-detection-threshold=20000
```

### Using JDBC driver-based data sources
- It's simple
- great for **small** applications and running in **development**
- it **doesn’t work well in multithreaded applications** and is best limited to use in testing
- compared to the pooling data-source beans, it doesn’t provide a connection pool, there are no pool configuration properties to set.

```java
@Bean 
public DataSource dataSource() { 
  DriverManagerDataSource ds = new DriverManagerDataSource(); 
  ds.setDriverClassName("org.h2.Driver"); 
  ds.setUrl("jdbc:h2:tcp://localhost/~/spitter"); 
  ds.setUsername("sa"); 
  ds.setPassword(""); 
  return ds; 
}
```

**In SpringBoot**
No need to declare the data source bean. Configure it using `application.properties`
```properties
spring.datasource.url= jdbc:hsqldb:hsql://localhost:1234/mydatabase 
spring.datasource.username=haha spring.datasource.password=secret
```

### Using an embedded data source
- An embedded database runs as part of your application instead of as a separate database server that your application connects to. 
- Although it’s **not very useful in production** settings, an embedded database is a perfect choice for development and testing purposes. 
- That’s because it allows you to populate your database with test data that’s reset every time you restart your application or run your tests.

```java
@Bean 
public DataSource dataSource() { 

  return new EmbeddedDatabaseBuilder() 
    .setType(EmbeddedDatabaseType.H2) 
    .addScript("classpath:schema.sql") 
    .addScript("classpath:test-data.sql") 
    .build(); 
}
```


## What is the Template design pattern.
- Use abstract methods for the different steps, subclasses define all steps
- Alternatively, the class may define default implementations of the different steps of the algorithm, allowing subclasses to customize only selected methods as desired.
- In order to communicate with DB, some default methods includes:
  - establishing connection
  - handling transactions
  - handling excetions
  - clean up and release resource

### what is the JDBC template?
The Spring JdbcTemplate simplifies the use of JDBC by implementing common workflows for **querying**, **updating**, **statement execution** etc. Benefits are:
- Simplification: reduces boilerplate code for operations
- Handle exceptions
- Translates Exception from different vendors, e.g., `DataAccessException`
- Avoids common mistake: release connections
- Allows customization, it's template design pattern
- Thread safe

## What is a callback? 
A callback is code or reference to a piece of code that is passed as an argument to a method that, at some point during the execution of the methods, will call the code passed as an argument.

### What are the three JdbcTemplate callback interfaces that can be used with queries? What is each used for?  
(You would not have to remember the interface names in the exam, but you should know what they do if you see them in a code sample).

The three callback interfaces that can be used with queries to extract result data are:
1. `ResultSetExtractor`: processes multiple rows, `extractData()` returns an object.
2. `RowCallbackHandle`: processes row by row, `processRow()` is void.
3. `Rowmapper`: processes row by row, `mapRow()`returns an object.

## Can you execute a plain SQL statement with the JDBC template?
Yes. With following methods:
- batchUpdate()
- execute()
- query()
- queryForList()
- queryForObject()
- queryForRowSet()
- update()

## When does the JDBC template acquire (and release) a connection - for every method called or once per template? Why?
**Per method called**.
A connection is acquired immediately before executing the operation at hand and released immediately after the operation has completed, be it successfully or with an exception thrown

## How does the JdbcTemplate support generic queries? How does it return objects and lists/maps of objects?

Override load method with various parameters. E.g., queryForList() has 7 types. 

- `queryForObject()`
- `queryForMap()`
- `queryForList()`

## What is a transaction? 
**Transaction**: operate serveral tasks as one unit. Run them all successfully, or reverted. 
Tansaction enforces ACID principle:
- **Atomicity**: Several operations might be performed over data in any transaction. Those operations must all succeed or commit, or, if something goes wrong, none of them should be persisted; in other words, they all must be rolled back. Atomicity is also known as **unit of work**.

- **Consistency**: For a system to have consistency, at the end of an active transaction the underlying database can never be in an inconsistent state. For example, if order items cannot exist without an order, the system won’t let you add order items without first adding an order.

- **Isolation**: Isolation defines how protected your uncommitted data is to other concurrent transactions. Isolation levels range from least protective, which offers access to uncommitted data, to most protective, at which no two transactions work at the same time. **Isolation is closely related to concurrency and consistency.** If you increase the level of isolation, you get more consistency but lose concurrency—that is, performance. On the other hand, if you decrease the level, your transaction performance increases, but you risk losing consistency.

- **Durability**: A system has durability when you receive a successful commit message, and you can be sure that your changes are reflected to the system and will survive any system failure that might occur after that time. Basically, when you commit, your changes are permanent and won’t be lost.

### What is the difference between a local and a global transaction?
- **Local transation** plays one single resource: db, or message broker
- **Global transaction** allows to span multiple transactional resources, like distributed transaction management.
  - Global transactions requires a dedicated transaction manager.

## Is a transaction a cross cutting concern? How is it implemented by Spring?
Yes, transaction management is a cross-cutting concern. 

- **Spring AOP uses Declarative** transaction management, it's **non-invasive**.

- Spring support **Programmatic** transaction management, use **only if** you have a small number of transactional operations. Two ways:
  - `PlatformTransactionManager` implemetation directly
  - `TransactionTemplate`
  
## How are you going to define a transaction in Spring?

1. **Configure transaction management support**: add a declaration of a bean of type `org.springframework.jdbc.datasource.DataSourceTransactionManager`.

```java
public class TestDataConfig {

  @Bean 
  public PlatformTransactionManager txManager(){ 
    return new DataSourceTransactionManager(dataSource()); 
  } 
}
```

2. And we activate it with the `@EnableTransactionManagement` on `@Configuration` class.

```java
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration 
@EnableTransactionManagement 
@ComponentScan(basePackages = {"com.ps.repos.impl", "com.ps.services.impl"}) 
public class AppConfig { }
```

3. Declare transactional methods using `@Transactional` 

```java
@Configuration
@EnableTransactionManagement
public class AppConfig implements TransactionManagementConfigurer {

   @Bean
   public FooRepository fooRepository() {
       // configure and return a class having @Transactional methods
       return new JdbcFooRepository(dataSource());
   }

   @Bean
   public DataSource dataSource() {
       // configure and return the necessary JDBC DataSource
   }

   @Bean
   public PlatformTransactionManager txManager() {
       return new DataSourceTransactionManager(dataSource());
   }

  // bigger applications requiring more than one datasource, multiple transaction manager beans need to be declared.
   @Override
   public PlatformTransactionManager annotationDrivenTransactionManager() {
       return txManager();
   }
}
```

## What does `@Transactional` do? 
`@Transactional` is metadata that specifies that an **interface**, **class**, or **method** **must** have transactional semantics.
Default settings for **@Transactional**:
- Propagation setting is `PROPAGATION_REQUIRED`.
- Isolation level is `ISOLATION_DEFAULT`.
- Transaction is `read/write`.
- Transaction timeout defaults to the default timeout of the underlying transaction system, or to none if timeouts are not supported.
- Any RuntimeException triggers rollback, and any checked Exception does not.


## What is the PlatformTransactionManager?
**PlatformTransactionManager** is the base interface for all transaction managers that can be used in the Spring framework’s transaction infrastructure.

## Is the JDBC template able to participate in an existing transaction?
Yes, both declarative and programmatic ways, by wrapping the **DataSource** using a `TransactionAwareDataSourceProxy`.

## What is a transaction isolation level? How many do we have and how are they ordered?

**Transaction Isolation** is the isolation of one transactions from another. Anwsers the question: are transactions affect each other?

In Spring, there are five isolation values that are defined in the  `org.springframework.transaction.annotation.Isolation` enum:
- DEFAULT: DB default
- READ_UNCOMMITED: dirty reads
- READ_COMMITED: default for most dbs. 
- REPEATABLE_READ: no dirty reads, and **repeatable read**
- SERIALIZABLE: most restrictive, read and write locks.

Higher isolation levels is a reduction of the ability of multiple users and systems concurrently accessing to the resources.

## What is @EnableTransactionManagement for?
Both `@EnableTransactionManagement` and `<tx:annotation-driven ../>` enable all infrastructure beans necessary **for supporting transactional execution**.

Components registered when the @EnableTransactionManagement annotation is used are:
- A TransactionInterceptor: calls to @Transactional methods
- A JDK Proxy or AspectJ advice, intercepts methods annotated with @Transactional

## What does transaction propagation mean?
It is to define behavior of the target methods: if they should be executed in an existing or new transaction, or no transaction at all.

`Spring org.springframework. transaction.annotation.Propagation` enum:
1. REQUIRED: an existing transaction will be used or a new one will be **created** to execute the method annotated with `@Transactional(propagation = Propagation.REQUIRED)`
2. REQUIRES_NEW: always new. If a current transaction exists, it will be **suspended**.
3. NESTED. Use existing one. Otherwaise **create** a new one.
4. MANDATORY. Use existing one. Otherwaise throw **exception**.
5. NEVER. **must not** be executed within a transaction. If a transaction exists, an exception will be thrown.
6. NOT_SUPPORTED: no transaction is used.If a transaction exists, it will be **suspended**.
7. SUPPORTS. If existing, use it. Otherwise, it's ok.

```java
@Service 
public class UserServiceImpl implements UserService {
  
  @Transactional(propagation = Propagation.REQUIRED, readOnly= true)
  @Override public User findById(Long id) { 
  return userRepo.findById(id); 
  } 
}
```

## What happens if one @Transactional annotated method is calling another @Transactional annotated method on the same object instance?
As per the limitation of Spring AOP, a self-invocation of a proxied Spring Bean effectively bypasses the proxy, thus the second method will be excuted in the same transaction with the first. 

## Where can the @Transactional annotation be used? What is a typical usage if you put it at class level?

- `@Transactional` can be used to interface, class and method. However, Spring rocommends using it only to concrete class or methods.
- `@Transactional` on interface works only using interface-based proxies.
- In Spring AOP proxies, **only public** @Transactional methods work. Protect or private method won't work, however no error thrown.

## What does declarative transaction management mean?
Declarative transaction management means that the methods which need to be executed in the context of a transaction and the transaction properties for these methods **are declared, as opposed to implemented**, like connecting to a JTA (Java Transaction API).

##  What is the default rollback policy? How can you override it?
- Default rollback policy: **only** when a `RuntimeException` is thrown.
- Override  it by using `rollbackFor` or `noRollbackFor`.
- E.g., use `rollbackFor`rollback can be triggered for checked exceptions as well.

```java
@Transactional(rollbackFor = MailSendingException.class) 
public int updatePassword(Long userId, String newPass) throws MailSendingException { 
  User u = userRepo.findById(userId); 
  String email = u.getEmail(); 
  sendEmail(email); 
  return userRepo.updatePassword(userId, newPass); 
}

private void sendEmail(String email) throws MailSendingException {
  ... // checked exception
}
```

## What is the default rollback policy in a JUnit test? 
When you use the @RunWith(SpringJUnit4ClassRunner.class) in JUnit 4 or @ExtendWith(SpringExtension.class) in JUnit 5, and annotate your @Test annotated method with @Transactional?

- Test-methods will be executed in a transaction, **and** will roll back after completion.
- The rollback policy of a test can be changed using the `@Rollback` set to false.

## Why is the term "unit of work" so important and why does JDBC AutoCommit violate this pattern?
- The unit of work describes the atomicity of transactions. 
- **JDBC AutoCommit** will cause each individual SQL statement as to be executed in its own transaction, which makes it impossible to perform operations that consist of multiple SQL statements as a unit of work.
- JDBC AutoCommit **can be disabled** by calling the `setAutoCommit()` to false on a JDBC connection.

## What does JPA stand for - what about ORM?
JPA: **Java Persistence API**.

ORM: **Object-Relational Mapping**. Mappingg a java entity to SQL database table.

## What is the idea behind an ORM? What are benefits/disadvantages or ORM?

**Idea**: Developers only work on objects and no need to care about how to maintain the relationship and how they persist.

**ORM Duties**:
  - Data type convertion
  - Maintaining relations between objects
  - JAP Query language to handle vendor spedific SQL

**Benefits**  
  - Developer no need to care about data persistence
  - Facilitates implementing domain model pattern
  - Caching. Reduce load and improve performance
  - Lazy loading of data. Reduce memory usage nad increase ferformance.
  - Keep track of changes
  - Reduce code (and develop time)
  
**Disadvantage**
  - Generated SQL Query low performance
  - Complexity, requires more knowledge
  - Deal with legacy database is difficult
  

## What is a PersistenceContext and what is an EntityManager. What is the relationship between both?
> “A persistence context is a set of entity instances in which for any persistent entity identity there is a unique entity instance. Within the persistence context, the entity instances and their lifecycle are managed.”

- A **PersistenceContext** is essentially a Cache, containing a set of domain objects/entities in which for every persistent entity there is a unique entity instance.
  - Default persistence context duration is one single transaction
  - Can be configured 
- An **EntityManager** represents a PersistenceContext. The entity manager provides an API for managing a persistence context and interacting with the entities in the persistence context.
  - It does creation, update, querying, deletion
- An **EntityManagerFactory** creates and EntityManager and therefore a  PersistenceContext/Cache.
  - Thread safe, shareable, represent a single datasource and persistence context. 

```java
@Repository 
public class JpaUserRepo implements UserRepo {
  private EntityManager entityManager;
  
  @PersistenceContext
  void setEntityManager(EntityManager entityManager) { 
    this.entityManager = entityManager; 
  }
}
```
## Why do you need the @Entity annotation. Where can it be placed?

 `@Entity` marks classes as templates for domain objects, also called entities to database tables.

The `@Entity` annotation can be applied **only** at class level.

```java
@Entity 
@Table(name="P_USER") 
public class User extends AbstractEntity { }
```
## What do you need to do in Spring if you would like to work with JPA?

1. Declare **dependencies**: ORM dependency, db driver dependency, transaction manager dependency.
2. `@Entity` classes
3. Define an **EntityManagerFactory** bean.
    - Simplest:  `LocalEntityManagerFactoryBean`
    - Obtain an `EntityManagerFactory` using JNDI, use **when** app ran in Java EE server
    - Full JPA capabilities: `LocalContainerEntityManagerFactoryBean`
4. Define a `DataSource` bean
5. Define a `TransactionManager` bean
6. Implement repositories

## Are you able to participate in a given transaction in Spring while working with JPA?

Yes you can.

The Spring **JpaTransactionManager** supports direct DataSource access within one and the same transaction allowing for mixing plain JDBC code that is unaware of JPA with code that use JPA. 

If the Spring application is to be deployed to a **JavaEE server**, then `JtaTransactionManager` can be used in the Spring application. 

## Which PlatformTransactionManager(s) can you use with JPA?

First, any JTA transaction manager can be used with JPA since JTA transactions are global transactions, that is they can span multiple resources such as databases, queues etc. Thus JPA persistence becomes just another of these resources that can be involved in a transaction.

When using JPA with one single entity manager factory, the Spring Framework `JpaTransactionManager` is the recommended choice. This is also the **only** transaction manager that is JPA entity manager factory aware.

If the application has **multiple** JPA entity manager factories that are to be transactional, then a JTA transaction manager is **required**.

## What does @PersistenceContext do?
> “Expresses a dependency on a container-managed EntityManager and its associated persistence context.”

The @PersistenceContext annotation is applied to a instance variable of the type EntityManager or a setter method, taking a single parameter of the EntityManager type, into which an entity manager is to be injected.

This field does not need to be autowired, since the @PersistenceContext annotation is picked up by an infrastructure Spring bean postprocessor bean of type org.springframework.

## What do you have to configure to use JPA with Spring? How does Spring Boot make this easier?

see: **What do you need to do in Spring if you would like to work with JPA?**

To use Spring Data components in a JPA project, a dependency on the package spring-data-jpa **must** be introduced.

### JPA in SpringBoot
1. SpringBoot provides a default set fo **dependencies** needed for JPA in starter.
2. Provides all default **Spring beans** needed to use JPA.
3. Provides a number of **default properties** related to persistence and JPA.

## What is an "instant repository"? 
(hint: recall Spring Data)

An instant repository, also known as a **Spring Data repository**.

Because they can be created **instantly** by extending one of the Spring-specialized interfaces

When a custom repository interface extends `JpaRepository`, it will automatically be enriched with functionality to save entities, search them by ID, retrieve all of them from the database, delete entities, flush, etc.

## How do you define an “instant” repository? Why is it an interface not a class?
Under the hood, Spring creates a **proxy** object that is a fullly functioning repository bean. 

Any additional functionality that is not provided by default can be easily implemented by defining a method skeleton and providing the desired functionality using annotations.

## What is the naming convention for finder methods?

`find`**(First[count])**`By`**[property expression][comparison operator][ordering operator]**

## How are Spring Data repositories implemented by Spring at runtime?
For a Spring Data repository a **JDK dynamic proxy** is created which intercepts all calls to the repository. 

The default behavior is to route calls to the default repository implementation, which in Spring Data JPA is the SimpleJpaRepository class.

## What is `@Query` used for?

`@Query` allows for specifying a query to be used with a Spring Data JPA repository method.

```java
public interface UserRepo extends JpaRepository<User, Long> {

  @Query("select u from User u where u.username like %?1%") 
  List<User> findAllByUserName(String username);
  
  // using named parameters
  @Query("select u from User u where u.username= :un") 
  User findOneByUsername(@Param("un") String username);
  
  @Query("select u.username from User u where u.id= :id") 
  String findUsernameById(Long id);
  
  @Query("select count(u) from User u") 
  long countUsers();
}
```

## References

1. [Spring Framework Reference - Data Access](https://docs.spring.io/spring/docs/current/spring-framework-reference/data-access.html)
2. [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html)
3. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
4. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)

