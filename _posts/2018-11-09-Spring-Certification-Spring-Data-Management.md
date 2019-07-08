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
Spring Data Management in Spring Professional Certification (16%).

## What is the difference between checked and unchecked exceptions?

**Checked exceptions**: Java compiler **requires** to handle. E.g., `Exception`
**Unchecked exceptions**: compiler not require to declare. E.g., `RuntimeException`.

**Why does Spring prefer unchecked exceptions?**

Checked exceptions reqires handling, result in **cluttered code** and **unnecessary coupling**. 
Unchecked exceptions are non recoverable exceptions, should not let developer to handle. E.g., when `SQLException` happens, nothing you can do.

**What is the data access exception hierarchy?**

Each data access technology has its own exception types, such as 
- **SQLException** for direct JDBC access, 
- **HibernateException** used by native Hibernate, or 
- **EntityException** used by JPA 

What Spring does is to handle technology‐specific exceptions and translate them into its own exception hierarchy. The hierarchy is to isolate developers from the particulars of JDBC data access APIs from different vendors.

Spring's `DataAccessException` and sub classes are **unchecked exceptions**. They are part of the `spring-tx` module.  Spring data access exception family has **three main branches**:

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

Spring obtains a connection to the database through a `DataSource`. 

- A DataSource is part of the **JDBC specification** and is a generalized connection factory. 
- It allows a container or a framework to hide connection pooling and transaction management issues from the application code. Implementations in the Spring distribution are meant **only for testing purposes and do not provide pooling**.
- The difference between a **DataSource** and a **Connection** is that a **DataSource** provides and manages Connections.

Spring offers several options for configuring data-source beans in your Spring application, including:
1. Data sources that are defined by a **JDBC driver**
2. Data sources that are looked up by **JNDI**
3. Data sources that pool connections

Some DataSources:
1. DataSourceUtils: is a convenient and powerful helper class that provides static methods to obtain connections from JNDI and close connections if necessary.
2. SmartDataSource: use when you know that you will reuse a connection.
3. AbstractDataSource: you extend the AbstractDataSource class if you are writing your own DataSource implementation.
4. SingleConnectionDataSource: wraps a single Connection that is **not closed after each use**. Obviously, this is **not multi-threading capable**.
5. The DriverManagerDataSource class is an implementation of the standard DataSource interface that configures a plain JDBC driver through bean properties, and returns a new Connection every time.

`DriverManagerDataSource` is the simplest implementation of a DataSource, it **doesn’t support database connection pooling** makes this class unsuitable for anything other than testing.
```java
DriverManagerDataSource dataSource = new DriverManagerDataSource(); dataSource.setDriverClassName("org.hsqldb.jdbcDriver"); dataSource.setUrl("jdbc:hsqldb:hsql://localhost:"); 
dataSource.setUsername("sa"); 
dataSource.setPassword("");
```

### DataSource in an App that deployed to Server, Use JDNI lookup

Benefits:
1. they can be managed completely external to the application, allowing the application to ask for a data source when it’s ready to access the database. Moreover, 
2. data sources managed in an application server are often pooled for greater performance and can be hot-swapped by system administrators.

You can use `JndiObjectFactoryBean` to look up the DataSource from JNDI:

```xml
<!--using the jee namespace (datasource-jee.xml)-->
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
- Although it’s **not very useful in production** settings, an embedded database is a perfect choice **for development and testing** purposes. 
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

**In SpringBoot, obtain a DataSource from embedded data source**

// todo


## What is the Template design pattern.

- Use abstract methods for the different steps, subclasses define all steps
- Alternatively, the class may define default implementations of the different steps of the algorithm, allowing subclasses to customize only selected methods as desired.
- In order to communicate with DB, some default methods includes:
  - establishing connection
  - handling transactions
  - handling excetions
  - clean up and release resource

### What is the JDBC template?

The Spring JdbcTemplate simplifies the use of JDBC by implementing common workflows for **querying**, **updating**, **statement execution** etc. Benefits are:
- Simplification: reduces boilerplate code for operations
- Handle exceptions
- Translates Exception from different vendors, e.g., `DataAccessException`
- Avoids common mistake: release connections
- Allows customization, it's template design pattern
- Thread safe

About JdbcTemplate

- JdbcTemplate works with queries that specify parameters using the `'?'` placeholder.

- Use `queryForObject` when it is expected that execution of the query will return a **single result**.

- Use `RowMapper<T>` when each row of the ResultSet maps to a domain object.

• Use `RowCallbackHandler` when **no value** should be returned.

• Use `ResultSetExtractor<T>` when **multiple rows in the ResultSet map to a single object**.

## What is a callback? 
A callback is code or reference to a piece of code that is passed as an argument to a method that, at some point during the execution of the methods, will call the code passed as an argument.

Spring **converts contents of a ResultSet into domain objects** using a callback approach.

### What are the three JdbcTemplate callback interfaces that can be used with queries? What is each used for?  
(You would not have to remember the interface names in the exam, but you should know what they do if you see them in a code sample).

The three callback interfaces that can be used with queries to extract result data are:
1. `ResultSetExtractor`: processes multiple rows, `extractData()` returns an object.
2. `RowCallbackHandler`: processes row by row, `processRow()` is void. Use when no value should be returned.
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


**DML**  
DML stands for **Data Manipulation Language**, the commands SELECT, INSERT, UPDATE, and DELETE are database statements used to create, update, or delete data from existing tables.

**DDL**   
DDL stands for **Data Definition Language**, used to manipulate database objects: tables, views, cursors, etc. DDL database statements can be executed with JdbcTemplate using the execute method.
```java
public int createTable(String name) {

  jdbcTemplate.execute("create table " + name + " (id integer, name varchar2)" );

  String sql = "select count(*) from " + name;

  return jdbcTemplate.queryForObject(sql, Integer.class); 
}
```

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

- **Atomicity**: **It is the main attribute of a transaction.** Several operations might be performed over data in any transaction. Those operations must all succeed or commit, or, if something goes wrong, none of them should be persisted; in other words, they all must be rolled back. Atomicity is also known as **unit of work**.

- **Consistency**: For a system to have consistency, at the end of an active transaction the underlying database can never be in an inconsistent state. For example, if order items cannot exist without an order, the system won’t let you add order items without first adding an order.

- **Isolation**: Isolation defines how protected your uncommitted data is **to other concurrent transactions**. Isolation levels range from least protective, which offers access to uncommitted data, to most protective, at which no two transactions work at the same time. **Isolation is closely related to concurrency and consistency.** If you increase the level of isolation, you get more consistency but lose concurrency—that is, performance. On the other hand, if you decrease the level, your transaction performance increases, but you risk losing consistency.

- **Durability**: A system has durability when you receive a successful commit message, and you can be sure that your changes are reflected to the system and will survive any system failure that might occur after that time. Basically, when you commit, your changes are permanent and won’t be lost.

### What is the difference between a local and a global transaction?
- **Local transactions** are resource-specic, such as a transaction associated with a JDBC connection.
- **Global transaction** allows to span multiple transactional resources, typically relational databases and message queues.
- Spring resolves the disadvantages of global and local transactions. It lets application developers use a **consistent programming model in any environment**.

## Is a transaction a cross cutting concern? How is it implemented by Spring?

Yes, transaction management is a cross-cutting concern. 

**Declarative transaction management** is **non-invasive**.
**AOP** is used to decorate beans with transactional behavior. This means that when we annotate classes or methods with `@Transactional`, a proxy bean will be created to provide the transactional behavior, and it is wrapped around the original bean. AOP proxies use two infrastructure beans for this:
1. `TransactionInterceptor` 
2. An implementation of `PlatformTransactionManager` interface. E.g., 
    1. DataSourceTransactionManager
    2. HibernateTransactionManager
    3. JpaTransactionManager
    4. JtaTransactionManager
    5. WebLogicJtaTransactionManager
    6. etc

Under the hood: an internal infrastructure Spring-specific bean of type `InfrastructureAdvisorAutoProxyCreator` is registered and acts as a **bean postprocessor** that modifies the service and repository bean to add transaction-specific logic. Basically, this is the bean that creates the transactional AOP proxy.
  
**Programmatic transaction management**   
Although it's a little more tedious to use, it **gives you full control** over the transaction management code. 
Spring Framework provides two ways of implemeting Programmatic Transaction:

1. `TransactionTemplate` class, you just have to encapsulate your code block in a callback class that implements the TransactionCallback<T> interface and pass it to the TransactionTemplate’s execute method for execution.
2. Using a PlatformTransactionManager implementation directly.

```java
public class TransactionalJdbcBookShop extends JdbcDaoSupport implements BookShop {

  private PlatformTransactionManager transactionManager;

  public void setTransactionManager(PlatformTransactionManager transactionManager) { 
  this.transactionManager = transactionManager; 
  }
  
  public void purchase(final String isbn, final String username) { 
  
    TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
  
    transactionTemplate.execute(new TransactionCallbackWithoutResult() {
  
      protected void doInTransactionWithoutResult( TransactionStatus status) {
  
        int price = getJdbcTemplate().queryForObject( "SELECT PRICE FROM BOOK WHERE ISBN = ?", Integer.class, isbn);
    
        getJdbcTemplate().update( "UPDATE BOOK_STOCK SET STOCK = STOCK - 1 WHERE ISBN = ?", isbn );
    
        getJdbcTemplate().update( "UPDATE ACCOUNT SET BALANCE = BALANCE - ? WHERE USERNAME = ?", price, username);
      }
    });
  }
}
```

```
DefaultTransactionDefinition def = new DefaultTransactionDefinition(); // explicitly setting the transaction name is something that can only be done programmatically def.setName("SomeTxName"); def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED); TransactionStatus status = txManager.getTransaction(def); try {

// execute your business logic here } catch (MyException ex) {

txManager.rollback(status);

throw ex; } txManager.commit(status);
```

## How are you going to define a transaction in Spring?

1. **Configure transaction management support**
    1. Using XML and activating it with `<tx:annotation-driven ../>` 
    ```xml
    <beans ...>
      <bean id="transactionManager"  
        class="org.springframework.jdbc.datasource.DataSourceTransactionManager"> 
        <property name="dataSource" ref="dataSource"/>
      </bean>
    </bean>
    ```
    2. Using Java Configuration and enable it with `@EnableTransactionManagement`
    ```java
    public class TestDataConfig {
      @Bean 
      public PlatformTransactionManager txManager(){ 
        return new DataSourceTransactionManager(dataSource()); 
      } 
    }
    ```
    ```java
    @Configuration 
    @EnableTransactionManagement 
    @ComponentScan(basePackages = {"com.ps.repos.impl", "com.ps.services.impl"}) 
    public class AppConfig { }
    ```
2. Declare transactional methods using `@Transactional` 

    ```java
    @Service 
    public class UserServiceImpl implements UserService { 
      @Transactional(propagation = Propagation.REQUIRED, readOnly= true) 
      @Override 
      public User findById(Long id) { 
        return userRepo.findById(id); 
      } 
    }
    ```

## What does `@Transactional` do? 

todo: Annotation driven transaction settings including: mode, proxyTargetClass, order

`@Transactional` is metadata that specifies that an **interface**, **class**, or **method** **must** have transactional semantics.

A list of attributes of `@Transactional`:

1. The **transactionManager** attribute value defines the transaction manager used to manage the transaction in the context of which the annotated method is executed

2. The **readOnly** attribute should be used for transactions that involve operations that **do not modify** the database (example: searching, counting records). **Defalt FALSE**. 

3. The **propagation** attribute can be used to define behavior of the target methods: if they should be executed in an existing or new transaction, or no transaction at all. There are seven propagation types. **Default: PROPAGATION_REQUIRED**.

4. The **isolation** attribute value defines how data modified in a transaction affects other simultaneous transactions. As a general idea, transactions should be isolated. A transaction should not be able to access changes from another uncommitted transaction. There are four levels of isolation, but every database management system supports them differently. **In Spring, there are five isolation values**. DEFAULT: the default isolation level of the DBMS.

5. **timeout**. By default, the value of this attribute is defined by the transaction manager provider, but it can be changed by setting a different value in the annotation: `@Transactional(timeout=3600)` by milliseconds.

6. **rollbackFor**. When this type of exception is thrown during the execution of a transactional method, the transaction is rolled back. By default, i's rolled back only when a **RuntimeException** or **Errors** is thrown. In using this attribute, the rollback can be triggered for checked exceptions as well.

7. **noRollbackFor** attribute values should be one or more exception classes, subclasses of Throwable. When this type of exception is thrown during the execution of a transactional method, the transaction is not rolled back. By default, a transaction is rolled back only when a RuntimeException is thrown. Using this attribute, rollback of a transaction can be avoided for a RuntimeException as well. 

Default settings for **@Transactional**:

- Propagation setting is `PROPAGATION_REQUIRED`.
- Isolation level is `ISOLATION_DEFAULT`.
- Transaction is `read/write`, which is  read only = FALSE.
- Transaction timeout defaults to the default timeout of the underlying transaction system, or to none if timeouts are not supported.
- Any RuntimeException triggers rollback, and any checked Exception does not.


## What is the PlatformTransactionManager?
Spring’s core transaction management abstraction is based on the interface **PlatformTransactionManager**.

- It is the base interface for all transaction managers that can be used in the Spring framework’s transaction infrastructure.
- It encapsulates a set of technology-independent methods for transaction management. 
- Remember that a transaction manager is needed **no matter which transaction management strategy** (programmatic or declarative) you choose in Spring. 

The PlatformTransactionManager interface provides three methods for working with transactions:

1. `getTransaction()`: Return a currently active transaction or create a new one, according to the specified propagation behavior.
2. `commit()`: Commit the given transaction, with regard to its status
3. `rollback`: Perform a rollback of the given transaction

```java
Public interface PlatformTransactionManager(){  

  TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException; 
  
  Void commit(TransactionStatus status) throws TransactionException;  
  
  Void rollback(TransactionStatus status) throws TransactionException;  
} 
```

Implementations of `PlatformTransactionManager` interface. E.g., 
1. DataSourceTransactionManager
2. HibernateTransactionManager
3. JpaTransactionManager
4. JtaTransactionManager
5. WebLogicJtaTransactionManager
6. etc

**Examples**
1. Deal with only a single data source in your application and access it with **JDBC**, use `DataSourceTransactionManager`
    ```java
    @Bean 
    public DataSourceTransactionManager transactionManager() {
    
      DataSourceTransactionManager transactionManager = new DataSourceTransactionManager()
      
      transactionManager.setDataSource(dataSource());
      
      return transactionManager; 
    }
    ```

2. If you are using an object-relational mapping framework to access a database, you should choose a corresponding transaction manager for this framework, such as `HibernateTransactionManager` or `JpaTransactionManager`.

    ```java
    @Bean
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setDataSource(dataSource());
        return transactionManager;
    }
    ```

3. If you are using JTA for transaction management on a Java EE application server, you should use JtaTransactionManager to look up a transaction from the application server. Additionally, JtaTransactionManager is appropriate for distributed transactions (transactions that span multiple resources). Note that while it’s common to use a JTA transaction manager to integrate the application server’s transaction manager, there’s nothing stopping you from using a stand-alone JTA transaction manager such as Atomikos.

![spring-aop-diagram.jpg](https://i.loli.net/2019/06/21/5d0ca922340f859820.jpg)


## Is the JDBC template able to participate in an existing transaction?

Yes, both declarative and programmatic ways, by wrapping the **DataSource** using a `TransactionAwareDataSourceProxy`.

This is a proxy for a target DataSource, which wraps the target DataSource to add awareness of Spring-managed transactions.

## What is a transaction isolation level? How many do we have and how are they ordered?

**Transaction Isolation** is the isolation of one transactions from another. Anwsers the question: are transactions affect each other?

In Spring, there are five isolation values that are defined in the  `org.springframework.transaction.annotation.Isolation` enum:

- `ISOLATION_DEFAULT`: DB default

- `ISOLATION_READ_UNCOMMITED`: It allows this transaction to see data modified by other uncommitted transactions. **Dirty reads**, **NonRepeatable Read** and **Phantom Read**.

- `ISOLATION_READ_COMMITED`: Default for most dbs. It ensures that other transactions are not able to read data that has not been committed by other transactions. However, the data that was read by one transaction can be updated by other transactions. **NonRepeatable Read** and **Phantom Read**.

- `ISOLATION_REPEATABLE_READ`: Ensures that once you select data, you can select at least the same set again. However, if other transactions insert new data, you can still select the newly inserted data. **Phantom Read**.

- `ISOLATION_SERIALIZABLE`: most restrictive, read and write locks.

Higher isolation levels is a reduction of the ability of multiple users and systems concurrently accessing to the resources.

## What is @EnableTransactionManagement for?

Both `@EnableTransactionManagement` and `<tx:annotation-driven ../>` enable all infrastructure beans necessary **for supporting transactional execution**.

Components registered when the `@EnableTransactionManagement` annotation is used are:
- A TransactionInterceptor: calls to @Transactional methods
- A JDK Proxy or AspectJ advice, intercepts methods annotated with `@Transactional`

`@EnableTransactionManagement` and `<tx:annotation-driven/>` only looks for `@Transactional` on beans **in the same application context they are defined in**. This means that, if you put annotation driven configuration in a `WebApplicationContext` for a `DispatcherServlet` it only checks for `@Transactional` beans **in your controllers, and not your services**.

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

**Class level**: 
  1. default for **all methods** of the declaring class 
  2. method level transactional can override some attributes
  2. its **subclasses**
  3. **does not** apply to ancestor classes up the class hierarchy

**Method level**:
  1. Only Public method
  2. protected, private or package-visible methods with the @Transactional annotation, no error is raised, but the annotated method does not exhibit the congured transactional settings.
  3. If you need to annotate non-public methods, consider using AspectJ

**Interface**:
  1. this works only as you would expect it to if you use interface-based proxies
  2. recommends that you annotate only concrete classes and methods


## What does declarative transaction management mean?

For declarative transaction management, Spring only expects you to specify which methods of your Spring‐managed beans will be transactional. 

You can do this via **Java annotations** or from within **XML** configuration files. 

Basically, when those specified methods are called, Spring begins a new transaction, and when the method returns without any exception it commits the transaction; otherwise, it rolls back. Hence, you don’t have to write a single line of transaction demarcation code in your method bodies.

Spring, with its declarative transaction management mechanism, actually helps you define those layers and separates them from each other while each layer solely focuses on its own job without exposing technology‐specific details to upper layers.

**How It Works**
1. The `@EnableTransactionManagement` annotation activates annotation‐based declarative transaction management.

2. Spring Container scans managed beans’ classes for the `@Transactional` annotation.

3. When the annotation is found, it creates a proxy that wraps your actual bean instance.

4. From now on, that proxy instance becomes your bean, and it’s delivered from Spring Container when requested.

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

When you use the `@RunWith(SpringJUnit4ClassRunner.class)` in JUnit 4 or `@ExtendWith(SpringExtension.class)` in JUnit 5, and annotate your `@Test` annotated method with `@Transactional`?

- Test-methods will be executed in a transaction, **and** will roll back after completion.
- The rollback policy of a test can be changed using the `@Rollback` set to false.

## Why is the term "unit of work" so important and why does JDBC AutoCommit violate this pattern?

- The unit of work describes the **atomicity** of transactions. 
- **JDBC AutoCommit** will cause each individual SQL statement as to be executed in its own transaction, which makes it impossible to perform operations that consist of multiple SQL statements as a unit of work.
- JDBC AutoCommit **can be disabled** by calling the `setAutoCommit()` to false on a JDBC connection.

## What does JPA stand for - what about ORM?

JPA: **Java Persistence API**.
ORM: **Object-Relational Mapping**. Mappingg a java entity to SQL database table.

JPA-based applications use an implementation of `EntityManagerFactory` to get an instance of an EntityManager. The JPA specification defines **two** kinds of entity managers:

1. **Application-managed** — Entity managers are created when an application directly requests one from an entity manager factory. This type of entity manager is most appropriate for use in standalone applications that **don’t run in a Java EE container**.

2. **Container-managed** — Entity managers are created and managed by a Java EE container. The application doesn’t interact with the entity manager factory at all. Instead, entity managers are obtained directly through injection or from JNDI. The **container is responsible for configuring the entity manager factories**. This type of entity manager is most appropriate for use by a Java EE container that wants to maintain some control over JPA configuration beyond what’s specified in `persistence.xml`.

Both kinds of entity manager implement the same `EntityManager` interface.

- `LocalEntityManagerFactoryBean` produces an application-managed EntityManagerFactory.
    ```java
    @Bean 
    public LocalEntityManagerFactoryBean entityManagerFactoryBean() {   
      LocalEntityManagerFactoryBean emfb = new LocalEntityManagerFactoryBean(); 
      emfb.setPersistenceUnitName("spitterPU"); 
        return emfb; 
    }
    ```

- `LocalContainerEntityManagerFactoryBean` produces a container-managed EntityManagerFactory.
    ```java
    @Bean 
    public LocalContainerEntityManagerFactoryBean entityManagerFactory( DataSource dataSource, JpaVendorAdapter jpaVendorAdapter) { 
      LocalContainerEntityManagerFactoryBean emfb = new LocalContainerEntityManagerFactoryBean(); 
      emfb.setDataSource(dataSource); 
      emfb.setJpaVendorAdapter(jpaVendorAdapter); 
      return emfb; 
    }
    ```

See "Spring in Action" 4th, 11.2.

JPA has two annotations to obtain container‐managed `EntityManagerFactory` or `EntityManager` instances within Java EE environments.

1. The `@PersistenceUnit` annotation expresses a dependency on an `EntityManagerFactory`, 2. `@PersistenceContext` expresses a dependency on a containermanaged `EntityManager` instance.

- You need to configure: `PersistenceAnnotationBeanPostProcessor` or xml to enalbe
- Both @PersistenceContext and @PersistenceUnit annotations can be used at either the **field** or **method** level. 
- Visibility of those fields and methods doesn’t matter.



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

`@PersistenceUnit` and `@PersistenceContext` aren’t Spring annotations; they’re provided by the JPA specification.

The `@PersistenceUnit` annotation expresses a dependency on an `EntityManagerFactory`, and `@PersistenceContext` expresses a dependency on a containermanaged `EntityManager` instance. 

Both `@PersistenceContext` and `@PersistenceUnit` annotations can be used at either the field or method level. Visibility of those fields and methods doesn’t matter.

A **PersistenceContext** is essentially a Cache, containing a set of domain objects/entities in which for every persistent entity there is a unique entity instance.
  - Default persistence context duration is one single transaction
  - Can be configured 

An **EntityManager** represents a PersistenceContext. The entity manager provides an API for managing a persistence context and interacting with the entities in the persistence context.
  - It does creation, update, querying, deletion

An **EntityManagerFactory** creates and EntityManager and therefore a  PersistenceContext/Cache.
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
    - Simplest:  `LocalEntityManagerFactoryBean`. It produces an application-managed EntityManagerFactory.
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

When the name of the named parameter is the same as the name of the argument in the method annotated with `@Query`, the `@Param` annoation is not needed. 

But if the method argument has a different name, the `@Param` annotation is needed to tell Spring that the value of this argument is to be injected in the named parameter in the query.

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