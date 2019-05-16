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
Spring Security is worth 14% of the professional certification.

## What is the difference between checked and unchecked exceptions?

**Checked exceptions**: Java compiler **requires** to handle. E.g., `Exception`
**Unchecked exceptions**: compiler not require to declare. E.g., `RuntimeException`

### Why does Spring prefer unchecked exceptions?
Checked exceptions reqires handling, result in **cluttered code** and **unnecessary coupling**. 
E.g., when `SQLException` happens, nothing you can do. 

### What is the data access exception hierarchy?
`DataAccessException` and sub classes are unchecked exception.

The hierarchy is to isolate developers from the particulars of JDBC data access APIs from different vendors.

## How do you configure a DataSource in Spring? Which bean is very useful for development/test databases?

### DataSource in a standalone app
```java
@Configuration
public class DataSourceConfig {

  @Bean public DataSource dataSource() {
    final BasicDataSource theDataSource = new BasicDataSource();
    
    theDataSource.setDriverClassName("org.hsqldb.jdbcDriver");
    theDataSource.setUrl("jdbc:hsqldb:hsql://localhost:1234/mydatabase");
    theDataSource.setUsername("demo");
    theDataSource.setPassword("secret"); 
    
    return theDataSource;
  }
}
```
**In SpringBoot**
No need to declare the data source bean. Configure it using `application.properties`
```yaml
spring.datasource.url= jdbc:hsqldb:hsql://localhost:1234/mydatabase spring.datasource.username=ivan spring.datasource.password=secret
```

### DataSource in an App that deployed to Server
Use JDNI lookup

```xml
<beans>
    <jee:jndi-lookup id="myDataSource" jndi-name="java:comp/env/jdbc/myds"/>
</beans>
```

```java
@Bean 
public DataSource dataSource() { 
  final JndiDataSourceLookup theDataSourceLookup = new JndiDataSourceLookup(); 
  final DataSource theDataSource = theDataSourceLookup.getDataSource("java:comp/env/jdbc/MyDatabase");
  
  return theDataSource; 
}
```

**In SpringBoot**
```
spring.datasource.jndi-name=java:comp/env/jdbc/MyDatabase
```

## What is the Template design pattern.
- Use abstract methods for the different steps, subclasses define all steps
- Alternatively, the class may define default implementations of the different steps of the algorithm, allowing subclasses to customize only selected methods as desired.
- In order to communicate with DB, some default methods includes:
  - establishing connection
  - handling transactions
  - handling excetions
  - clean up and release resource

###what is the JDBC template?
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
1. ResultSetExtractor: processes multiple rows, `extractData()` returns an object.
2. RowCallbackHandle: processes row by row, `processRow()` is void.
3. Rowmapper: processes row by row, `mapRow()`returns an object.

## Can you execute a plain SQL statement with the JDBC template?
Yes. With following methods:
- batchUpdate()
- execute
- query
- queryForList
- queryForObject
- queryForRowSet
- update

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
- Atomicity: all or nothing
- Consistency
- Isolation
- Durability

### What is the difference between a local and a global transaction?
- **Local transation** plays one single resource: db, or message broker
- **Global transaction** allows to span multiple transactional resources.
  - Global transactions requires a dedicated transaction manager.

## Is a transaction a cross cutting concern? How is it implemented by Spring?
Yes, transaction management is a cross-cutting concern. 
- **Spring AOP uses Declarative** transaction management, it's **non-invasive**.
- Spring support **Programmatic** transaction management, use **only if** you have a small number of transactional operations. Two ways:
  - `PlatformTransactionManager` implemetation directly
  - `TransactionTemplate`
  
## How are you going to define a transaction in Spring?
1. Declare a `PlatformTransactionManager` bean.
2. `@EnableTransactionManagement` on `@Configuration` class.
3. `@Transactional` to declare transaction boundaries.

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

● What is @EnableTransactionManagement for?
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


## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
