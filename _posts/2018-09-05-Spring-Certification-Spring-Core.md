---
title: Spring Core in Spring Certification
search: true
tags: 
  - Java
  - Spring
  - Spring Core
  - Spring Professional
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Core in Spring Certification (20%).

## What is dependency injection and what are the advantages?  

Each software component provides a service to other components, and linking the customer and the provider component is the process known as Dependency Injection(DI).

In Spring, it creates the objects, manages them, wiring them together, configures them, as also manages their complete lifecycle.

DI exists in two major variants, 
**Constructor-based**
  - mandatory dependencies
  - The **Spring team generally advocates constructor injection** as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null.
  - constructor-injected components are always returned to client (calling) code in a fully initialized state

**Setter-based** dependency injection
  - optional dependencies
  - use of the `@Required` annotation on a setter method can be used to make the property a required dependency.
  - setter methods make objects of that class amenable to reconfiguration or re-injection later.

**Advantages**
1. Reduced glue boilerplate code, so code is cleaner. 
2. Decoupling is more effective (IOC containers support eager instantiation and lazy loading of services)
3. Easier to test (no singletons or JNDI lookup mechanisms are required in unit tests)
4. Better applications design with DI
5. Increased module reusability.
6. Increased maintainability.
7. Standardizes parts of application development.


## What is an interface and what are the advantages of making use of them in Java?

Interfaces cannot be instantiated and it's a way of implementing multiple inheritance (polymorphism).

Advantages
- providing different implementations at runtime, 
- the ability to inject dependencies, and 
- polymorphism.

**Why Interfaces are recommended for Spring beans?**
>Spring beans are recommended to be defiend as Interfaces. In the application, they can be implemented by the classes impleting them.

- Increased testability, by mocking or stubbing
- JDK dynamic proxying
- Easy dependency injection


## What is meant by “application-context"?   
I'd like to illustrate it by comparing with **BeanFactory**.

Both `org.springframework.beans` and `org.springframework.context` packages are the basis for Spring Framework’s IoC container.

- The **BeanFactory** provides the configuration framework and basic functionality.
- The **ApplicationContext** adds more enterprise-specific functionality.

**BeanFactory**
- The `BeanFactory` interface provides an advanced configuration mechanism capable of managing any type of object.
- Spring makes heavy use of the `BeanPostProcessor` extension point (**to effect proxying** and so on)
- To explicitly register a `BeanFactoryPostProcessor` when using a BeanFactory implementation
- **It is not** supporting to integrate AOP services like Security, JTA,... 
- **Beanfactory is lazy initializer**. It can’t create the bean objects at the time of creating IOC container using Beanfactory . It creates the bean objects on demand , when we call the `factory.getBean()`
- Use an `ApplicationContext` **unless** you have a good reason for not doing so. 
  - E.g., the resources of an application are restricted, such as when running Spring for an applet or a mobile device.
  - When using third-party libraries that only allow creating objects using a factory class.


**ApplicationContext**
- `ApplicationContext` is a **sub-interface of BeanFactory**.
- **ApplicationContext is eager initializer**, at the time of creating the IOC container itself it instantiate all the beans which scope is singleton.
- An ApplicationContext implementation provides the following:
  - access to beans using bean factory methods
  - ability to load file resources in a generic way
  - ability to publish events to registered listeners
  - ability to resolve messages and support internationalization (most used in international web applications)
  - application-layer specific contexts such as the `WebApplicationContext` for use in web applications.

- Implementations in standalone applications
  - `ClassPathXmlApplicationContext`: looks for `xxx.xml` **anywhere in the classpath (including JAR files)**.
  - `FileSystemXmlApplicationContext`: looks for `xxx.xml` **in a specific location** within the filesystem.
  - **`AnnotationConfigApplicationContext`**, is the newest and most flexible implementation.

- In Web Application, `WebApplicationContext` extended `ApplicationContext` which is designed to work with the standard `javax.servlet.ServletContext` so it's able to communicate with the container.

```java
public interface WebApplicationContext extends ApplicationContext {
    ServletContext getServletContext();
}
```

Beans, instantiated in `WebApplicationContext` will also be able to use `ServletContext` if they implement `ServletContextAware` interface

```java
package org.springframework.web.context;
public interface ServletContextAware extends Aware { 
     void setServletContext(ServletContext servletContext);
}
```

- `AnnotationConfigWebApplicationContext`: Loads a Spring web application context from one or more Java-based configuration classes
- `XmlWebApplicationContext`: Loads context definitions from one or more XML files contained in a web application


## What is the concept of a “container” and what is its lifecycle?

A container provides an environment in which there are a number of services made available and that perhaps manages objects. 
- **Spring IOC container** provides an environment for Spring beans, managing their lifecycle and supplying the services.
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


## How are you going to create a new instance of an ApplicationContext?

- Implementations in standalone applications
  - `ClassPathXmlApplicationContext`
  - `FileSystemXmlApplicationContext`
  - **`AnnotationConfigApplicationContext`**

- In Web Application, 
  - `AnnotationConfigWebApplicationContext`
  - `XmlWebApplicationContext`

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

**Use XmlWebApplicationContext**
```java
public class WebInitializer implements WebApplicationInitializer {

  @Override 
  public void onStartup(ServletContext servletContext) throws ServletException { 
    XmlWebApplicationContext appContext = new XmlWebApplicationContext(); 
    appContext.setConfigLocation("/WEB-INF/spring/mvc-config.xml"); 
    ServletRegistration.Dynamic registration = servletContext.addServlet("dispatcher", new DispatcherServlet(appContext)); 
    registration.setLoadOnStartup(1); 
    registration.addMapping("/"); 
  }
}
```

## Can you describe the lifecycle of a Spring Bean in an ApplicationContext?

1. Spring bean configuration is read and metadata in the form of a **BeanDefinition** object is created for each bean.

2. All instances of **BeanFactoryPostProcessor** are invoked in sequence and are allowed an opportunity to alter the bean metadata.

3. For each bean in the container, **starts creation phase**
    
    1. The beans are **instantiated**: the bean factory is calling the **constructor** of each bean. If the bean is created using constructor dependency injection, the dependency bean is created first and then injected where needed.
    
    2. **dependencies are injected**. For beans that are defined having dependencies **injected via setter**, this stage is separate from the instantiation stage.
    
    3. Now that the beans exist and the dependencies were provided, the preinitialization BeanPostProcessor infrastructure beans are consulted to see whether they want to call anything from this bean. These are Spring-specific infrastructure beans that perform bean modifications after they are created. The @PostConstruct annotation is registered by CommonAnnotationBeanPostProcessor, so this bean will call the method found annotated with @PostConstruct. This method is executed right after the bean has been constructed and before the class is put into service, 1 before the actual initialization of the bean (before afterPropertiesSet and init-method).
    
    4. The InitializingBean’s afterPropertiesSet is executed right after the dependencies are injected. The afterPropertiesSet() method is invoked by a BeanFactory after it has set all the bean properties supplied and has satisfied BeanFactoryAware and ApplicationContextAware.
    
    5. The init-method attribute is executed last because this is the actual initialization method of the bean.

4. Beans are being used

5. Spring application context is to shut down, the beans in it will receive destruction callbacks in this order:
    1. `@PreDestroy` method
    2. Bean implemented `DisposableBean` interface
    3. `destroy-method` in `<bean>`

**Lifecycle callbacks**
To interact with the container’s management of the bean lifecycle, you can implement the Spring `InitializingBean` and `DisposableBean` interfaces.

- In `InitializingBean`, container calls `afterproperteisSet()`. Not recommended. 
- In `DisposableBean`, container calls`destroy()`. Not recommended.

The JSR-250 `@PostConstruct` and `@PreDestroy` annotations are generally considered best practice for receiving lifecycle callbacks in a modern Spring application

![IMAGE](https://i.loli.net/2019/06/12/5d0092044c0cf74240.jpg)


## How are you going to create an ApplicationContext in an integration test test?

1. Add `JUnit` and `Spring test` dependencies.
2. Enable Spring in Tests
    1. any Spring enabled test will run with the help of @RunWith(SpringJUnit4ClassRunner.class); the runner is essentially the entry-point to start using the Spring Test framework.
    2. also need the @ContextConfiguration annotations to load the context configuration

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { ApplicationConfig.class })
@WebAppConfiguration // for web application
public class GreetControllerIntegrationTest {

  @Autowired
  private WebApplicationContext wac;
  
  private MockMvc mockMvc;
  @Before
  public void setup() throws Exception {
      this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
  }
  
  @Test
  public void givenWac_whenServletContext_thenItProvidesGreetController() {
      ServletContext servletContext = wac.getServletContext();
       
      Assert.assertNotNull(servletContext);
      Assert.assertTrue(servletContext instanceof MockServletContext);
      Assert.assertNotNull(wac.getBean("greetController"));
  }
  
  @Test
  public void givenHomePageURI_whenMockMVC_thenReturnsIndexJSPViewName() {
      this.mockMvc.perform(get("/homePage"))
        .andDo(print())
        .andExpect(view().name("index"));
  }
}
```

`@WebAppConfiguration` is a class-level annotation that is used to declare that the `ApplicationContext` loaded for an integration test should be a `WebApplicationContext`.

The mere presence of `@WebAppConfiguration` on a test class ensures that a WebApplicationContext will be loaded for the test, using the default value of "file:src/main/webapp" for the path to the root of the web application

Note that `@WebAppConfiguration` **must be used in conjunction with `@ContextConfiguration`**, either within a single test class or within a test class hierarchy.

##  What is the preferred way to close an application context? Does Spring Boot do this for you?

`destruction` callbacks in Spring are not fired automatically; you need to remember to call `AbstractApplicationContext.destroy()` before your application is closed

- When your application runs as a **servlet**, you can simply call `destroy()` in the servlet’s `destroy()` method.
- However, in a **stand-alone application**, things are not quite so simple, especially if you have multiple exit points out of your application. A shutdown hook, which is a thread that is executed just before the application shuts down. **This is the perfect way to invoke the `destroy()` method** of your AbstractApplicationContext (which was being extended by all concrete ApplicationContext implementations). **The easiest way** to take advantage of this mechanism is to use AbstractApplicationContext’s registerShutdownHook() method. The method automatically instructs Spring to register a shutdown hook of the underlying JVM runtime.
    ```java
    public class DestructiveBeanWithHook {

      public static void main(String... args) {
      
        GenericApplicationContext ctx = new AnnotationConfigApplicationContext( DestructiveBeanConfig.class);
        
        ctx.getBean(DestructiveBeanWithJSR250.class); 
        
        ctx.registerShutdownHook();// no need to call ctx.destroy() or close()
      }
    }
    ```

**SpringBoot**
- SpringBoot registers **shutdown-hook**
- SpringBoot also uses **ContextLoaderListener**


## Describe dependency injection using Java configuration?

1. Configuration metadata is traditionally supplied in **XML** format.
2. Spring 2.5 introduced support for **annotation-based** configuration metadata.
3. Spring 3.0, many features provided by the Spring **JavaConfig** project became part of the core Spring Framework. see the  `@Configuration`, `@Bean`, `@Import` and `@DependsOn` annotations. 

**Java configuration typically uses `@Bean` annotated methods within a `@Configuration` class.**

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
    // return new DataSource 
  }
}

public static void main(String[] args) { 

  // everything wires up across configuration classes...
  ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class); 

  TransferService transferService = ctx.getBean(TransferService.class); 
  transferService.transfer(100.00, "A123", "C456"); 
}
```


## Describe dependency injection using annotations (@Component, @Autowired)? 

`@Component` marks the class as a Java Bean and Spring picks that up and pulls it into the Application context so that it can be injected into `@Autowired` instances.

`@Autowire` is kind of Annotation-based container configuration, is the short version for automatic dependency injection.

**how does Spring know what to inject?**
1. `@Autowired` matches **by type** by default. Additional `@qualifier` will be used among selected cadidates only.
2. JSR-250 `@Resource` annotation, which is semantically defined to identify a specific target component **by its unique name** rather than `@Autowired`.

**`@Autowired` Injection types**
1. constructor
2. setter
3. field injection
4. field injection of an array of that type
5. for interfaces that are well-known resolvable dependencies:   
  `BeanFactory`, `ApplicationContext`, `Environment`, `ResourceLoader`, `ApplicationEventPublisher`, and `MessageSource`. These interfaces and their extended interfaces, such as ConfigurableApplicationContext or ResourcePatternResolver, are automatically resolved, with **no special setup necessary**.

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


## Describe Component scanning

Spring attacks automatic wiring from two angles:

1. **Component scanning** — Spring automatically discovers beans to be created in the application context.

2. **Autowiring** — Spring automatically satisfies bean dependencies.

In Spring Boot, automatic configuration has gone well **beyond** component scanning and autowiring.

Component scanning isn’t turned on by default. **To enable component scanning**:

1. annotate a configuration class in your Spring application with the `@ComponentScan`. 

2. It works the same way as `<context:component-scan />` for XML.

`@Configuration` classes are meta-annotated with `@Component`, so they are candidates for component-scanning. NB, it's not a sterotype tho!

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

## Scopes for Spring beans? What is the default scope?

- Singleton scope: per container, **default bean scope**, **stateless**
- Prototype: each time a bean is request, **stateful**
- Request: per http request, web-aware contexts only
- Session: per http session, web-aware contexts only
- Application: per ServletContext, web-aware contexts only
- Websocket: per WebSocket, web-aware contexts only

**Singleton beans with prototype-bean dependencies**

Dependencies are resolved at instantiation time!!!

- Inject prototype to singleton: a new prototype bean is instantiated and then dependency-injected into the singleton bean. The prototype instance is the sole instance that is ever supplied to the singletonscoped bean. that injection occurs only once, when the Spring container is instantiating the singleton bean and resolving and injecting its dependencies.

- If you need a new instance of a prototype bean at runtime more than once, use **“Method injection”**. Make bean A aware of the container by implementing the ApplicationContextAware interface, and by making a getBean("B") call to the container ask for (a typically new) bean B instance every time bean A needs it.

**Custom scopes**
- As of Spring 3.0, a **thread scope** is available, but is not registered by default.
- You need to implement the `org.springframework.beans.factory.config.Scope` interface.


## Are beans lazily or eagerly instantiated by default? How do you alter this behavior?   
**Eager** instantiation and by default loads the bean immediately while **lazy** loads it on demand.

- **Singleton** beans are **eagerly instantiated by default**. 
- **Prototype** beans are typically created **lazily** when requested.
- Use `@Lazy(true)` annotation to override
    - With @Component
    - With @Bean along with @Configuration
- Use `@Lazy` On injection point
- **Advantage**: it speeds container bootstrap time and has a smaller memory footprint. useful when the dependency is a huge object.
- **Disadvantage**: error remains unnoticed untill using of it
```java
@Service("accountService") 
@Lazy(true) 
public class AccountServiceImpl implements AccountService { 
  //...
}

@Configuration 
public class Ch2BeanConfiguration {

  @Bean 
  @Lazy(true) 
  public AccountService accountService() { 
    AccountServiceImpl bean = new AccountServiceImpl(); 
    return bean; 
  } 
  //...
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

**Property source**:   
Abstract base class that represents a source of `name:value` property pairs. 

- Spring’s StandardEnvironment is configured with two PropertySource objects 
  - the set of **JVM system properties**: `System.getProperties()`
  - the set of **system environment variables**  `System.getenv()`
- Add a custom source of properties, just inistantiate your own PropertySource and add it to the set of **PropertySource** for current `Environment`
    ```java
    ConfigurableApplicationContext ctx = new GenericApplicationContext(); 
    MutablePropertySources sources = ctx.getEnvironment().getPropertySources(); 
    sources.addFirst(new MyPropertySource());
    ```
    
**@PropertySource**
A convenient and declarative mechanism for adding a PropertySource to Spring’s Environment.

In the following example:
1. See if "my.placeholder" is present in one of the property sources
2. If not, check "default/path"
3. Otherwise throw `IllegalArgumentException`

```java 
//given file with key/value pair  testbean.name=myTestBean
@Configuration
//@PropertySource("classpath:/com/myco/app.properties")
@PropertySource("classpath:/com/${my.placeholder:default/path}/app.properties")
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

**@TestPropertySource**  
Class-level annotation annotation for integration test.  Have higher precedence than 
- Property sources loaded from operating system's environment
- Java system properties
- Property sources added by application via `@PropertySource`

NB: inlined properties have higher precedence than properties loaded from resource locations.

```java
@ContextConfiguration
@TestPropertySource(properties = { "timezone = GMT", "port: 4242" })  // inline properties
public class MyIntegrationTests { 
  // class body...
}
```


## What is a BeanFactoryPostProcessor and what is it used for? When is it invoked?

**BeanFactoryPostProcessor** 
- works in the ApplicationContext lifecycle  **Load Bean Definition** step,
- before the container instantiates any beans other than BeanFactoryPostProcessors beans,
- they read, and potentially operate on the bean configuration metadata, or say, bean meta-data, or bean definition.
- A custom BeanFactoryPostProcessor can also be used, for example, to register custom property editors.
- You can configure multiple BeanFactoryPostProcessors, control the order by implement `ordered` interface.
- BeanPostProcessors are scoped per-container, it will only be applied to the bean definitions in current container, not in another.

**BeanFactoryPostProcessor** is for manipulate bean definition. If you want to change the actual bean instances, use **BeanPostProcessor**.

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


## Why would you define a static @Bean method?

- Static @Bean methods are called without creating their containing configuration class as an instance. 

- This makes particular sense when defining postprocessor beans, e.g. of type `BeanFactoryPostProcessor` or `BeanPostProcessor`, since such beans will get initialized early in the container lifecycle and should avoid triggering other parts of the configuration at that point.

- Calls to **static `@Bean`** methods never get intercepted by the container, because **CGLIB subclassing** can override only non-static methods


## What is a ProperySourcesPlaceholderConfigurer used for?

It is a BeanFactoryPostProcessor that resolves property placeholders, on the `${PROPERTY_NAME}` format, in Spring bean properties and Spring bean properties annotated with the `@Value`. When such a placeholder is encountered the corresponding value from the Spring environment and its property sources, it's injected into the property.

Using property placeholders, Spring bean configuration can be externalized into property files. This allows for changing for example the database server used by an application without having to rebuild and redeploy the application.


## What is a BeanPostProcessor and how is it different to a BeanFactoryPostProcessor? What do they do? When are they called?

A **BeanPostProcessor** is an interface that defines callback methods that allow for **modification of bean instances**, like to implement your own (or override the container’s default) instantiation logic, dependency-resolution logic, and so forth. 

A BeanPostProcessor may even replace a bean instance with, for instance, an AOP. 

BeanPostProcessors are scoped per-container.

```java
public class InstantiationTracingBeanPostProcessor implements BeanPostProcessor {

  // simply return the instantiated bean as-is 
  public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
    return bean; // we could potentially return any object reference here... 
  }
  
  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException { 
    System.out.println("Bean '" + beanName + "' created : " + bean.toString()); 
    return bean; 
  }
}
```
**VS BeanFactoryPostProcessor**  
- **BeanFactoryPostProcessor** implementations are "called" during **startup of the Spring context** after all bean definitions will have been loaded while 
- **BeanPostProcessor** are "called" when the **Spring IoC container instantiates a bean** (i.e. during the startup for all the singleton and on demand for the proptotypes one)


### What is an initialization method and how is it declared on a Spring bean?

An initialization method is invoked **after** all properties on the bean have been populated **before** the bean is taken into use. Different ways to declare, Spring invokes them in a specific order:

1. Annotating with `@PostConstruct` the method that is **called right after** the bean is instantiated and dependencies injected.
    1. The method **must be** invoked before the bean is used, and, 
    2. like any other initialization method chosen, **may be called only once** during a bean lifecycle. 
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


3. initialization method specified within the bean configuration file is invoked. The equivalent of the `init-method` attribute when using **Java Configuration** `@Bean(initMethod="...")`

![IMAGE](https://i.loli.net/2019/05/13/5cd92794f0ebc77453.jpg)


### What is a destroy method, how is it declared and when is it called?
The destroy method is invoked just before the end of a bean's lifetime.

- **singletonscoped beans** are invoked at the shutdown of the whole Spring Container. 
- The destroy methods of **request‐scoped beans** are invoked at the end of the current web request, and 
- the destroy methods of **session‐scoped beans** are invoked at HTTP session timeout or invalidation. 
- **Prototype‐scoped beans** are not tracked after their instantiation; therefore, their destroy methods **cannot be invoked**.

A destroy method will be invoked when the application context is about to close. 


#### Consider how you enable JSR-250 annotations like @PostConstruct and @PreDestroy? When/how will they get called?

When a Spring App uses **annotation-based configuration**, a default `CommonAnnotationBeanPostProcessor` is automatically registered in the application context and **no additional configuration is necessary** to enable `@PostConstruct` and `@PreDestroy`.

`JSR-250` includes `@PostConstruct` and `@PreDestroy`. 

Destroy methods are called in the order:

1. `@PreDestroy` annotation.
2. `destroy()` as defined by the DisposableBean callback interface(not recommanded, coupling with Spring)
3. `destroy Method` element of the @Bean annotation.


#### How else can you define an initialization or destruction method for a Spring bean? 

Three ways to initialize and three ways of destruction. Details see above.
1. JSR-250: @PostConstruct, @PreDestroy
2. InitializingBean and DisposableBean methods
3. Bean init and destroy methods


## What does component-scanning do?
Component, or classpath, scanning is the process using which the Spring container searches the classpath for classes annotated with stereotype annotations and registers bean definitions in the Spring container for such classes.

## What is the behavior of the annotation `@Autowired` with regards to field injection, constructor injection and method injection?

`@Autowired` tries to find a matching bean **by type** and inject it at the place on annotation - that may be a constructor, a method (not only setter, but usually setter) and field.

1. Container examines the type of field
2. Container searches for a bean that matches the type
3. If multiple matching, `@Primary` bean is injected
4. If multiple matching, `@Qualifier` bean might be used
5. If multiple matching, try to **match bean name and filed name**
6. Exception throws if no unique matching

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

- For private fields: 
   1. private fields and setters can be annotated as `@Autowired` and `@Value`
   2. use Constructor to initialize

- For testing:
  1. `@TestPropertySource` allows using either a test-specific property file or customizing individual property values. 
  2. Spring framework provides `ReflectionTestUtils`

## How does the @Qualifier annotation complement the use of @Autowired?
`@Qualifier` used at 3 locations: 

1. **Inject Points**. The most basic use of the @Qualifier annotation is to specify the name of the Spring bean to be selected the bean to be dependency-injected.

2. **Bean Definitions**. This will assign a qualifier to the bean and the same qualifier can later be used at an injection point to inject the bean in question.

3. **Annotation Definition**. To create custom qualifier annotations.

```java
public class MovieRecommender {
  @Autowired
  @Qualifier("main") 
  private MovieCatalog movieCatalog;
}

// use qualifier
public class MovieRecommender {

  private MovieCatalog movieCatalog;
  
  private CustomerPreferenceDao customerPreferenceDao;
  
  @Autowired 
  public void prepare(@Qualifier("main") MovieCatalog movieCatalog, CustomerPreferenceDao customerPreferenceDao) {
  
  this.movieCatalog = movieCatalog;
  this.customerPreferenceDao = customerPreferenceDao; }
}
```


## What is a proxy object and what are the two different types of proxies Spring can create?

>**A proxy object** is an object that have the same methods, at least the public methods, as the object it proxies.   
**The purpose** of this is to make the proxy indistinguishable from the object it proxies. The proxy object contains a reference to the object it proxies. 
**When** a reference to the original, proxied, object is requested, a reference to the proxy object is supplied. 
**When** another object wants to invoke a method on the original object, it will invoke the same method on the proxy object. The proxy object may perform some processing before, optionally, invoking the (same) method on the original object.

Spring framework is able to create two types of proxy objects:
- **JDK Dynamic Proxy** - **default**: Creates a proxy object that implements all the interfaces
- **CGLIB Proxy**: Creates a subclass of the class

### What are the limitations of these proxies (per type)?
**Limitations of JDK Dynamic Proxies**
1. Requires the proxied object to implement at least one interface.
2. Only methods found in the implemented interface(s) will be available in the proxy object.
3. Proxy objects must be referenced using an interface type and cannot be referenced using a type of a superclass of the proxied object type.
4. Does not support self-invocations.

**Limitations of CGLIB Proxies**
1. Requires the class of the proxied object to be non-final.
2. Requires methods in the proxied object to be non-final.
3. Does not support self-invocations.
4. Requires a third-party library.(However, it's in Spring Framework)

### What is the power of a proxy object and where are the disadvantages?
**power of a proxy object**
- Add behavior to existing beans. E.g., Transaction management, logging, security.
- Separate concerns. E.g., logging, security etc from business logic.
- 
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

## Why are you not allowed to annotate a final class with `@Configuration`
JavaConfig requires CGLIB subclassing of each configuration class at runtime, so that @Configuration classes and their factory methods **must not** be marked as `final` or `private`.

### How do @Configuration annotated classes support singleton beans?
It only creates one instance of that bean.

### Why can’t @Bean methods be final either?
CGlib proxying cannot proxy a final class.

## How do you configure profiles? What are possible use cases where they might be useful?

todo new
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

**Activating Profiles**
- **Most straightforward**, set via `Environment` API
- `spring.profiles.active` property, like
    ```properties
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

## Can you use @Bean together with @Profile? 

todo

- On Class, along with `@Configuration`, inner beans only create when `@profile` conditon is met
- On Class, along with `@Component`, inner beans create when condition met
- On method, along with `@Bean`, bean crates when condition met
- As meta-annotaion, to create custom annotations.

## Can you use @Component together with @Profile?
todo

### How many profiles can you have?
`setActiveProfiles()` accepts `String…` varargs, which is a `String[]`.
In Java, arrays internally use integers for index, the max size is **Integer.MAX_VALUE**.
So theoretically it is **2^31-1 = 2147483647**.

## How do you inject scalar/literal values into Spring beans?
use `@Value` annotation at constructor arguments, over properties and at setter methods.


## What is @Value used for?
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

### What is the difference between `$` and `#` in @Value expressions?

- With `$`, reference a property name in the application’s environment.  
expressions are evaluated by the **PropertySourcesPlaceholderConfigurer** Spring bean prior to bean creation and can **only be** used in `@Value` annnotations.
- With `#`, SpEL

## What is the Environment abstraction in Spring?

The Environment is an abstraction integrated in the container that models two key aspects of the application environment: profiles and properties.

**profiles**
A profile is a named, logical group of bean definitions to be registered with the container only if the given profile is active.


**properties**
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


## References

1. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
2. [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition/)
3. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
4. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
5. [BeanFactoryPostProcessor and BeanPostProcessor in lifecycle events](https://stackoverflow.com/questions/30455536/beanfactorypostprocessor-and-beanpostprocessor-in-lifecycle-events)