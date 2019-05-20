---
title: Spring Core in Spring Certification
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Core in Spring Certification.

## What is dependency injection and what are the advantages?  
Each software component provides a service to other components, and linking the customer and the provider component is the process known as Dependency Injection(DI).

In Spring, it creates the objects, manages them, wiring them together, configures them, as also manages their complete lifecycle.

### Advantages
1. Code is cleaner 
2. Decoupling is more effective (IOC containers support eager instantiation and lazy loading of services)
3. Easier to test (no singletons or JNDI lookup mechanisms are required in unit tests)
4. Better applications design with DI
5. Increased module reusability.
6. Increased maintainability.
7. Standardizes parts of application development.
8. Reduces boilerplate code.

## What is a pattern and an anti-pattern?  
- A software design **pattern** is a general, reusable solution to a commonly occurring problem within a given context in software design.

- An **anti-pattern** is a commonly used template that attempts to solve a type of problem but turns out to be counterproductive and inefficient.

- Both DI and IOC are design patterns

## What is an interface and what are the advantages of making use of them in Java?

Interfaces cannot be instantiated and it's a way of implementing multiple inheritance (polymorphism).

Advantages include providing different implementations at runtime, the ability to inject dependencies, and polymorphism.

### Why Interfaces are recommended for Spring beans?
Spring beans are recommended to be defiend as Interfaces. In the application, they can be implemented by the classes impleting them.

- Increased testability, by mocking or stubbing
- JDK dynamic proxying
- Easy dependency injection

## What is meant by “application-context?   
- The **BeanFactory** interface provides an advanced configuration mechanism capable of managing any type of object. 
- **ApplicationContext** is a sub-interface of BeanFactory
- BeanFactory provides the configuration framework and basic functionality, and the ApplicationContext adds more **enterprise-specific** functionality.

## What is the concept of a “container” and what is its lifecycle?
- A container provides an environment in which there are a number of services made available and that perhaps manages objects. 
- Spring container provides an environment for Spring beans, managing their lifecycle and supplying the services.
-ApplicationContext interface represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the beans. 

### Container Lifecycle
1. Spring container is **created** as the application is started.
2. The container **reads configuration** data.
3. Bean definitions are created from the configuration data.
4. Bean factory **post-processors** processes the bean definitions.
5. Spring **beans are instantiated** by the container using the bean definitions.
6. Spring **beans are configured** and assembled. Property values and dependencies are injected into the beans by the container.
7. **Bean post-processors** processes the beans in the container and any initialization **callbacks** are invoked on the beans.

    Bean post-processors are called both before and after any initialization callbacks are invoked on the bean. See API documentation for the BeanPostProcessor interface for more information.
8. The application runs.
9. Application shut down is initialized.
10. The Spring container is closed.
11. **Destruction callbacks** are invoked on the singleton Spring beans in the container.

## How are you going to create a new instance of an ApplicationContext?

- Non web applications: AnnotationConfigApplicationContext
- Web Applications: Web Application Initializers, XmlWebApplicationContext, AnnotationConfigWebApplicationContext

## Can you describe the lifecycle of a Spring Bean in an ApplicationContext?
1. Spring bean configuration is read and metadata in the form of a **BeanDefinition** object is created for each bean.
2. All instances of **BeanFactoryPostProcessor** are invoked in sequence and are allowed an opportunity to alter the bean metadata.
3. For each bean in the container:
    3.1 Bean instance is created based on bean metadata
    3.2 Bean properties and dependencies are set
    3.3 BeanPostProcessor run: `@PostConstruct`, `afterpropertiesSet()`, `<init-method>`in `<bean>`
    3.4 Bean is ready
4. Beans are being used
5. Spring application context is to shut down, the beans in it will receive destruction callbacks in this order:
  5.1 `@PreDestroy` method
  5.2 Bean implemented `DisposableBean` interface
  5.3 `destroy-method` in `<bean>`

## How are you going to create an ApplicationContext in an integration test test?

```java
@RunWith(SpringRunner.class) // JUnit 4
@ContextConfiguration(classes=MyConfiguration.class) // JUnit 4
@SpringJUnitConfig(classes=MyConfiguration.class) // JUnit 5
@WebAppConfiguration // for web application
public class JUnit4SpringTest {

  @Autowired protected MyBean mMyBean; 
  @Autowired protected ApplicationContext mApplicationContext;
  @Autowired protected WebApplicationContext mWebApplicationContext;
  
  @Test public void contextLoads() {
    final String theMessage = mMyBean.getMessage();
    
    System.out.println("Message from my bean is: " + theMessage);
    System.out.println("Application context: " + mApplicationContext); 
  }
}
```

###  What is the preferred way to close an application context? Does Spring Boot do this for you?

### Standalone Non-Web App
-  Registering a shutdown-hook by calling `registerShutdownHook()`, also implemented in the **AbstractApplicationContext** class.
- `close()`, will close immediately


### Web App
In a web application, closing of the Spring application context is taken care of by the **ContextLoaderListener**, which implements the **ServletContextListener** interface. The ContextLoaderListener will receive a ServletContextEvent when the web container stops the web application.

### SpringBoot
- SpringBoot registers **shutdown-hook**
- SpringBoot also uses **ContextLoaderListener**

## Describe dependency injection using Java configuration?
One bean method should call another bean method.
```java
@Bean
public Foo foo() {
  return new Foo(bar());
}

@Bean
public Bar bar() {
  return new Bar();
}
```

## Describe dependency injection using annotations (@Component, @Autowired)? 
- `@Component` marks the class as a Java Bean and Spring picks that up and pulls it into the Application context so that it can be injected into @Autowired instances.
- `@Autowired` can be applied to constructors, methods, parameters and properties of a class.
- If a bean class contains one single constructor, `@Autowired` is not required.

## Describe Component scanning
- To **enable** component scanning, annotate a configuration class in your Spring application with the `@ComponentScan`. 
- `@Configuration` annotation is annotated with the @Component annotation and thus are Spring Java configuration classes also candidates for auto-detection using component scanning.
- Filtering configuration can be added to the @ComponentScan annotation as to include or exclude certain classes.
- **basePackages**
- **basePackageClasses**
- **includeFilters**
- **includeFilters**

```java
@ComponentScan( 
  basePackages = "...", 
  basePackageClasses = XxxService.class, 
  excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = ".*Repository"),
  includeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = MyService.class))
public class FooApplication(){}
```

## Describe Stereotypes annotations
**Stereotype** annotations are annotations that are applied classes that contains information of **which role Spring beans implemented** by the class fulfills.
- `@Component`
- `@Controller`
- `@RestController`
- `@Service`
- `@Repository`
- `@Configuration`: a configuration class, methods annoated with `@Bean`

## Meta-Annotations?
Annotations that can be applied to definitions of annotations, must be applicable at type level. Example with `@RestController`

```java
@Target(ElementType.TYPE) 
@Retention(RetentionPolicy.RUNTIME) 
@Documented 
@Controller 
@ResponseBody 
public @interface RestController {}
```

## Scopes for Spring beans? What is the default scope?

- Singleton scope: per container, **default bean scope**
- Prototype: each time a bean is request
- Request: per http request, web-aware contexts only
- Session: per http session, web-aware contexts only
- Application: per ServletContext, web-aware contexts only
- Websocket: per WebSocket, web-aware contexts only

## Are beans lazily or eagerly instantiated by default? How do you alter this behavior?   
Eager instantiation and by default loads the bean immediately while lazy loads it on demand.

- Singleton beans are **eagerly instantiated by default**. 
- Prototype beans are typically created lazily when requested.
- Use `@Lazy` annotation to override

## What is a property source? How would you use @PropertySource?
Property source: Abstract base class that represents a source of name value property pairs. E.g.,
  - Spring system properties of the JVM: `System.getProperties()`
  - System environment variables: `System.getenv()`.

`@PropertySource` can be used to add a property source to the Spring environment.
```java 
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```

## What is a BeanFactoryPostProcessor and what is it used for? When is it invoked?
BeanFactoryPostProcessor is an interface that allows for customizing Spring bean meta-data prior to instantiation of the beans in a container.

It's invoked after container is initialized, and bean definition is read, before anybean is initialized.

## Why would you define a static @Bean method?

- Static @Bean methods are called without creating their containing configuration class as an instance. 
- E.g., **post-processor beans**, like `BeanFactoryPostProcessor`, and `BeanPostProcessor` are supposed to initialized early
- Calls to static @Bean methods never get intercepted by the container, because **CGLIB subclassing** can override only non-static methods


## What is a ProperySourcesPlaceholderConfigurer used for?
It is a BeanFactoryPostProcessor that resolves property placeholders, on the `${PROPERTY_NAME}` format, in Spring bean properties and Spring bean properties annotated with the `@Value`. When such a placeholder is encountered the corresponding value from the Spring environment and its property sources, it's injected into the property.

Using property placeholders, Spring bean configuration can be externalized into property files. This allows for changing for example the database server used by an application without having to rebuild and redeploy the application.

## What is a BeanPostProcessor and how is it different to a BeanFactoryPostProcessor? What do they do? When are they called?

- A **BeanFactoryPostProcessor** is an interface that defines callback methods that allow for implementation of code that **modify bean definitions**, bean metadata, but it may not instantiate beans.
  - E.g., `PropertyPlaceholderConfigurer` Allows for using property placeholders in Spring bean properties and replaces these with actual values, typically from a property file.

- A **BeanPostProcessor** is an interface that defines callback methods that allow for **modification of bean instances**. A BeanPostProcessor may even replace a bean instance with, for instance, an AOP proxy.
  - BeanPostProcessors can be registered programmatically using the `addBeanPostProcessor()` method as defined in the `ConfigurableBeanFactory` interface.
  - E.g., `AutowiredAnnotationBeanPostProcessor` Implements support for dependency injection with the `@Autowired` annotation.

## What is an initialization method and how is it declared on a Spring bean?

An initialization method is invoked **after** all properties on the bean have been populated **before** the bean is taken into use.

In the order, different ways to declare:
1. Implementing the `InitializingBean` interface and implementing the `afterPropertiesSet()` method in the bean class.(not recommanded)
2. Annotate it `@PostConstruct`. It may have any visibility, **may not** take any parameters and may only have the **void** return type.
3. Use the `initMethod` element of the @Bean annotation.

![IMAGE](https://i.loli.net/2019/05/13/5cd92794f0ebc77453.jpg)

## What is a destroy method, how is it declared and when is it called?

A destroy method will be invoked when the application context is about to close. 
In the order, different ways to declare:
1. Implementing the `DisposableBean` interface and implementing the `destroy()` method in the bean class.(not recommanded, coupling with Spring)
2. `@PreDestroy` annotation.
3. `destroyMethod` element of the @Bean annotation.

## Consider how you enable JSR-250 annotations like @PostConstruct and @PreDestroy? When/how will they get called?

When a Spring App uses **annotation-based configuration**, a default `CommonAnnotationBeanPostProcessor` is automatically registered in the application context and **no additional configuration is necessary** to enable `@PostConstruct` and `@PreDestroy`.

## How else can you define an initialization or destruction method for a Spring bean? 

Three ways to initialize and three ways of destruction. See above.


## What does component-scanning do?
Component, or classpath, scanning is the process using which the Spring container searches the classpath for classes annotated with stereotype annotations and registers bean definitions in the Spring container for such classes.

## What is the behavior of the annotation @Autowired with regards to field injection, constructor injection and method injection?

@Autowired tries to find a matching bean **by type** and inject it at the place on annotation - that may be a constructor, a method (not only setter, but usually setter) and field.

1. Container examines the type of field
2. Container searches for a bean that matches the type
3. If multiple matching, `@Primary` bean is injected
4. If multiple matching, `@Qualifier` bean might be used
5. If multiple matching, try to **match bean name and filed name**
6. Exception throws if no unique matching


## What do you have to do, if you would like to inject something into a private field? How does this impact testing?

- For private fields: 
   1. private fields and setters can be annotated as `@Autowired` and `@Value`
   2. use Constructor to initialize

- For testing:
  1. `@TestPropertySource` allows using either a test-specific property file or customizing individual property values. 
  2. Spring framework provides `ReflectionTestUtils`

## How does the @Qualifier annotation complement the use of @Autowired?
`@Qualifier` used at 3 locations: 

1. Inject Points. The most basic use of the @Qualifier annotation is to specify the name of the Spring bean to be selected the bean to be dependency-injected.
2. Bean Definitions. This will assign a qualifier to the bean and the same qualifier can later be used at an injection point to inject the bean in question.
3. Annotation Definition. To create custom qualifier annotations.


## What is a proxy object and what are the two different types of proxies Spring can create?

>**A proxy object** is an object that have the same methods, at least the public methods, as the object it proxies.   
**The purpose** of this is to make the proxy indistinguishable from the object it proxies. The proxy object contains a reference to the object it proxies. 
**When** a reference to the original, proxied, object is requested, a reference to the proxy object is supplied. 
**When** another object wants to invoke a method on the original object, it will invoke the same method on the proxy object. The proxy object may perform some processing before, optionally, invoking the (same) method on the original object.

Spring framework is able to create two types of proxy objects:
- **JDK Dynamic Proxy** - **default**: Creates a proxy object that implements all the interfaces
- **CGLIB Proxy**: Creates a subclass of the class

## What are the limitations of these proxies (per type)?
### Limitations of JDK Dynamic Proxies
1. Requires the proxied object to implement at least one interface.
2. Only methods found in the implemented interface(s) will be available in the proxy object.
3. Proxy objects must be referenced using an interface type and cannot be referenced using a type of a superclass of the proxied object type.
4. Does not support self-invocations.

### Limitations of CGLIB Proxies
1. Requires the class of the proxied object to be non-final.
2. Requires methods in the proxied object to be non-final.
3. Does not support self-invocations.
4. Requires a third-party library.(However, it's in Spring Framework)

## What is the power of a proxy object and where are the disadvantages?
### What is the power of a proxy object?
- Add behavior to existing beans. E.g., Transaction management, logging, security.
- Separate concerns. E.g., logging, security etc from business logic.
### Disadvantage of proxy object?
- Proxies can only work from the outside
- proxied objects must be instantiated by the Spring container(not new keyword)
- proxies are not serializable


## What are the advantages of Java Config? What are the limitations?
**advantages of Java Config**
- Type safe assured by IDEs
- Support more complex scenarios compares to XML and annotation based config

**Disadvantages**
- Cannot dynamically change the config you must rebuild the project
- Configuration classes cannot be final. Configuration classes are subclassed by the Spring container using CGLIB and final classes cannot be subclassed.

## What does the @Bean annotation do?
`@Bean` method will instantiate, configure and initialize an object that is to be managed by the Spring container.

### What is the default bean id if you only use @Bean?  How can you override this? 

- Method name is default bean name, or say, **Bean Id**.
- Override it by using `name` or `value` on `@Bean`

```java
 @Bean(name="overrideName")
 public MyBean myBeanDefaultId() {
     return new MyBean();
 }
```

## Why are you not allowed to annotate a final class with @Configuration
JavaConfig requires CGLIB subclassing of each configuration class at runtime, so that @Configuration classes and their factory methods **must not** be marked as `final` or `private`.

### How do @Configuration annotated classes support singleton beans?
It only creates one instance of that bean.

### Why can’t @Bean methods be final either?
CGlib proxying cannot proxy a final class.

## How do you configure profiles? 
**Annotation Type Profile** allows for registering different beans depending on differenct conditions. E.g., rewrite `dataSource` configuration.

```java
@Configuration
@Profile("default") //@Profile({"dev", "qa"}) 
public class DefaultDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .build();
    }
}
```

### Activating Profiles
- **Most straightforward**, set via `Environment` API
- `spring.profiles.active` property, like
    ```yaml
    -Dspring.profiles.active="profile1,profile2"
    ```
- In Integration Tests, use `@ActiveProfiles` in `spring-test` module


```java
// Environment API
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.getEnvironment().setActiveProfiles("development");
// ctx.getEnvironment().setActiveProfiles("profile1", "profile2"); //works with multi profiles
ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
ctx.refresh();
```

### What are possible use cases where profiles might be useful? Can you use @Bean together with @Profile? Can you use @Component together with @Profile?

- On Class, along with `@Configuration`, inner beans only create when `@profile` conditon is met
- On Class, along with `@Component`, inner beans create when condition met
- On method, along with `@Bean`, bean crates when condition met
- As meta-annotaion, to create custom annotations.

### How many profiles can you have?
`setActiveProfiles()` accepts `String…` varargs, which is a `String[]`.
In Java, arrays internally use integers for index, the max size is **Integer.MAX_VALUE**.
So theoretically it is **2^31-1 = 2147483647**.

## How do you inject scalar/literal values into Spring beans?
use `@Value` annotation at constructor arguments, over properties and at setter methods.


### What is @Value used for?
> The @Autowired, @Inject, **`@Value`**, and @Resource annotations are handled by Spring BeanPostProcessor implementations.   
This means that you **cannot** apply these annotations within your own BeanPostProcessor or BeanFactoryPostProcessor types (if any). 
These types **must be** 'wired up' explicitly by using XML or a Spring @Bean method.

- Setting (default) values of bean fields, method parameters and constructor parameters.
- Injecting environment variable values into bean fields, method parameters and constructor parameters.
- Evaluate expressions and inject the result.

```java
@Configuration
@ImportResource("classpath:/com/acme/properties-config.xml")
public class AppConfig {

    @Value("${jdbc.url}")
    private String url;
    
    @Value("#{systemProperties['pop3.port'] ?: 25}")
    private int prot;

    @Value("#{ systemProperties['user.region'] }")
    private String defaultLocale;
    
    @Autowired
    public void configure(MovieFinder movieFinder,
            @Value("#{ systemProperties['user.region'] }") String defaultLocale) {
        this.movieFinder = movieFinder;
        this.defaultLocale = defaultLocale;
    }

    @Bean
    public DataSource dataSource() {
        return new DriverManagerDataSource(url, username, password);
    }
}
```

## What is Spring Expression Language (SpEL for short)?
SpEL is an **expression language** that allows for querying and manipulating an object graph at runtime. 
E.g.,` @Value("#{otherBean.someField}")`

### What can you reference using SpEL?
- Static methods and static properties/fields
- Properties and methods in Spring beans: `@mySuperComponent.injectedValue`
- Properties and methods in Java objects: `#javaObject.firstName`
- (JVM) System properties: `@systemProperties['os.name']`
- System environment properties: `@systemEnvironment['KOTLIN_HOME']`
- Spring application environment: `@environment['defaultProfiles'][0]`

### What is the difference between $ and # in @Value expressions?

- With `$`, reference a property name in the application’s environment.  
expressions are evaluated by the **PropertySourcesPlaceholderConfigurer** Spring bean prior to bean creation and can **only be** used in `@Value` annnotations.
- With `#`, SpEL

## What is the Environment abstraction in Spring?
- The environment interface represents spring abstraction for the environment. 
- Environment deals with profiles and properties from different sources.
- The Spring `ApplicationContext` interface extends the `EnvironmentCapable` interface, which contain one single method namely the `getEnvironment()`, which returns an object implementing the Environment interface. Thus a Spring application context has a relation to one single Environment object.

![IMAGE](https://i.loli.net/2019/05/14/5cda919f103bd21180.jpg)


### Where can properties in the environment come from – there are many sources for properties – check the documentation if not sure. Spring Boot adds even more.

see image above.


## References

1. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
2. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
3. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
