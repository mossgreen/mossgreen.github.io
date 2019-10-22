---
title: Spring Core in Spring Certification
search: true
tags: 
  - Spring
  - Spring Core
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Core in Spring Certification (20%).

## What is dependency injection and what are the advantages?  

**Dependency injection (DI)** is a process whereby objects define their dependencies only through constructor arguments, arguments to a factory method, or properties that are set on the object instance after it is constructed or returned from a factory method. The container then injects those dependencies when it creates the bean

**DI Benefits**
1. Reduced glue boilerplate code, so code is cleaner. 
2. Decoupling is more effective (IOC containers support eager instantiation and lazy loading of services)
3. Easier to test (no singletons or JNDI lookup mechanisms are required in unit tests)
4. Better applications design with DI
5. Increased module reusability.
6. Increased maintainability.
7. Standardizes parts of application development.

**DI exists in two major variants**
1. Constructor-based
    - mandatory dependencies
    - **recommended by Spring**
    - It enables one to implement application components as immutable objects and to ensure that required dependencies are not null.
    - constructor-injected components are always returned to client (calling) code in a fully initialized state
    - Constructor argument resolution matching occurs by using the argument’s type.
    - Too many dependencies implying bad design

2. Setter-based dependency injection
    - should be used for **optional dependencies** that can be assigned reasonable default values
    - use of the `@Required` annotation on a setter method can be used to make the property a required dependency.
    - setter methods make objects of that class amenable to reconfiguration or re-injection later.


## What is an interface and what are the advantages of making use of them in Java?

Interfaces cannot be instantiated and it's a way of implementing multiple inheritance (polymorphism).

**Advantages**
- providing different implementations at runtime, 
- the ability to inject dependencies, and 
- polymorphism.

**Why Interfaces are recommended for Spring beans?**

Spring’s DI implementation is based on two core Java concepts: JavaBeans and interfaces. 
- **JavaBeans** (POJOs): Any Spring-managed resource is referred to as a bean. 
- **Using interfaces** you can get the most out of DI because your beans can utilize any interface implementation to satisfy their dependency. The use of interfaces also allows Spring to utilize JDK dynamic proxies to provide powerful concepts such as AOP for crosscutting concerns.
- Increased testability, by mocking or stubbing
- JDK dynamic proxying
- Easy dependency injection


## What is meant by “application-context"?   

ApplicationContext implements `org.springframework.context.ApplicationContext`.

I'd like to illustrate it by comparing with **BeanFactory**.
- The **BeanFactory** provides the configuration framework and basic functionality.
- The **ApplicationContext** adds more enterprise-specific functionality.

**BeanFactory**
- The `BeanFactory` interface provides an advanced configuration mechanism capable of managing any type of object.
- Spring makes heavy use of the `BeanPostProcessor` extension point (**to effect proxying** and so on)
- To explicitly register a `BeanFactoryPostProcessor` when using a BeanFactory implementation
- **It is not** supporting to integrate AOP services like Security, JTA,... 
- **Beanfactory is lazy initializer**. It can’t create the bean objects at the time of creating IOC container using Beanfactory. It creates the bean objects on demand , when we call the `factory.getBean()`
- Use an `ApplicationContext` **unless** you have a good reason for not doing so. 
  - E.g., the resources of an application are restricted, such as when running Spring for an applet or a mobile device.
  - When using third-party libraries that only allow creating objects using a factory class.

**ApplicationContext**
`ApplicationContext` interface represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the beans.
- `ApplicationContext` is a **sub-interface of BeanFactory**.
- **ApplicationContext is eager initializer**, at the time of creating the IOC container itself it instantiate all the beans which scope is singleton.
- An ApplicationContext implementation provides the following:
  - access to beans using bean factory methods
  - ability to load file resources in a generic way
  - ability to publish events to registered listeners
  - ability to resolve messages and support internationalization (most used in international web applications)
  - application-layer specific contexts such as the `WebApplicationContext` for use in web applications.


## How are you going to create a new instance of an ApplicationContext?

**In standalone applications**
- `ClassPathXmlApplicationContext`: looks for `xxx.xml` **anywhere in the classpath (including JAR files)**.
- `FileSystemXmlApplicationContext`: looks for `xxx.xml` **in a specific location** within the filesystem.
- **`AnnotationConfigApplicationContext`**, is the newest and most flexible implementation.

**Implementations in Web Application**   
`WebApplicationContext` extended `ApplicationContext` which is designed to work with the standard `javax.servlet.ServletContext` so it's able to communicate with the container.

- `AnnotationConfigWebApplicationContext`: Loads a Spring web application context from one or more Java-based configuration classes
- `XmlWebApplicationContext`: Loads context definitions from one or more XML files contained in a web application

**Use AnnotationConfigApplicationContext**
```java
@Configuration 
public class HelloWorldConfiguration {

  @Bean 
  public MessageProvider provider() { 
    return new HelloWorldMessageProvider(); 
  }

  @Bean 
  public MessageRenderer renderer(){

    MessageRenderer renderer = new StandardOutMessageRenderer();
    renderer.setMessageProvider(provider());
    return renderer; 
  }
}

public class HelloWorldSpringAnnotated {

  public static void main(String... args) { 
    ApplicationContext ctx = new AnnotationConfigApplicationContext (HelloWorldConfiguration.class);
    MessageRenderer mr = ctx.getBean("renderer", MessageRenderer.class);

    mr.render(); 
  }
}
```

**Use AnnotationConfigWebApplicationContext** 
```java
public class CourtServletContainerInitializer implements ServletContainerInitializer {

  @Override 
  public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
  
    AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext(); 
    applicationContext.register(CourtConfiguration.class);
  
    DispatcherServlet dispatcherServlet = new DispatcherServlet(applicationContext);
  
    ServletRegistration.Dynamic courtRegistration = ctx.addServlet("court", dispatcherServlet); 
    courtRegistration.setLoadOnStartup(1); courtRegistration.addMapping("/");
  }
}
```


## Can you describe the lifecycle of a Spring Bean in an ApplicationContext?

It’s important to understand the lifecycle of a Spring bean, because you may want to take advantage of some of the opportunities that Spring offers to customize how a bean is created.

**Orders**
1. Spring bean configuration is read and metadata in the form of a **BeanDefinition** object is created for each bean.

2. All instances of **BeanFactoryPostProcessor** are invoked in sequence and are allowed an opportunity to alter the bean metadata.

3. For each bean in the container, **starts creation phase**
    
    1. The beans are **instantiated**: the bean factory is calling the **constructor** of each bean. If the bean is created using **constructor dependency injection**, the dependency bean is created first and then injected where needed.
    
    2. **dependencies are injected via setter**.
    
    3. From this point. Instantiation is completed. Now, **bean post process beans are invoked before initialization**. The preinitialization **BeanPostProcessor** infrastructure beans are consulted to see whether they want to call anything from this bean. These are Spring-specific infrastructure beans that perform bean modifications after they are created. The `@PostConstruct` annotation method is called, which is registered by `CommonAnnotationBeanPostProcessor`.
    
    4. The InitializingBean’s `afterPropertiesSet()` method is invoked by a BeanFactory after it has set all the bean properties supplied and has satisfied BeanFactoryAware and ApplicationContextAware.
    
    5. The `init-method` attribute is executed last because this is the actual initialization method of the bean.

4. Beans are being used

5. Spring application context is to shut down, the beans in it will receive destruction callbacks in this order:
    1. `@PreDestroy`
    2. `destroy()` as defined by the `DisposableBean` callback interface
    3. A custom configured `destroy()` method


**Combining lifecycle mechanisms**
1. `@PostConstruct` and `@PreDestroy` JSR-250 annotations. **Best practice!**
    ```java
    public class Bar {
    
      @PostConstruct 
      public void init() throws Exception { 
        System.out.println("init method is called"); 
      }
      
      @PreDestroy 
      public void destroy() throws RuntimeException { 
        System.out.println("destroy method is called"); 
      }
    }
    ```

2. The `InitializingBean` and `DisposableBean`. Beans can define callback methods, which can be invoked by the container `BeanPostProcessor`. **Do not use!**
    - In `InitializingBean`, container calls `afterproperteisSet()`. 
    - In `DisposableBean`, container calls`destroy()`. 
    ```java
    public class Baz implements InitializingBean, DisposableBean {
    
      @Override 
      public void afterPropertiesSet() throws Exception { 
        System.out.println("init method invoked"); 
      }
    
      @Override 
      public void destroy() throws Exception { 
        System.out.println("destroy method invoked"); 
      }
    }
    ```

3. Custom `init()` and `destroy()` methods from Bean. **Not bad**.
    ```java
    public class Foo {
    
      public void init() { 
        System.out.println("init method is called"); 
      }
      
      public void destroy() { 
        System.out.println("destroy method is called"); 
      }
    }
    ```

![IMAGE](https://i.loli.net/2019/06/12/5d0092044c0cf74240.jpg)


## How are you going to create an ApplicationContext in an integration test test?

`ContextLoader` is a strategy interface for loading an `ApplicationContext` for an integration test managed by the Spring TestContext Framework. 

Its sub-interface  `SmartContextLoader` to provide support for annotated classes, active bean definition profiles, test property sources, context hierarchies, and WebApplicationContext support.

**Implementations of SmartContextLoader**:
- `AnnotationConfigContextLoader`: Loads a **standard ApplicationContext** from annotated classes.
- `AnnotationConfigWebContextLoader`: Loads a **WebApplicationContext** from annotated classes.

**Annotations**
`@WebAppConfiguration` is a class-level annotation that you can use to declare that the ApplicationContext loaded for an integration test should be a WebApplicationContext.

`@ContextConfiguration` defines **class-level metadata** that is used to determine how to load and configure an ApplicationContext for integration tests.

`@DirtiesContext` application context will be reloaded for the **next** test method.

Note that `@WebAppConfiguration` **must be used in conjunction with** `@ContextConfiguration`, either within a single test class or within a test class hierarchy.

```java
@RunWith(SpringRunner.class) 
@WebAppConfiguration 
@ContextConfiguration 
public class MyWebAppTest {
  @Autowired
  private WebApplicationContext wac;
}
```


##  What is the preferred way to close an application context? 

A Spring application has a lifecycle composed of three phases:

1. **Initialization**: In this phase, bean definitions are read, beans are created, dependencies are injected, and resources are allocated, also known as the bootstrap phase. After this phase is complete, the application can be used.

2. **Running**: In this phase, the application is up and running. It is used by clients, and beans are retrieved and used to provide responses for their requests. This is the main phase of the lifecycle and covers 99% of it.

3. **Destruction**: The context is being shut down, resources are released, and beans are handed over to the garbage collector. But some beans work with resources that might refuse to release them if they are not notified before destruction.

When Spring application context is to shut down, the beans receive destruction callbacks in this order:

1. `@PreDestroy`
2. `destroy()` as defined by the `DisposableBean` callback interface
3. A custom configured `destroy()` method.

**However, Spring doesn't fire destruction callbacks automatically.**

For **web application** runs as a servlet, you can simply call `destroy()` in the servlet’s `destroy()` method.

For **stand-alone application**, things are not simple, especially if you have multiple exit points out of your application. 

**Solution**: use `AbstractApplicationContext`’s `registerShutdownHook()` method. The method automatically instructs Spring to register a shutdown hook of the underlying JVM runtime. After it is added, calls to `ctx.destroy()` or `close()` will be removed.

```java
public class DestructiveBeanWithHook {

  public static void main(String... args) {
  
    GenericApplicationContext ctx = new AnnotationConfigApplicationContext( DestructiveBeanConfig.class);
    
    ctx.getBean(DestructiveBeanWithJSR250.class); 
    
    ctx.registerShutdownHook();// no need to call ctx.destroy() or close()
  }
}
```

**How to close applicatoinContext in SpringBoot**

1. SpringBoot registers **shutdown-hook**

2.  call the `close()` method directly using the application context.
    - while closing the application context, the parent context isn’t affected due to separate lifecycles.
    - This destroys all the beans, releases the locks, then closes the bean factory.
    ```java
    ConfigurableApplicationContext ctx = new SpringApplicationBuilder(Application.class).web(WebApplicationType.NONE).run();
    
    ctx.close();
    ```


## Describe dependency injection using Java configuration?

1. Configuration metadata is traditionally supplied in **XML** format.
2. Spring 2.5 introduced support for **annotation-based** configuration metadata.
3. Spring 3.0, many features provided by the Spring **JavaConfig** project became part of the core Spring Framework. **Java configuration** typically uses `@Bean` annotated methods within a `@Configuration` class.

```java
@Configuration 
public class ServiceConfig {

  @Autowired 
  private AccountRepository accountRepository;

  @Bean 
  public TransferService transferService() { 
    return new TransferServiceImpl(accountRepository); 
  }
}

@Configuration 
public class RepositoryConfig {

  private final DataSource dataSource;

  @Autowired //not necessary, since target bean defines only one constructor
  public RepositoryConfig(DataSource dataSource) { 
    this.dataSource = dataSource; 
  }

  @Bean 
  public AccountRepository accountRepository() { 
    return new JdbcAccountRepository(dataSource); 
  }
}

@Configuration 
@Import({ServiceConfig.class, RepositoryConfig.class}) 
public class SystemTestConfig {

  @Bean 
  public DataSource dataSource() { 
    return new DataSource 
  }
}
```


## Describe dependency injection using `@Autowired` annotations? 

`@Component` marks the class as a Java Bean and Spring picks that up and pulls it into the Application context so that it can be injected into `@Autowired` instances.

`@Autowire` is kind of Annotation-based container configuration, is the short version for automatic dependency injection.

**how does Spring know what to inject?**
1. `@Autowired` matches **by type** by default. Additional `@qualifier` will be used among selected cadidates only.
2. JSR-250 `@Resource` annotation, which is semantically defined to identify a specific target component **by its unique name** rather than `@Autowired`.

**`@Autowired` Injection types**
1. constructor
2. “traditional” setter methods, `void setXXX(){}`
3. annotation to methods with **arbitrary names and multiple arguments**
4. field injection
5. field injection of an array of that type
6. Requried by default.`@Autowired(required = false)` means optional.
    - The `'required'` attribute of `@Autowired` is **recommended over** the `@Required` annotation on setter methods.
    - you can express the non-required nature of a particular dependency through Java 8’s `java.util.Optional`.
    ```java
    @Autowired(required = false) 
    public void setMovieFinder(MovieFinder movieFinder) { 
      this.movieFinder = movieFinder; 
    }
    
    @Autowired 
    public void setMovieFinder(Optional<MovieFinder> movieFinder) { }
    ```
7. for interfaces that are well-known resolvable dependencies:   
  `BeanFactory`, `ApplicationContext`, `Environment`, `ResourceLoader`, `ApplicationEventPublisher`, and `MessageSource`. These interfaces and their extended interfaces, such as `ConfigurableApplicationContext` or `ResourcePatternResolver`, are automatically resolved, with **no special setup necessary**.

```java
public class MovieRecommender {

  private Set<MovieCatalog> movieCatalogs;
  
  private final CustomerPreferenceDao customerPreferenceDao;
  
  @Autowired 
  private ApplicationContext context;
  
  @Autowired 
  private MovieCatalog movieCatalog;
  
  @Autowired 
  private MovieCatalog[] movieCatalogs;
  
  @Autowired 
  public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) { 
    this.customerPreferenceDao = customerPreferenceDao; 
  }
  
  @Autowired 
  public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) { 
    this.movieCatalogs = movieCatalogs; 
  }
}
```

**Limitations and disadvantages of autowiring**
1. Explicit dependencies in property and constructor-arg settings always override autowiring.
2. Autowiring is less exact than explicit wiring.
3. Wiring information may not be available to tools that may generate documentation from a Spring container.
4. Multiple bean definitions within the container may match the type specified by the setter method or constructor argument to be autowired.
5. While injecting **Map** type, the key type msut be String.
    ```java
    private Map<String, MovieCatalog> movieCatalogs; 
    @Autowired 
    public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
      this.movieCatalogs = movieCatalogs; 
    }
    ```


## Describe Component scanning

Spring attacks automatic wiring from two angles:

1. **Component scanning** — Spring automatically discovers beans to be created in the application context.

2. **Autowiring** — Spring automatically satisfies bean dependencies.

`@Configuration` classes are meta-annotated with `@Component`, so they are candidates for component-scanning. **But, it's not a sterotype**!
    ```java
     @Target(value=TYPE)
     @Retention(value=RUNTIME)
     @Documented
     @Component
    public @interface Configuration
    ```

Filtering configuration can be added to the `@ComponentScan` annotation as to include or exclude certain classes.
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

`@AliasFor` cannot be used on any stereotype annotations (@Component and its specializations)


## Scopes for Spring beans? What is the default scope?

- Singleton scope: per container, **default bean scope**, **stateless**
- Prototype: each time a bean is request, **stateful**
- Request: Scopes a single bean definition to the lifecycle of an HTTP request, web-aware contexts only
- Session: Scopes a single bean definition to the lifecycle of an HTTP Session, web-aware contexts only
- Application: Scopes a single bean definition to the lifecycle of a ServletContext, web-aware contexts only
- Websocket: Scopes a single bean definition to the lifecycle of a WebSocket, web-aware contexts only
- As of Spring 3.0, a **thread scope** is available but is not registered by default.

### How to inject a prototype-scoped bean into a singleton bean?

Dependencies are resolved at instantiation time!!!

- A new prototype bean is instantiated and then dependency-injected into the singleton bean at the beginning. 
- The prototype instance is the sole instance that is ever supplied to the singletonscoped bean. 
- The injection occurs only once, when the Spring container is instantiating the singleton bean and resolving and injecting its dependencies.

Solutions:

1. ApplicationContextAware

If you need a new instance of a prototype bean at runtime more than once, use **“Method injection”**. Make bean A aware of the container by implementing the `ApplicationContextAware` interface, and by making a `getBean("B")` call to the container ask for (a typically new) bean B instance every time bean A needs it.

2. Lookup Method Injection `@Lookup`

It's used when a singleton depends on a nonsingleton. let the singleton declare a method, the lookup method, which returns an instance of the nonsingleton bean.

```java
@Component
@Scope("prototype")
public class PrototypeDemo { }
```

```java
@Component
public class someServices {
    
    @Lookup("prototypeDemo")
    public PrototypeDemo getThisBean() { }
}
```


## Are beans lazily or eagerly instantiated by default? How do you alter this behavior? 

- **Singleton** beans are **eagerly** instantiated by default. 
- **Prototype** beans are typically created **lazily** when requested.

**Eager**: instantiation and by default loads the bean immediately. 

**`@Lazy`**: postpone the creation of a bean until it is first accessed. By default is true. So `@Lazy(value=true)` equsls to `@Lazy`. **To alter behavior**, set `@Lazy(true)` true of false
- Used on injection points (as `@Autowired`)
- Used on bean definition
    - With `@Component`
    - With `@Bean` along with `@Configuration`

- **Advantage**: it speeds container bootstrap time and has a smaller memory footprint. useful when the dependency is a huge object.
- **Disadvantage**: error remains unnoticed untill using of it

```java
@Service("accountService") 
@Lazy(true) 
public class AccountServiceImpl implements AccountService { }

@Configuration 
public class Ch2BeanConfiguration {

  @Bean 
  @Lazy(true) 
  public AccountService accountService() { 
    AccountServiceImpl bean = new AccountServiceImpl(); 
    return bean; 
  } 
}

// on injection point 
@Repository 
public class JdbcPetRepo extends JdbcAbstractRepo<Pet> implements PetRepo {

  @Lazy
  @Autowired(required=false)
  public void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  } 
}
```


## What is a property source? How would you use @PropertySource?

`@PropertySource` annotation is a facility to load the contents of a `.properties` file (i.e., key-value pairs) to set up bean properties.

1. To read the contents of a properties file (i.e., key-value pairs) to set up bean properties, you can use Spring’s `@PropertySource` annotation with `PropertySourcesPlaceholderConfigurer`. 
    - you can use the` @PropertySource` annotation to convert the key values into a bean inside a Java config class.
    - Once you define the `@PropertySource` annotation to load the properties file, you also need to define a `PropertySourcePlaceholderConfigurer` bean with the `@Bean` annotation to enable the property placeholder resolve mechanism. Spring automatically wires the `demo.properties` file so its properties become accessible as bean properties.
    - throws `IllegalArgumentException`
    
    ```java
    @Configuration 
    @EnableTransactionManagement 
    @EnableJpaRepositories(basePackages="com.demo.repositories") 
    @PropertySource(value = { "classpath:application.properties" }) 
    public class AppConfig { 
    
      @Bean 
      public static PropertySourcesPlaceholderConfigurer placeHolderConfigurer() { 
        return new PropertySourcesPlaceholderConfigurer(); 
      }
    }
    ```
2. If you want to read the contents of any file, you can use Spring’s Resource mechanism decorated with the `@Value` annotation.
    - To define the Java variable values with these values, you make use of the` @Value` annotation with a placeholder expression.
    - The syntax is `@Value("${key:default_value}")`

**@TestPropertySource**  
Class-level annotation annotation for integration test.  Have higher precedence than 
- Property sources loaded from operating system's environment
- Java system properties
- Property sources added by application via `@PropertySource`

NB: inlined properties have higher precedence than properties loaded from resource locations.

```java
@ContextConfiguration
@TestPropertySource(properties = { "timezone = GMT", "port: 4242" })  // inline properties
public class MyIntegrationTests {  }
```


## What is a `BeanFactoryPostProcessor` and what is it used for? When is it invoked?

**BeanFactoryPostProcessor** is for manipulate bean definition. If you want to change the actual bean instances, use **BeanPostProcessor**.

**BeanFactoryPostProcessor** 
- works in the ApplicationContext lifecycle  **Load Bean Definition** step,
- before the container instantiates any beans other than `BeanFactoryPostProcessors` beans,
- they **read**, and potentially **operate** on the bean configuration metadata, or say, bean meta-data, or bean definition.
- A custom `BeanFactoryPostProcessor` can also be used, for example, to register custom property editors.
- You can configure multiple `BeanFactoryPostProcessors`, control the order by implement `ordered` interface.

It's invoked after container is initialized, and bean definition is read, **before anybean is initialized**.

```java
public class CustomBeanFactory implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        for (String beanName : beanFactory.getBeanDefinitionNames()) {

            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);

            // Manipulate the beanDefiniton or whatever you need to do
        }
    }
}
```


### Why would you define a static `@Bean` method?

Static `@Bean` methods are called without creating their containing configuration class as an instance. 

This makes particular sense when defining **postprocessor beans**, e.g. of type:
1. `BeanFactoryPostProcessor` 
    - `PropertySourcesPlaceholderConfigurer` class: is used to process placeholders defined in configuration metadata files or classes and replace those placeholders with the values of properties found in PropertySources. 

2. `BeanPostProcessor`, 

Since such beans will get initialized early in the container lifecycle and should avoid triggering other parts of the configuration at that point.

Calls to **static `@Bean`** methods never get intercepted by the container, because **CGLIB subclassing** can override only non-static methods.

In static` @bean` class, `@Autowired` and `@Value` **do not work** on the class itself, since it is being created as a bean instance too early.


### What is a `PropertySourcesPlaceholderConfigurer` used for?

Add a static bean factory method in the configuration class, which will **enable the property placeholder resolve mechanism**. 

Its bean instance is a **special infrastructural bean** that is used to process placeholders defined in configuration metadata files or classes and replace those placeholders with the values of properties found in PropertySources. Therefore, that bean instance should be instantiated without creating an instance of the configuration class. 

```java
@Bean 
public static PropertySourcesPlaceholderConfigurer propertyPlaceHolderConfigurer() {
  return new PropertySourcesPlaceholderConfigurer();
}
```


## What is a `BeanPostProcessor` and how is it different to a `BeanFactoryPostProcessor`? What do they do? When are they called?

**BeanFactoryPostProcessor** is for manipulate bean definition. If you want to change the actual bean instances, use **BeanPostProcessor**.

**BeanPostProcessor** is an interface that defines callback methods that allow for **modification of bean instances**, like to implement your own (or override the container’s default) instantiation logic, dependency-resolution logic, and so forth. 

1. `postProcessBeforeInitialization()`
2. `postProcessAfterInitialization()`

They're "called" when the Spring IoC container **instantiates a bean**. During the startup for all the singleton and on demand for the proptotypes one, it may even replace a bean instance with, for instance, an AOP. It's scoped per-container.

Example:

Java Configuration and all other annotations: a `AutowiredAnnotationBeanPostProcessor` bean is used to autowire dependencies. This is a **post processor bean** implementation that autowires annotated fields, setter methods, and arbitrary config methods. It is registered by the `@Configuration` annotation, but it can also be registered in mixed configurations by component scanning. This bean takes care of the autowiring configured with `@Autowired`, `@Value`, and` @Inject`.

`@Required` annotation, which is backed by the built-in Spring post-processor `RequiredAnnotationBeanPostProcessor` which checks whether all the bean properties with the `@Required` annotation have been set.

**To write a bean post-processor**

To register a bean post-processor in an application context, just annotate the class with the `@Component` annotation. The application context is able to detect which bean implements the BeanPostProcessor interface and register it to process all other bean instances in the container.

the `postProcessBeforeInitialization()` and `postProcessAfterInitialization()` methods must return the original bean instance even if you don’t do anything in the method.

```java
@Component 
public class AuditCheckBeanPostProcessor implements BeanPostProcessor {

  public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException { 
    System.out.println("In AuditCheckBeanPostProcessor. postProcessBeforeInitialization, processing bean type: " + bean.getClass()); return bean; 
  }
  
  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException { 
    return bean; 
  }
}
```


### What is an initialization method and how is it declared on a Spring bean?

An initialization method is invoked 
1. **after** all properties on the bean have been populated 
2. **before** the bean is taken into use. 
 
Different ways to declare, Spring invokes them in a specific order:

1. Annotating with `@PostConstruct` the method that is **called right after** the bean is instantiated and dependencies injected. The method **must be** invoked before the bean is used, and, like any other initialization method chosen, **may be called only once** during a bean lifecycle. 
    ```java
    public class Bar {

      @PostConstruct 
      public void init() throws Exception { 
        System.out.println("init method is called"); 
      }
      
      @PreDestroy 
      public void destroy() throws RuntimeException { 
        System.out.println("destroy method is called"); 
      }
    }
    ```

2. Implementing the `org.springframework.beans.factory.InitializingBean` interface and providing an implementation for the method `afterPropertiesSet()` (**not recommended !!!**, since it couples the application code with Spring infrastructure).


3. A custom configured `init()` method that specified within the bean configuration file is invoked. The equivalent of the `init-method` attribute when using **Java Configuration** `@Bean(initMethod="...")`

```java
public class BeanOne {
  public void init() { /* initialization logic  */}
}

public class BeanTwo {
  public void cleanup() { /* destruction logic*/ }
}

@Configuration 
public class AppConfig {
  @Bean(initMethod = "init") 
  public BeanOne beanOne() { 
    return new BeanOne(); 
  }

  @Bean(destroyMethod = "cleanup") 
  public BeanTwo beanTwo() { 
    return new BeanTwo(); 
  }
}
```

![IMAGE](https://i.loli.net/2019/05/13/5cd92794f0ebc77453.jpg)


### What is a destroy method, how is it declared and when is it called?

The destroy method is invoked just before the end of a bean's lifetime.

- **singletonscoped beans** are invoked at the shutdown of the whole Spring Container. 
- The destroy methods of **request‐scoped beans** are invoked at the end of the current web request, and 
- the destroy methods of **session‐scoped beans** are invoked at HTTP session timeout or invalidation. 
- **Prototype‐scoped beans** are not tracked after their instantiation; therefore, their destroy methods **cannot be invoked**.

A destroy method will be invoked when the application context is about to close.

Destroy methods are called in the same order:

1. Methods annotated with `@PreDestroy`

2. `destroy()` as defined by the `DisposableBean` callback interface

3. A custom configured `destroy()` method``

**Consider how you enable JSR-250 annotations like `@PostConstruct` and `@PreDestroy`? When/how will they get called?**

When a Spring App uses **annotation-based configuration**, a default `CommonAnnotationBeanPostProcessor` is automatically registered in the application context and **no additional configuration is necessary** to enable `@PostConstruct` and `@PreDestroy`.

`JSR-250` includes `@PostConstruct` and `@PreDestroy`. 

Destroy methods are called in the order:

1. `@PreDestroy` annotation.
2. `destroy()` as defined by the DisposableBean callback interface(not recommanded, coupling with Spring)
3. `destroy Method` element of the `@Bean` annotation.


**How else can you define an initialization or destruction method for a Spring bean? **

Three ways to initialize and three ways of destruction. Details see above.
1. JSR-250: @PostConstruct, @PreDestroy
2. InitializingBean and DisposableBean methods
3. Bean init and destroy methods


## What does component-scanning do?

Component, or classpath, scanning is the process using which the Spring container searches the classpath for classes annotated with **stereotype annotations** and registers bean definitions in the Spring container for such classes.


## What is the behavior of the annotation `@Autowired` with regards to field injection, constructor injection and method injection?

`@Autowired` tries to find a matching bean **by type** and inject it at the place on annotation - that may be a constructor, a method (not only setter, but usually setter) and field.

1. Container examines the type of field
2. Container searches for a bean that matches the type
3. If multiple matching, `@Primary` bean is injected
4. If multiple matching, `@Qualifier` bean might be used
5. If multiple matching, try to **match bean name and filed name**
6. Exception throws if no unique matching
7. `@Autowired` **cannot** be used to autowire primitive values, or Strings. `@Value` specializes in this exactly.

```java
public class MovieRecommender {

  private final CustomerPreferenceDao customerPreferenceDao; 
  
  @Autowired 
  @Qualifier("main")
  private MovieCatalog movieCatalog;  //@Autowired to fields
  
  @Autowired // to constructors
  public MovieRecommender(@Qualifier("second")CustomerPreferenceDao customerPreferenceDao) { 
    this.customerPreferenceDao = customerPreferenceDao; 
  } 
}
```


## What do you have to do, if you would like to inject something into a private field? How does this impact testing?

For private fields: 
1. private fields and setters can be annotated as `@Autowired` and `@Value`
2. use Constructor to initialize

For testing:
1. `@TestPropertySource` allows using either a test-specific property file or customizing individual property values. 
2. Spring framework provides `ReflectionTestUtils`


## How does the `@Qualifier` annotation complement the use of `@Autowired`?

`@Autowired` + `@Qualifier` = `@Resource(name="beanName")`

**`@Qualifier` used at 3 locations: **

1. **Inject Points**. The most basic use of the `@Qualifier` annotation is to specify the name of the Spring bean to be selected the bean to be dependency-injected.
    -  On a field
    -  On a method
        ```java
        @Autowired 
        @Qualifier("iceCream") 
        public void setDessert(Dessert dessert) { 
          this.dessert = dessert; 
        }
        ```
    
    -  On a method argument (before parameter type)
        ```java
        public class MovieRecommender {
          private MovieCatalog movieCatalog; 
          
          @Autowired 
          public void prepare(@Qualifier("main") MovieCatalog movieCatalog) {
            this.movieCatalog = movieCatalog;
          } 
        }
        ```

2. **Bean Definitions**. This will assign a qualifier to the bean and the same qualifier can later be used at an injection point to inject the bean in question.
    1. declare it 
      ```java
    @Component 
    @Qualifier("cold") 
    public class IceCream implements Dessert { 
      return new IceCream();
    }
    ```
    2. use it
    ```java
    @Autowired 
    @Qualifier("cold") 
    public void setDessert(Dessert dessert) { 
      this.dessert = dessert; 
    }
    ```
3. **Annotation Definition**. To create custom qualifier annotations

NB: A scenario that use `@Qualifier` without `@Autowired`. `@Qualifier `can also be used alongside the @Bean annotation when explicitly defining beans with Java configuration
```java
@Component("fooFormatter")
public class FooFormatter { }

@Component
@Qualifier("fooFormatter")
public class FooFormatter { }

@Bean 
@Qualifier("cold") 
public Dessert iceCream() { 
  return new IceCream(); 
}
```


## What is a proxy object and what are the two different types of proxies Spring can create?

Spring provides a subproject, the Spring AOP, which offers a pure Java solution for defining method execution join points on the target object — the **Spring beans** — by employing the **Proxy pattern**. 

The **proxy objects** as the wrappers around the actual objects, so the features can be introduced before, after, or around the method calls of the originator objects. When another object wants to invoke a method on the original object, it will invoke the same method on the proxy object. The proxy object may perform some processing before, optionally, invoking the (same) method on the original object.

Spring framework is able to create two types of proxy objects:
1. **JDK Dynamic Proxy** - **default**: Creates a proxy object that implements all the interfaces

2. **CGLIB Proxy**: Dynamically generates the bytecode for a new class **on runtime** for each proxy, reusing already generated classes wherever possible.

If a Spring bean implements an interface, all the implementation of that interface will be proxied **by the JDK**, and if the bean does not implement any interface, **CGLIB proxyin**g is applied to the concrete class objects. It’s also possible to use the CGLIB proxy mechanism at all times with the configuration.


### What are the limitations of these proxies (per type)?

**Limitations of JDK Dynamic Proxies**

1. Requires the proxied object to implement at least one interface.
2. **Only public methods** found in the implemented interface(s) will be available in the proxy object.
3. Proxy objects must be referenced using an interface type and cannot be referenced using a type of a superclass of the proxied object type.
4. Does not support self-invocations.

**Limitations of CGLIB Proxies**

1. Requires the class of the proxied object to be non-final.
2. Requires methods in the proxied object to be non-final.
3. Does not support self-invocations.
4. Cannot proxy private methods. (public, protected and package-visible are ok)


### What is the power of a proxy object and where are the disadvantages?

**power of a proxy object**
- Add behavior to existing beans. E.g., Transaction management, logging, security.
- Separate concerns. E.g., logging, security etc from business logic.

**Disadvantage of proxy object**
- Proxies can only work from the outside
- proxied objects must be instantiated by the Spring container(not new keyword)
- proxies are not serializable

**advantages of Java Config**
- Type safe assured by IDEs
- Support more complex scenarios compares to XML and annotation based config

**Disadvantages**
- Cannot dynamically change the config you must rebuild the project
- Configuration classes cannot be final. Configuration classes are subclassed by the Spring container using CGLIB and final classes cannot be subclassed.


## What does the `@Bean` annotation do?

The `@Bean` annotation tells Spring that this method will return an object that should be registered as a bean in the Spring application context. 

The `@Bean` annotation together with the method are treated as a **bean definition**, and the method name becomes the bean id.

The body of the method contains logic that ultimately results in the creation of the bean

1. You can trigger autowiring **without** adding the `@autowire` attribute into the` @Bean` annotation.
2. When you place the `@Qualifier` annotation together with the `@Autowired` and `@Bean` annotations, autowiring behavior turns into byName mode


### What is the default bean id if you only use @Bean?  How can you override this? 

The `@Bean` annotation together with the method are treated as a **bean definition**, and the method name becomes the **bean id**.

- Method name is default bean name, or say, **Bean Id**.
- Override it by using `name` or `value` on `@Bean`

```java
 @Bean(name="overrideName")
 public MyBean myBeanDefaultId() {
     return new MyBean();
 }
```


## Why are you not allowed to annotate a final class with `@Configuration`

JavaConfig requires CGLIB subclassing of each configuration class at runtime, so that `@Configuration` classes and their factory methods **must not** be marked as `final` or `private`.

### How do @Configuration annotated classes support singleton beans?

It's singleton scope by default. 

### Why can’t @Bean methods be final either?

CGlib proxying cannot proxy a final class.


## How do you configure profiles? What are possible use cases where they might be useful?

1. JVM argument
2. Environment API
3. PropertySource
4. @Profile

**Details are:**

1. One easy way is to specify them as the` ‐Dspring.profiles.active` JVM argument value.

2. **Most straightforward**, set via `Environment` API.
    The Environment and PropertySource abstraction features in Spring assist developers in accessing various configuration information from the running platform. Environment interface includes:
        - all system properties, 
        - environment variables, and 
        - application properties
    ```java
    // Environment API
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.getEnvironment().setActiveProfiles("development");
    
    // ctx.getEnvironment().setActiveProfiles("profile1", "profile2"); //works with multi profiles
    ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
    ctx.refresh();
    ```

3. For the `PropertySource` abstraction, Spring will access the properties in the following default order
    1. System properties for the running JVM
    2. Environment variables
    3. Application-defined properties
    
    In real life, you seldom need to interact directly with the Environment interface but will use a property placeholder in the form of `${}` (for example, `${application.home}`) and inject the resolved value into Spring beans.

4. Sometimes you need to define beans according to the runtime environment. The `@Profile` are eligible for registration when one or more profiles are active. **Annotation Type Profile** allows for registering different beans depending on differenct conditions. E.g., rewrite `dataSource` configuration.

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
5. In the test class we can activate the development profile by annotating the test class with `@ActiveProfiles` annotation and giving the profile name as argument.
```java
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration(classes = {PetConfigClass.class}) 
@ActiveProfiles("dev") 
public class PetServiceTest { }
```


## Can you use `@Bean` together with `@Profile`? 

- On Class, along with `@Configuration`, inner beans only create when `@profile` conditon is met
- On Class, along with `@Component`, inner beans create when condition met
- On method, along with `@Bean`, bean crates when condition met
- As meta-annotaion, to create custom annotations.


## Can you use @Component together with @Profile?

```java
@Repository
@Profile("dev")
public class UserDAOdb8Impl implements UserDAO {}
```


### How many profiles can you have?

`setActiveProfiles()` accepts `String…` varargs, which is a `String[]`.
In Java, arrays internally use integers for index, the max size is **Integer.MAX_VALUE**.
So theoretically it is **2^31-1 = 2147483647**.


## How do you inject scalar/literal values into Spring beans?

`@Autowired` cannot be used to autowire primitive values, or Strings, `@Value` specializes in this exactly.

It can be used to insert scalar values or can be used together with placeholders and SpEL in order to provide flexibility in configuring a bean.

```java
@Component public class Foo {

  @Value("${fooName}") 
  private String name; 
  
  public String getName() {
    return name; 
  } 
  
  public void setName(String name) {
    this.name = name; }
  } 
```


## What is @Value used for?

The @Autowired, @Inject, **`@Value`**, and @Resource annotations are handled by Spring BeanPostProcessor implementations.

This means that you **cannot** apply these annotations within your own BeanPostProcessor or BeanFactoryPostProcessor types (if any). 

These types **must be** 'wired up' explicitly by using XML or a Spring @Bean method.

- Setting (default) values of bean fields, method parameters and constructor parameters.
- Injecting environment variable values into bean fields, method parameters and constructor parameters.
- Evaluate expressions and inject the result.


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

### What is the difference between `$` and `#` in @Value expressions?

- With `$`, reference a property name in the application’s environment.  
expressions are evaluated by the **PropertySourcesPlaceholderConfigurer** Spring bean prior to bean creation and can **only be** used in `@Value` annnotations.

- With `#`, SpEL


## What is the Environment abstraction in Spring?

The Environment is an abstraction integrated in the container that models two key aspects of the application environment: profiles and properties.

1. **profiles**
A profile is a named, logical group of bean definitions to be registered with the container only if the given profile is active.

2. **properties**.   
Properties may originate from a **variety of sources**: 
    - JVM system properties
    - Operating system environment variables
    - Command-line arguments
    - Application property configuration files

- The Spring `ApplicationContext` interface extends the `EnvironmentCapable` interface, which contain one single method namely the `getEnvironment()`, which returns an object implementing the Environment interface. Thus a Spring application context has a relation to one single Environment object.

```java
ApplicationContext ctx = new GenericApplicationContext(); 
Environment env = ctx.getEnvironment(); 
boolean containsFoo = env.containsProperty("foo"); 
System.out.println("Does my environment contain the 'foo' property? " + containsFoo);

// obtain Environment instance, and set the active profile
ConfigurableEnvironment environment = applicationContext.getEnvironment(); environment.setActiveProfiles("dev");
```

![IMAGE](https://i.loli.net/2019/05/30/5cef836f25c7d51500.jpg)


### Where can properties in the environment come from – there are many sources for properties – check the documentation if not sure. Spring Boot adds even more.

see image above.

- properties files, 
- JVM system properties, 
- system environment variables, 
- JNDI, 
- servlet context parameters, 
- ad-hoc Properties objects, 
- Maps, and so on.

---
Questions removed from mid 2019 study guide update
===


## What is the concept of a “container” and what is its lifecycle?

A container provides an environment in which there are a number of services made available and that perhaps manages objects. 

**Spring IOC container** provides an environment for Spring beans, managing their lifecycle and supplying the services. Two main parts:
1. `org.springframework.beans`
2. `org.springframework.context`
    1. The `BeanFactory` interface provides an advanced configuration mechanism capable of managing any type of object.
    2. `ApplicationContext` is a sub-interface of `BeanFactory`.
    3. In short, the `BeanFactory` provides the configuration framework and basic functionality, and the ApplicationContext adds more enterprise-specific functionality. 

- `ApplicationContext` interface represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the beans. 

**Container Lifecycle**
A Spring application has a lifecycle composed of three phases:

1. **Initialization**. After this phase is complete, the application can be used.
    1. The application context is initialized. 
    
    2. The container reads the bean definitions (configuration data)(from the spring/test-db01-config.xml in this case).
    
    3. The bean definitions are processed (in our case a bean of type PropertyPlaceholderConfigurer is created and used to read the properties from datasource.properties, which are then added to the dataSource bean definition).
    
    4. Beans creation and processing.
        1. In the first stage, the beans are instantiated vis contructor. This basically means that the **bean factory is calling the constructor of each bean.** If the bean is created using constructor dependency injection, the dependency bean is created first and then injected where needed. For beans that are defined in this way, the instantiation stage coincides with the dependency injection stage.
        2. In the second stage, dependencies are injected. For beans that are defined having dependencies **injected via setter**, this stage is separate from the instantiation stage.
        3. The next stage is the one in which **bean post process beans are invoked before initialization**.
        4. In this stage, beans are initialized.
        5. The next stage is the one in which **bean post process beans are invoked after initialization**.

2. **Use**. Beans are used.

3. **Destruction**: The context is being shut down, resources are released, and beans are handed over to the garbage collector.
    1. Application shut down is initialized.
    2. The Spring container is closed.
    3. Destruction callbacks are invoked on the singleton Spring beans in the container.

Initialization lifecycle callback methods are called on all objects regardless of scope, **in the case of prototypes**, configured destruction lifecycle callbacks are not called.

```xml
<!-- test-db01-config.xml contents--> 
<?xml version="1.0" encoding="UTF-8"?> 
<beans ...>
  <bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer"> 
    <property name="locations" value="classpath:db/datasource.properties"/> 
  </bean>
  
  <bean id="dataSource1" class="org.springframework.jdbc.datasource.DriverManagerDataSource"> 
    <property name="driverClassName" value="${driverClassName}"/> 
    <property name="url" value="${url}"/> 
    <property name="username" value="${username}"/> 
    <property name="password" value="${password}"/> 
  </bean> 
</beans>
```
```java
public class ApplicationContextTest {

  private Logger logger = LoggerFactory.getLogger(ApplicationContextTest.class);
  
  @Test 
  public void testDataSource1() {
  
    ConfigurableApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:spring/test-db01-config.xml"); 
    logger.info(" >> init done."); 
    DataSource dataSource1 = ctx.getBean("dataSource1", DataSource.class); 
    assertNotNull(dataSource1); 
    logger.info(" >> usage done."); 
    
    ctx.close();
  }
}
```

![IMAGE](https://i.loli.net/2019/05/29/5cee56ceeb49258816.jpg)

**Get Beans from container**
1. Retrieving Bean by Name
    1. throw `NoSuchBeanDefinitionException`
    2. we have to cast it to the desired type
    ```java
    Object obj = context.getBean("User");
    User = (User) obj;
    ```

2. Retrieving Bean by Name and Type
    ```java
    User user = context.getBean("user", User.class);
    ```
3. Retrieving Bean by Type
    - `NoUniqueBeanDefinitionException`
    ```java
    User user = context.getBean(User.class);
    ```
4. Retrieving Bean by Name with Constructor Parameters. **prototype scope only**
    - `BeanDefinitionStoreException`
    ```java
    User user = = (User) context.getBean("haha", age);
    ```
5. Retrieving Bean by Type With Constructor Parameters. **prototype scope only**
    ```java
    User user = = (User) context.getBean(User.class, user.getName());
    ```
Despite being defined in the BeanFactory interface, the getBean() method is most frequently accessed through the ApplicationContext. Typically, we don’t want to use the getBean() method directly in our program.


## Meta-Annotations?

Annotations that can be applied to definitions of annotations, must be applicable at type level. Example with `@RestController`

Meta-annotations can also be combined to create **composed annotations**. `@RestController` = `@Controller` + `@ResponseBody`.

```java
@Target(ElementType.TYPE) 
@Retention(RetentionPolicy.RUNTIME) 
@Documented 
@Controller 
@ResponseBody 
public @interface RestController {}
```


## References

1. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
2. [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition/)
3. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
4. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
5. [BeanFactoryPostProcessor and BeanPostProcessor in lifecycle events](https://stackoverflow.com/questions/30455536/beanfactorypostprocessor-and-beanpostprocessor-in-lifecycle-events)