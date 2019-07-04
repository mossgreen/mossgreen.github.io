---
title: Spring REST in Spring Certification
search: true
tags: 
  - Spring Boot
  - Spring Professional
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring Boot in Spring professional certification.

- Spring Boot Intro (8%)
- Spring Boot Auto Configuration (8%)
- Spring Boot Actuator (8%)
- Spring Boot Testing (8%)

# Spring Boot Intro

## What is Spring Boot?

Spring Boot is an opinionated framework that helps developers build Spring-based applications quickly and easily. **The main goal of Spring Boot** is to quickly create Spring-based applications without requiring developers to write the same boilerplate configuration again and again. The key Spring Boot features include:

- Spring Boot starters, easy dependency management

- Spring Boot autoconfiguration, with sensible defaults

- Elegant configuration management

- Spring Boot actuator

- Easy-to-use embedded servlet container support


## What are the advantages of using Spring Boot?

- Spring Boot starters   
These starters are pre-configured with the most commonly used library dependencies so you don’t have to search for the compatible library versions and configure them manually. E.g., the `spring-boot-starter-data-jpa` starter module includes all the dependencies required to use Spring Data JPA, along with Hibernate library dependencies, as Hibernate is the most commonly used JPA implementation.

- Spring Boot autoconfiguration. Spring Boot configures various components automatically, by registering beans based on various criteria. The criteria can be:
    - Availability of a particular class in a classpath
    - Presence or absence of a Spring bean
    - Presence of a system property
    - Absence of a configuration file   
    
    For example, if you have the spring-webmvc dependency in your classpath, Spring Boot assumes you are trying to build a SpringMVC-based web application and automatically tries to register DispatcherServlet if it is not already registered.

- Elegant configuration management
  -  Spring supports `@PropertySource`
  -  Spring Boot uses densible defaults and powerful type-safe property binding to bean properties.
  -  Spring Boot supports having deparate configuration files for different profiles without requiring much configuration.

- Spring Boot actuator. It provides a wide variety of such production-ready features:
  - Can view the application bean configuration details
  - Can view the application URL mappings, environment details, and configuration parameter values
  - Can view the registered health check metrics

- Easy-to-use embedded servlet container support.  
It creates a JAR type module and embed the servlet container in the application to be a self-contained deployment unit.


## Why is it “opinionated”?

- It follows the “Convention Over Configuration” approach.
- It pre-configures Spring app by reasonable defaults.
- It's highly customizable


## What things affect what Spring Boot sets up?

Spring Boot provides many custom `@Conditional` annotations to meet developers’ autoconfiguration needs based on various criteria, each of which can be used to control the creation of Spring beans.

- `@ConditionalOnClass`
- `@ConditionalOnMissingClass`
- `@ConditionalOnBean`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`
- `@ConditionalOnResource`
- `@ConditionalOnWebApplication`
- `@ConditionalOnNotWebApplication`

**How does it work? How does it know what to configure?**
Spring Boot configures various components automatically, by registering beans based on various criteria. The criteria can be:
    - Availability of a particular class in a classpath: `@ConditionalOnClass`, on the other hand `@ConditionalOnMissingBean`
    - Presence or absence of a Spring bean: `@ConditionalOnBean`, `@ConditionalOnMissingBean`
    - Presence of a system property
    - Absence of a configuration file  


## What is a Spring Boot starter POM? Why is it useful?
**Starter POMs** are that all the dependencies needed to get started with a certain technology have been gathered. 

A developer can rest assured that there are no dependencies missing and that all the dependencies have versions that work well together.


## Spring Boot supports both Java properties and YML files. Would you recognize and understand them if you saw them?

**Properties**
```properties
environments.dev.url=https://dev.example.com
environments.dev.name=Developer Setup
environments.prod.url=https://another.example.com
environments.prod.name=My Cool App
```

**YAML**
```yaml
environments:
	dev:
		url: https://dev.example.com
		name: Developer Setup
	prod:
		url: https://another.example.com
		name: My Cool App

```


## Can you control logging with Spring Boot? How?

- Spring Boot uses **Commons Logging** internally by default, but it leaves the underlying implementation open. 

- By default, ERROR, WARN, and INFO level messages are logged. In `application.properties` add: `debug=true` to enable debug level logging.

- Logging is initialized **before** the application context, so it is **impossible** to control logging from using `@PropertySources` in `@Configuration` classes.

- **System properties** and conventional Spring Boot **external configuration files** should be used. Depending on the logging system that is used, Spring Boot will look for the specific configuration files.

- The logfile name to use by default by Spring Boot can be configured using the `logging.file` Spring Environment variable.


## Where does Spring Boot look for property file by default?

The **default properties** of a Spring Boot application are stores in the application’s JAR in a file named “**application.properties**”. When developing, this file is found in the `src/main/resources` directory.


## How do you define profile specific property files?

You can register multiple beans of the same type and associate them with one or more profiles. When you run the application, you can activate the desired profile(s). That way, only the beans associated with the activated profiles will be registered.

Properties controlling the behavior of Spring Boot applications can be defined using:
- Property files. A property file contains key-value pairs. Example: requestreceiver.timeout=5000
- YAML files
- Environment variables. Used to control application behavior in different environments.
- Command-line arguments: Example: java -jar myspringbootapp.jar –server.port=8081

Commonly, but** not always**, Spring Boot configuration properties use the following format:
```properties
spring.xxx.yyy=somevalue
```
- **xxx**: the name of the technology or area that the property controls.
- **yyy**: consists of one or more strings specifying the property in question separated with decimal dots or dashes.

```java
@Configuration 
public class AppConfig {

  @Bean @Profile("DEV") 
  public DataSource devDataSource() { 
  // ...
  }
  
  @Bean @Profile("PROD") 
  public DataSource prodDataSource() { 
  //...
  }
}
```

## How do you access the properties defined in the property files?

With the aboveconfiguration, you can specify the active profile using the `-Dspring.profiles.active=DEV` system property. This approach works fine for simple cases, such as when you’re enabling or disabling bean registrations based on activated profiles. But if you want to register beans based on some conditional logic, the profiles approach itself is not sufficient.

Using the @Conditional approach, you can register a bean conditionally based on any arbitrary condition.


## What properties do you have to define in order to configure external MySQL?

1. dependencies: Spring boot,and msql
2. config properties

In your `application.properties` file, add:
```properties
spring.jpa.hibernate.ddl-auto=none
spring.datasource.url=jdbc:mysql://<dbhost>:<dbport>/<db>
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

## How do you configure default schema and initial data?

Default schema when defining the datasource configuration:
```properties
spring.datasource.schema = #value for your default schema to use in database
```
Spring Boot uses the `spring.datasource.initialize` property value, which is **true** by default, to determine whether to initialize the database.

Spring Boot will load the `schema-${platform}.sql` and `data-${platform}.sql` files if they are available in the root classpath.

```properties
spring.datasource.schema=create-db.sql 
spring.datasource.data=seed-data.sql
```


## What is a fat jar? How is it different from the original jar?

Spring Boot, by default, generates a so-called **fat JAR**, **a JAR with all the compiled classes along with all of the jar dependencies that your code needs to run.**.

To create an executable jar, we need to add the `spring-boot-maven-plugin` to our `pom.xml`.

In your project target directory, you should see `myproject-0.0.1-SNAPSHOT.jar`. This the far Jar. Inside of it, you would see `myproject-0.0.1-SNAPSHOT.jar.original`. This is the **original jar** file that Maven created before it was repackaged by Spring Boot.


## What is the difference between an embedded container and a WAR?

An **embedded container** is packaged in the application **JAR-file** and will contain only one single application. 

A **WAR-file**e will need to be deployed to a **web container**, such as Tomcat, before it can be used. The web container to which the WAR-file is deployed may contain other applications.

**Deployable WAR**
1. The first thing you do is change the `packaging` type.
    - `<packaging>war</packaging>` in Maven
    - `apply plugin: 'war'` in Gradle

2. you need to add `spring-boot-starter-tomcat` as the provided scope so that it won’t get packaged inside the WAR file.

3. Finally, you need to provide a `SpringBootServletInitializer` sub-class and override its `configure()` method. You can simply make your application’s entry point class extend `SpringBootServletInitializer`.
    ```java
    @SpringBootApplication 
    public class SpringbootWebDemoApplication extends SpringBootServletInitializer {

      @Override 
      protected SpringApplicationBuilder configure(SpringApplicationBuilder application) { 
        return application.sources(SpringbootWebDemoApplication.class); 
      }
    }
    ```
Now running the Maven/Gradle build tool will produce a WAR file that can be deployed on an external server.


## What embedded containers does Spring Boot support?
- Tomcat,
- Jetty,
- Undertow servers.


# Spring Boot Auto Configuration

## How does Spring Boot know what to configure?

Spring Boot autoconfiguration represents a way to automatically configure a Spring application **based on the dependencies that are present on the classpath**.

For example, if there is a specific embedded server on the classpath, this will be used unless there is another `EmbeddedServletContainerFactory` configuration in the project.

## What does @EnableAutoConfiguration do?

It's a Spring Boot specific annotation. It enables the autoconfiguration of Spring ApplicationContext by:
1. scanning the classpath components and 
2. registering the beans that match various conditions. 

Spring Boot provides various autoconfiguration classes in `spring-boot-autoconfigure{version}.jar`, and they are typically:
1. annotated with `@Configuration` to mark it as a Spring configuration class and 
2. annotated with `@EnableConfigurationProperties` to bind the customization properties and one or more conditional bean registration methods.

## What does @SpringBootApplication do?

It's a top-level annotation designed to use only at class level. It's a convenience annotation that equivalent to declaring the following three:

1. `@EnableAutoConfiguration`: enable Spring Boot’s auto-configuration mechanism

2. `@ComponentScan`: enable @Component scan on the package where the application is located

3. `@Configuration`: allow to register extra beans in the context or import additional configuration classes


## Does Spring Boot do component scanning? Where does it look by default?

- `@ComponentScan` or `@SpringBootApplication` enables component scanning.

- If no component scanning attribute defined, it will scan only the package in which the class annotated.

- The base package(s) which to scan for components can be specified using the **basePackages element** in the `@ComponentScan` annotation or by specifying one or more classes that are located in the base package(s)

```java
@SpringBootApplication(scanBasePackageClasses = HelloWorld.class)
public class OrdersDBConfig {}
```

```java
@Configuration 
@EnableAutoConfiguration 
@ComponentScan(basePackages = "com.mycompany.myproject") 
@EntityScan(basePackageClasses=Person.class) 
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  } 
}
```

## How are DataSource and JdbcTemplate auto-configured?

DataSource configuration is controlled by external configuration properties in spring.datasource.*. For example, you might declare the following section in application.properties:

```properties
spring.datasource.url=jdbc:mysql://localhost/test 
spring.datasource.username=dbuser 
spring.datasource.password=dbpass 
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

Spring’s JdbcTemplate and NamedParameterJdbcTemplate classes are auto-configured, and you can @Autowire them directly into your own beans.

```java
@Component 
public class MyBean {

private final JdbcTemplate jdbcTemplate;

@Autowired 
public MyBean(JdbcTemplate jdbcTemplate) { 
  this.jdbcTemplate = jdbcTemplate; 
}
```

## What is `spring.factories` file for?

the `META-INF/spring.factories` defined all the auto-configuration classes that will be used to guess what kind of application you are running.

Some events are actually triggered before the ApplicationContext is created, so you cannot register a listener on those as a @Bean. You can register them with the SpringApplication.addListeners(…) method or the SpringApplicationBuilder.listeners(…) method.

If you want those listeners to be registered automatically, regardless of the way the application is created, you can add a **META-INF/spring.factories** file to your project and reference your listener(s) by using the org.springframework.context.ApplicationListener key:

```properties
org.springframework.context.ApplicationListener=com.example.project.MyListener
```

Spring Boot checks for the presence of a `META-INF/spring.factories` file within your published jar. The file should list your configuration classes under the EnableAutoConfiguration key,

## How do you customize Spring auto configuration?

1. Create a class annotated as `@Configuration` and register it.

    ```java
    @Configuration
    public class MySQLAutoconfiguration {
        //...
    }
    ```

2. The next mandatory step is registering the class as an auto-configuration candidate, by adding the name of the class under the key `EnableAutoConfiguration` in the standard file `resources/META-INF/spring.factories`:

    ```properties
    org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.example.project.MySQLAutoconfiguration
    ```

If we want our auto-configuration class to have priority over other auto-configuration candidates, we can add the `@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)` annotation.

Auto-configuration is designed using classes and beans marked with `@Conditional` annotations so that the auto-configuration or specific parts of it can be replaced.

Note that the auto-configuration is only in effect if the auto-configured beans are not defined in the application. If you define your bean, then the default one will be overridden.

Example, Using `@Conditional` Based on System Properties. implement the `MySQLDatabaseTypeCondition` condition to check whether the dbType system property is MYSQL

**MySQLDatabaseTypeCondition.java** 

```java
public class MySQLDatabaseTypeCondition implements Condition { 

  @Override 
  public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata metadata) { 
    String enabledDBType = System.getProperty("dbType"); 
    return (enabledDBType != null && enabledDBType.equalsIgnoreCase("MYSQL")); 
  }
}

public class MongoDBDatabaseTypeCondition implements Condition { 

  @Override 
  public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata metadata) { 
    String enabledDBType = System.getProperty("dbType"); 
    return (enabledDBType != null && enabledDBType.equalsIgnoreCase("MONGODB")); 
  } 
}
```

```java
@Configuration 
public class AppConfig { 

  @Bean 
  @Conditional(MySQLDatabaseTypeCondition.class) 
  public UserDAO jdbcUserDAO(){ 
    return new JdbcUserDAO(); 
  } 

  @Bean 
  @Conditional(MongoDBDatabaseTypeCondition.class) 
  public UserDAO mongoUserDAO(){ 
    return new MongoUserDAO(); 
  }
}
```

## What are the examples of `@Conditional` annotations? How are they used?

The Spring Boot **autoconfiguration** mechanism heavily depends on the `@Conditional` feature.
Using the @Conditional approach, you can register a bean conditionally based on any arbitrary condition.

For example, you may want to register a bean when:

- A specific class is present in the classpath
- A Spring bean of a certain type isn’t already registered in the ApplicationContext
- A specific file exists in a location
- A specific property value is configured in a configuration file
- A specific system property is present/absent

`@ConditionalOnBean`: Matches when the specified bean classes and/or names are already registered.

`@ConditionalOnMissingBean`: Matches when the specified bean classes and/or names are not already registered.

`@ConditionalOnClass`: Matches when the specified classes are on the classpath.

`@ConditionalOnMissingClass`:  Matches when the specified classes are not on the classpath.

`@ConditionalOnProperty`: Matches when the specified properties have a specific value.

`@ConditionalOnResource`: Matches when the specified resources are on the classpath.

`@ConditionalOnWebApplication`: Matches when the application context is a web application context.


# Spring Boot Actuator

## What value does Spring Boot Actuator provide?

The Spring Boot Actuator module provides production-ready features such as monitoring, metrics, health checks, etc. The Spring Boot Actuator enables you to monitor the application using HTTP endpoints and JMX.

Spring Boot provides `spring-boot-starter-actuator` to autoconfigure Actuator.


## What are the two protocols you can use to access actuator endpoints?

You can expose data through different technologies, like HTTP (endpoints), JMX, and SSH.

Among all the ACTUATOR PROPERTIES.
```properties
management.server.ssl.enabled-protocols= # Enabled SSL protocols.
```

## What are the actuator endpoints that are provided out of the box?

1. The `/actuator` endpoint will provide a hypermedia-based discovery page for all the other endpoints, but it will require the Spring HATEOAS in the classpath.

2. `/autoconfig` This endpoint will display the auto-configuration report. It will give you two groups: positiveMatches and negativeMatches.

3. `/beans` This endpoint will display all the Spring beans that are used in your application. R

4. `/configprops` This endpoint will list all the configuration properties that are defined by the @ConfigurationProperties beans,

5. `/docs` This endpoint will show HTML pages with all the documentation for all the Actuator module endpoints. This endpoint can be activated by including the `spring-boot-actuator-docs` dependency in pom.xml

6. `/dump` This endpoint will perform a thread dump of your application.

7. `/env` This endpoint will expose all the properties from the Spring’s ConfigurableEnvironment interface. This will show any active profiles and system environment variables and all application properties, including the Spring Boot properties.

8. `/flyway` This endpoint will provide all the information about your database migration scripts; it’s based on the Flyway project (https://flywaydb.org/). This is very useful when you want to have full control of your database by versioning your schemas. I

9. `/health` This endpoint will show the health of the application. If you are doing a database app like in the previous section (/flyway) you will see the DB status and by default you will see also the diskSpace from your system.

10. `/info` This endpoint will display the public application info. This means that you need to add this information to application.properties. It’s recommended that you add it if you have multiple Spring Boot applications.

11. `/logfile` This endpoint will show the contents of the log file specified by the logging.file property, where you specify the name of the log file (this will be written in the current directory). You can also set the logging.path, where you set the path where the spring.log will be written. By default Spring Boot writes to the console/standard out, and if you specify any of these properties, it will also write everything from the console to the log file. You can stop your application. Go to src/main/resources/application.properties and add this to the very end:

```properties
logging.file=mylog.log
```
12. `/metrics` This endpoint shows the metrics information of the current application, where you can determine the how much memory it’s using, how much memory is free, the uptime of your application, the size of the heap is being used, the number of threads used, and so on.

13. `/mappings` This endpoint shows all the lists of all @RequestMapping paths declared in your application. This is very useful if you want to know more about what mappings are declared.

14. `/shutdown` This endpoint is not enabled by default.

The only endpoints that are not sensitive are /docs, /info and /health. So, if you want to disable the sensitive feature, you can configure them in the application.properties file.


## What is info endpoint for? How do you supply data?

`/info` This endpoint will display the public application info. This means that you need to add this information to application.properties. It’s recommended that you add it if you have multiple Spring Boot applications.

```properties
info.app.name=Spring Boot Web Actuator Application 
info.app.description=This is an example of the Actuator module 
info.app.version=1.0.0
```


## How do you change logging level of a package using loggers endpoint?

Spring Boot Actuator includes the ability to view and configure the log levels of your application at runtime. You can view either the entire list or an individual logger’s configuration, which is made up of both the explicitly configured logging level as well as the effective logging level given to it by the logging framework.
- TRACE
- DEBUG
- INFO
- WARN
- ERROR
- FATAL
- OFF
- null,  indicates that there is no explicit configuration.

To configure a given logger, POST a partial entity to the resource’s URI, as shown in the following example:
```json
{ 
  "configuredLevel": "DEBUG"
}
```

To “reset” the specific level of the logger (and use the default configuration instead), you can pass a value of null as the configuredLevel.

## How do you access an endpoint using a tag?

Common tags are generally used for dimensional drill-down on the operating environment like host, instance, region, stack, etc. Commons tags are applied to all meters and can be configured as shown in the following example:
```properties
management.metrics.tags.region=us-east-1 
management.metrics.tags.stack=prod
```
The example above adds region and stack tags to all meters with a value of `us-east-1` and `prod` respectively.


## What is metrics for?

This endpoint shows the metrics information of the current application, where you can determine the how much memory it’s using, how much memory is free, the uptime of your application, the size of the heap is being used, the number of threads used, and so on.

One of the important features about this endpoint is that it has some counters and gauges that you can use, even for statistics about how many times your app is being visited or if you have the log file enabled. If you are accessing the /logfile endpoint, you will find some counters like counter.status.304.logfile, which indicates that the /logfile endpoint was accessed but hasn’t change. And of course you can have custom counters.


## How do you create a custom metric with or without tags?

To register custom metrics, inject MeterRegistry into your component,
```java
class Dictionary { 
  private final List<String> words = new CopyOnWriteArrayList<>(); 
  Dictionary(MeterRegistry registry) { 
    registry.gaugeCollectionSize("dictionary.size", Tags.empty(), this.words); 
  } 
}
```

## What is Health Indicator?

This endpoint will show the health of the application. If you are doing a database app like in the previous section (/flyway) you will see the DB status and by default you will see also the diskSpace from your system. If you are running your app, you can go to http://localhost:8080/health.

## What are the Health Indicators that are provided out of the box?

![](https://i.loli.net/2019/06/26/5d130489a660868299.jpg)


## What are the Health Indicator statuses that are provided out of the box

- `DOWN` SERVICE_UNAVAILABLE (503)

- `OUT_OF_SERVICE` SERVICE_UNAVAILABLE (503)

- `UP` No mapping by default, so http status is 200

- `UNKNOWN` No mapping by default, so http status is 200

## How do you change the Health Indicator status severity order?

- Assume a new Status with code `FATAL` is being used in one of your HealthIndicator implementations.
- You might also want to register custom status mappings if you access the health endpoint over HTTP.

```properties
management.health.status.order=FATAL, DOWN, OUT_OF_SERVICE, UNKNOWN, UP
management.health.status.http-mapping.FATAL=503
```

## Why do you want to leverage 3rd party external monitoring system?

Spring Boot auto-configures a composite MeterRegistry and adds a registry to the composite for each of the supported implementations that it finds on the classpath. Having a dependency on micrometer-registry-{system} in your runtime classpath is enough for Spring Boot to configure the registry.

# Spring Boot Testing

## When do you want to use @SpringBootTest annotation?

the test context framework will be searching for the class annotated with @SpringBootApplication (if no specific configuration is passed) and will use that to actually start the application.

```java
@RunWith(SpringRunner.class) 
@SpringBootTest(classes = CalculatorApplication.class) 
public class CalculatorApplicationTests {

  @Autowired private Calculator calculator;

  @Test(expected = IllegalArgumentException.class) 
  public void doingDivisionShouldFail() { 
    calculator.calculate(12,13, '/'); 
  }
}
```

## What does @SpringBootTest auto-configure?

## What dependencies does spring-boot-starter-test brings to the classpath?

Spring Boot Test, JSONPath, JUnit, AssertJ, Mockito, Hamcrest, JSONassert, and Spring Test, all within test scope.


## How do you perform integration testing with @SpringBootTest for a web application?

To properly test a web application, you need a way to throw actual HTTP requests at it and assert that it processes those requests correctly. Two options:

1. **Spring Mock MVC** — Enables controllers to be tested in a mocked approximation of a servlet container without actually starting an application server. To set up a Mock MVC in your test, you can use MockMvcBuilders.
    - `standaloneSetup()` — Builds a Mock MVC to serve one or more manually created and configured controllers. It expects you to manually instantiate and inject the controllers you want to test, whereas webAppContextSetup() works from an instance of WebApplicationContext, which itself was probably loaded by Spring. The former is slightly more akin to a unit test in that you’ll likely only use it for very focused tests around a single controller.
    - `webAppContextSetup()` — Builds a Mock MVC using a Spring application context, which presumably includes one or more configured controllers. lets Spring load your controllers as well as their dependencies for a full-blown integration test.
```java
@RunWith(SpringJUnit4ClassRunner.class) 
@SpringApplicationConfiguration( classes = ReadingListApplication.class) 
@WebAppConfiguration public class MockMvcWebTests {
  @Autowired 
  private WebApplicationContext webContext;

  private MockMvc mockMvc;

  @Before 
  public void setupMockMvc() {

    mockMvc = MockMvcBuilders
      .webAppContextSetup(webContext)
      .build(); 
  }
  
  @Test 
  public void homePage() throws Exception { 
  mockMvc.perform(MockMvcRequestBuilders.get("/readingList")) 
    .andExpect(MockMvcResultMatchers.status().isOk()) 
    .andExpect(MockMvcResultMatchers.view().name("readingList")) 
    .andExpect(MockMvcResultMatchers.model().attributeExists("books")) 
    .andExpect(MockMvcResultMatchers.model().attribute("books", Matchers.is(Matchers.empty()))); 
  }
}
```

2. **Web integration tests** — Actually starts the application in an embedded servlet container (such as Tomcat or Jetty), enabling tests that exercise the application in a real application server.  
uses @WebIntegrationTest to start the application along with a server and uses Spring’s RestTemplate to perform HTTP requests against the application.
```java
@RunWith(SpringJUnit4ClassRunner.class) 
@SpringApplicationConfiguration( classes=ReadingListApplication.class) 
@WebIntegrationTest 
public class SimpleWebTest {

  @Test(expected=HttpClientErrorException.class) 
  public void pageNotFound() {
  
    try { 
      RestTemplate rest = new RestTemplate(); 
      rest.getForObject( "http://localhost:8080/bogusPage", String.class); 
      fail("Should result in HTTP 404"); 
    } catch (HttpClientErrorException e) { 
      assertEquals(HttpStatus.NOT_FOUND, e.getStatusCode()); 
      throw e; 
    }
  }
}
```

## When do you want to use @WebMvcTest? What does it auto-configure?

Spring Boot provides the `@WebMvcTest` annotation, which will autoconfigure SpringMVC infrastructure components and **load only** `@Controller`, `@ControllerAdvice`, `@JsonComponent`, `Filter`, `WebMvcConfigurer`, and `HandlerMethodArgumentResolver` components. Other Spring beans (annotated with @Component, @Service, @Repository, etc.) will not be scanned when using this annotation.

In contrast to `@SpringBootTest`, which loads the entire configuration.

```java
@RunWith(SpringRunner.class) 
@WebMvcTest(controllers= TodoController.class) 
public class TodoControllerTests {

  @Autowired 
  private MockMvc mvc;
  
  @MockBean 
  private TodoRepository todoRepository;
  
  @Test 
  public void testShowAllTodos() throws Exception {
  
    Todo todo1 = new Todo(1, "Todo1",false); 
    Todo todo2 = new Todo(2, "Todo2",true);
  
    given(this.todoRepository.findAll())
      .willReturn(Arrays.asList(todo1, todo2));
  
    this.mvc.perform(get("/todolist") 
      .accept(MediaType.TEXT_HTML)) 
      .andExpect(status().isOk()) 
      .andExpect(view().name("todos")) 
      .andExpect(model().attribute("todos", hasSize(2))) ;
  
      verify(todoRepository, times(1)).findAll();
  }
}
```

You have annotated the test with `@WebMvcTest(controllers = TodoController.class)` by explicitly specifying which controller you are testing. As @WebMvcTest doesn’t load other regular Spring beans and TodoController depends on TodoRepository, **you provided a mock bean using the @MockBean annotation**. The @WebMvcTest autoconfigures MockMvc, which can be used to test controllers without starting an actual servlet container.


## What are the differences between @MockBean and @Mock?

**`@Mock`**
`@Mock` = `Mockito.mock()`. It's a from Mockito library.

**`@MockBean`**
This is indeed a Spring Boot class.
t allows to add Mockito mocks in a Spring ApplicationContext.
If a bean, compatible with the declared class exists in the context, it replaces it by the mock.
If it is not the case, it adds the mock in the context as a bean.


## When do you want @DataJpaTest for? What does it auto-configure?

- The `@DataJpaTest` annotation **doesn’t load other Spring beans** (@Components, @Controller, @Service, and annotated beans) into ApplicationContext.

- Enable transactions by applying Spring's @Transactional annotation to the test class Enable caching on the test class, defaulting to a NoOp cache instance

- Autoconfigure an embedded test database in place of a real one Create a **TestEntityManager** bean and add it to the application context

- Regular @Component beans are not loaded into the ApplicationContext.

```java
@RunWith(SpringRunner.class) 
@DataJpaTest public class UserRepositoryTests {

  @Autowired 
  private UserRepository userRepository;

  @Test 
  public void testFindByEmail() { 
    User user = userRepository.findByEmail("admin@gmail.com"); 
    assertNotNull(user); 
  }
}
```

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
4. [Pro Spring Boot](https://www.apress.com/br/book/9781484214312/)
5. [Beginning Spring Boot 2](https://www.apress.com/gp/book/9781484229309)
6. [Spring Boot 2 Recipes](https://www.apress.com/gp/book/9781484239629)