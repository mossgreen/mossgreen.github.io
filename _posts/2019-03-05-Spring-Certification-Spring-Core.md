---
title: Spring Core in Spring Certification
search: true
tags: 
  - Java
toc: false
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Core in Spring Certification.

## What is dependency injection and what are the advantages?  
Each software component provides a service to other components, and linking the customer and the provider component is the process known as Dependency Injection(DI).

In Spring, it creates the objects, manages them, wiring them together, configures them, as also manages their complete lifecycle.

### Advantages:
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

## References

- 1. [what-are-not-2-long-variables-equal-with-operator-to-compare-in-java](https://stackoverflow.com/questions/19485818/what-are-not-2-long-variables-equal-with-operator-to-compare-in-java)
