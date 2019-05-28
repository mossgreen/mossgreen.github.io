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

Answer some questions before the test.


## What are the modules of Spring Framework?

![IMAGE](https://i.loli.net/2019/05/27/5ceb8556e1a0161486.jpg)

### Core Container

- spring-core, 
- spring-beans, 
- spring-context, (`ApplicationContext`)
- springcontext-support, and 
- spring-expression (Spring Expression Language)

The `spring-core` and `spring-beans` modules provide the fundamental parts of the framework, including the **IoC** and **Dependency Injection** features.

### Data Access/Integration

- JDBC, 
- ORM, 
- OXM, (Object/XML mapping)
- JMS, (contains features for **producing** and **consuming messages**) 
- Transaction modules.

### Web

- spring-web, 
- spring-webmvc and 
- spring-websocket
- Portlet


## What types of Dependency injection does spring supports?

Dependency injection is a process whereby objects define their dependencies, that is, the other objects they work with, only through 
- constructor arguments, 
- arguments to a factory method, or 
- properties 

that are set on the object instance after it is constructed or returned from a factory method.

### Constructor argument resolution   
Constructor-based DI is accomplished by the container invoking **a constructor with a number of arguments, each representing a dependency**.


```java
public class SimpleMovieLister {

// the SimpleMovieLister has a dependency on a MovieFinder 
private MovieFinder movieFinder;

// a constructor so that the Spring container can inject a MovieFinder 
public SimpleMovieLister(MovieFinder movieFinder) { this.movieFinder = movieFinder; }

// business logic that actually uses the injected MovieFinder is omitted...
}
```

### Setter-based dependency injection

Setter-based DI is accomplished by the container calling setter methods on your beans after invoking **a no-argument constructor** or** no-argument static factory method** to instantiate your bean.

```java
public class SimpleMovieLister {

// the SimpleMovieLister has a dependency on the MovieFinder 
private MovieFinder movieFinder;

// a setter method so that the Spring container can inject a MovieFinder 
public void setMovieFinder(MovieFinder movieFinder) { this.movieFinder = movieFinder; }

// business logic that actually uses the injected MovieFinder is omitted...
}
```

### comparison

- The Spring team generally advocates constructor injection as it enables one to implement application components as **immutable objects** and to ensure that **required dependencies are not null**. 
- Furthermore constructor-injected components are always returned to client (calling) code in a **fully initialized state**. 
- As a side note, a large number of constructor arguments is a bad code smell, implying that the class likely has too many responsibilities and should be refactored to better **address proper separation of concerns**.
- Setter injection should primarily only be used for **optional dependencies** that can be assigned reasonable default values within the class.


## What is the dependency resolution process? 

1. The ApplicationContext is created and initialized with configuration metadata that describes all the beans. Configuration metadata can be specified via XML, Java code, or annotations.

2. For each bean, its dependencies are expressed in the form of properties, constructor arguments, or arguments to the static-factory method if you are using that instead of a normal constructor. These dependencies are provided to the bean, when the bean is actually created.

3. Each property or constructor argument is an actual definition of the value to set, or a reference to another bean in the container.


- The Spring container validates the **configuration of each bean** as the **container is created**. 
- However, the bean **properties** themselves are **not set until the bean is actually created**. 
- Beans that are singletonscoped and set to be pre-instantiated (the default) are created when the container is created. 



## What are the IoC containers in Spring?
see my blog: Spring Core in Spring Certification


## By default a bean is lazily loaded. <-- False

- By default, ApplicationContext implementations **eagerly** create and configure all singleton beans as part of the initialization process. 
- By default a bean is **eagerly** loaded.
- A lazy-initialized bean tells the IoC container to create a bean instance when it is first requested, rather than at startup.


## Which class can be used to call Stored Procedures in spring? SimpleJdbcCall

1. **JdbcTemplate** is the classic Spring JDBC approach and the most popular. This "lowest level" approach and all others use a JdbcTemplate under the covers.

2. **NamedParameterJdbcTemplate** wraps a JdbcTemplate to provide named parameters instead of the traditional JDBC "?" placeholders. This approach provides better documentation and ease of use when you have multiple parameters for an SQL statement.

3. **SimpleJdbcInsert** and **SimpleJdbcCall** optimize database metadata to limit the amount of necessary configuration. This approach simplifies coding so that you only need to provide the **name of the table or procedure** and provide a map of parameters matching the column names.

4. RDBMS Objects including **MappingSqlQuery**, **SqlUpdate** and **StoredProcedure** requires you to create reusable and thread-safe objects during initialization of your data access layer.

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


## What is Spring’s XML-based configuration? 

Inject data/value to `<property/>` and `<constructorarg/>`

### Straight values (primitives, Strings, and so on)

```xml
<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close"> 
  <!-- results in a setDriverClassName(String) call --> 
  <property name="driverClassName" value="com.mysql.jdbc.Driver"/> 
  <property name="url" value="jdbc:mysql://localhost:3306/mydb"/> 
  <property name="username" value="root"/> 
  <property name="password" value="masterkaoli"/> 
</bean>
```

### idref element  
Pass the id (string value - not a reference) of another bean in the container to a `<constructor-arg/>` or `<property/>` element.

```xml
<bean id="theTargetBean" class="..."/>

<bean id="theClientBean" class="..."> 
  <property name="targetName"> 
    <idref bean="theTargetBean" /> 
  </property>
</bean>
```

### Inner beans

```xml
<bean id="outer" class="..."> 
  <!-- instead of using a reference to a target bean, simply define the target bean inline --> 
  <property name="target"> 
    <bean class="com.example.Person"> <!-- this is the inner bean --> 
      <property name="name" value="Fiona Apple"/> 
      <property name="age" value="25"/> 
    </bean> 
  </property> 
</bean>
```
### Collections

- `<list/>`, type **List**
- `<set/>`, type **Set**
- `<map/>`, and type **Map**
- `<props/>` type **Properties**

**Inject properteis**
```xml
<bean id="moreComplexObject" class="example.ComplexObject"> 
  <!-- results in a setAdminEmails(java.util.Properties) call --> 
  <property name="adminEmails"> 
    <props> 
      <prop key="administrator">administrator@example.org</prop> 
      <prop key="support">support@example.org</prop> 
      <prop key="development">development@example.org</prop> 
    </props> 
  </property>
</bean>
```

### Null and empty string values

- Spring treats empty arguments for properties and the like as empty Strings. 
The following configurations are equal.

    ```xml
    <bean class="ExampleBean"> 
      <property name="email" value=""/> 
    </bean>
    ```
    ```java
    exampleBean.setEmail("");
    ```
- The **`<null/>`** element handles null values.   
The following configurations are equal.

    ```xml
    <bean class="ExampleBean"> 
      <property name="email"> 
        <null/> 
      </property> 
    </bean>
    ```
    ```java
    exampleBean.setEmail(null);
    ```


## What is XML-based Autowire?

Four types: **no**, **byName**, **byType**, **constructor**.

1. **`no`**. 
  - **Default**
  - No autowiring. 
  - Bean references **must** be defined via a ref element. 
  - Changing the default setting is **not recommended** for larger deployments, because specifying collaborators explicitly gives greater control and clarity. 
  - To some extent, it documents the structure of a system
  
2. **`byName`**
  - Autowiring by property name. 
  - Spring looks for a bean with the same name as the property that needs to be autowired.
  For example, if a bean definition is set to autowire by name, and it contains a master property (that is, it has a setMaster(..) method), Spring looks for a bean definition named master, and uses it to set the property

3. **`byType`**
  - Allows a property to be autowired **if exactly** one bean of the property type exists in the container. 
  - If more than one exists, a fatal exception is thrown, which indicates that you may not use byType autowiring for that bean. 
  - If there are no matching beans, nothing happens; the property is not set.
  - Can wire arrays and **typed-collections**. In such cases all autowire candidates within the container that match the expected type are provided to satisfy the dependency.
  
4. **`constructor`**   
  - Analogous to `byType`, **but** applies to constructor arguments. 
  - If there is not exactly one bean of the constructor argument type in the container, a fatal **error** is raised
  

- **Excluding** a bean from autowiring, by setting its `autowire-candidate` attributes to false as described in the next section.


## What is A-O-P stands for in Spring?

**Spring IoC container **does not** depend on AOP.**

**Aspect**: 
- a modularization of a concern that cuts across multiple classes. 
- Transaction management is a good example of a crosscutting concern in enterprise Java applications. 
- In Spring AOP, aspects are implemented using regular classes (the schema-based approach) or regular classes annotated with the @Aspect annotation (the @AspectJ style).

**Join point**:
- a point **during the execution of a program**, such as the execution of a method or the handling of an exception. 
- In Spring AOP, a join point **always represents a method execution**.

**Advice**: 
- **action** taken by an aspect at a particular join point. 
- Many AOP frameworks, including Spring, model an advice as an interceptor, maintaining a chain of interceptors around the join point. 
- Typese of advice:
  - Before advice
  - After returning advice
  - After throwing advice
  - After (finally) advice
  - Around advice

**Pointcut**: 
- a predicate that matches join points. 
- Advice is associated with a pointcut expression and runs at any join point matched by the pointcut (for example, the execution of a method with a certain name). 
- The concept of join points as matched by **pointcut expressions is central to AOP**, and Spring uses the AspectJ pointcut expression language by default.
    ```java
    execution(public * com.ps.repos.*.JdbcTemplateUserRepo+.findById(..))
    ```

**Introduction**:
- declaring additional methods or fields on behalf of a type. 
- Spring AOP allows you to introduce new interfaces (and a corresponding implementation) to any advised object. For example, you could use an introduction to make a bean implement an IsModified interface, to simplify caching.
  > An introduction allows you to add new methods or attributes to existing classes.

**Target object**: 
- object being advised by one or more aspects. 
- object to which the aspect applies.
- Also referred to as the advised object. 
- Since Spring AOP is implemented using runtime proxies, this object will **always be a proxied object**.

**AOP proxy**: 
- an object created by the AOP framework in order to implement the aspect contracts (advise method executions and so on). 
- In the Spring Framework, an AOP proxy will be a **JDK dynamic proxy** or a **CGLIB proxy**.

**Weaving**: 
- linking aspects with other application types or objects to create an advised object. 
- This can be done at **compile time (using the AspectJ compiler**, for example), load time, or at runtime. 
- **Spring AOP**, like other pure Java AOP frameworks, performs **weaving at runtime**.


```java
@Repository("userTemplateRepo") 
public class JdbcTemplateUserRepo implements UserRepo { 

  @Override
  public int updateUsername(Long userId, String username) { 
    String sql = "update p_user set username=? where ID = ?"; 
    updateDependencies(userId); 
    return jdbcTemplate.update(sql, username, userId); 
  }
  
  @Override 
  public int updateDependencies(Long userId) {
    //mock method to test the proxy nature
    return 0; 
  }
}
```

**Pointcutcontainer.java**
```java
public class PointcutContainer {

  @Pointcut("execution( * com.ps.repos.*.*UserRepo+.update*(..))") 
  public void proxyBubu() {}
}
```

**UserRepoMonitor.java**
```java
@Aspect 
@Component 
public class UserRepoMonitor { 

  @Before("com.ps.aspects.PointcutContainer.proxyBubu()")
  public void bubuHappens(JoinPoint joinPoint) throws Throwable {
    String methodName = joinPoint.getSignature().getName();
    String className = joinPoint.getSignature().getDeclaringTypeName();
  } 
}
```