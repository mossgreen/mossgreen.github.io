---
title: Spring REST in Spring Certification
search: true
tags: 
  - Restful
  - Spring
  - Spring REST
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

2. The next mandatory step is registering the class as an auto-configuration candidate, by adding the name of the class under the key `org.springframework.boot.autoconfigure.EnableAutoConfiguration` in the standard file `resources/META-INF/spring.factories`:

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.baeldung.autoconfiguration.MySQLAutoconfiguration
```

If we want our auto-configuration class to have priority over other auto-configuration candidates, we can add the @AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE) annotation.

Auto-configuration is designed using classes and beans marked with @Conditional annotations so that the auto-configuration or specific parts of it can be replaced.

Note that the auto-configuration is only in effect if the auto-configured beans are not defined in the application. If you define your bean, then the default one will be overridden.

Example, Using @Conditional Based on System Properties. implement the MySQLDatabaseTypeCondition condition to check whether the dbType system property is MYSQL

MySQLDatabaseTypeCondition.java 

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

@ConditionalOnBean: Matches when the specified bean classes and/or names are already registered.

@ConditionalOnMissingBean: Matches when the specified bean classes and/or names are not already registered.

@ConditionalOnClass: Matches when the specified classes are on the classpath.

@ConditionalOnMissingClass:  Matches when the specified classes are not on the classpath.

@ConditionalOnProperty: Matches when the specified properties have a specific value.

@ConditionalOnResource: Matches when the specified resources are on the classpath.

@ConditionalOnWebApplication: Matches when the application context is a web application context.


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
todo 

## How do you access an endpoint using a tag?
todo


## What is metrics for?

This endpoint shows the metrics information of the current application, where you can determine the how much memory it’s using, how much memory is free, the uptime of your application, the size of the heap is being used, the number of threads used, and so on.

One of the important features about this endpoint is that it has some counters and gauges that you can use, even for statistics about how many times your app is being visited or if you have the log file enabled. If you are accessing the /logfile endpoint, you will find some counters like counter.status.304.logfile, which indicates that the /logfile endpoint was accessed but hasn’t change. And of course you can have custom counters.


## How do you create a custom metric with or without tags?
todo

## What is Health Indicator?

This endpoint will show the health of the application. If you are doing a database app like in the previous section (/flyway) you will see the DB status and by default you will see also the diskSpace from your system. If you are running your app, you can go to http://localhost:8080/health.

## What are the Health Indicators that are provided out of the box?
todo

## What are the Health Indicator statuses that are provided out of the box

## How do you change the Health Indicator status severity order?

## Why do you want to leverage 3 rd -party external monitoring system?

---
# Spring Boot Testing

## When do you want to use @SpringBootTest annotation?

## What does @SpringBootTest auto-configure?

## What dependencies does spring-boot-starter-test brings to the classpath?

## How do you perform integration testing with @SpringBootTest for a web application?

## When do you want to use @WebMvcTest? What does it auto-configure?

## What are the differences between @MockBean and @Mock?

## When do you want @DataJpaTest for? What does it auto-configure?

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
4. [Pro Spring Boot](https://www.apress.com/br/book/9781484214312/)