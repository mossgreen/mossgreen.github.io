---
title: Spring Testing in Spring Certification
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
Spring test in Spring professional certification (4%).


TESTING
## Do you use Spring in a unit test?
- The testable POJOs should be instantiated without any container.
- We don't necessarily need Spring in a unit test.
- However Spring IOC makes both unit and integration testing easier.


## What type of tests typically use Spring?
- Spring provides mock objects and testing support classes for **Unit Testing**.
  - Tests one unit of functionality
  - Keeps dependencies minimal
  - Isolate from the environment (including Spring)

- Spring provides first-class support for **integration testing**. 
  - Tests the interaction of multiple units working together
  - Integrates infrastructure like database


## How can you create a shared application context in a JUnit integration test?

The core class of this module is `org.springframework.test.context.junit4.SpringJUnit4ClassRunner`, which is used to **cache** an `ApplicationContext` **across test methods**.

1. Annotate the test class with `@RunWith(SpringJUnit4ClassRunner.class)`.

2. annotate the class with `@ContextConfiguration` in order to tell the runner class where the bean definitions come from.
```java
// bean definitions are provided by class AllRepoConfig 
@ContextConfiguration(classes = {AllRepoConfig.class}) 
public class GenericQualifierTest {...} 

// bean definitions are loaded from file all-config.xml 
@ContextConfiguration(locations = {"classpath:spring/all-config.xml"}) 
public class GenericQualifierTest {...}
```

3. use `@Autowired` to inject beans to be tested.


## When and where do you use @Transactional in testing?

- At **method level**: the annotated test method(s) will run, each in its own transaction. By default, automatically rolled back after completion of the test.
- At **class level**: each test method within that class hierarchy runs within a transaction


## How are mock frameworks such as Mockito or EasyMock used?

- A **mock object** replacing the dependency we are not interested in testing and helping to isolate the object in which we are interested. 
- Mock code does not have to be written, because there are a few **libraries and frameworks** that can be used to generate mock objects. 
- The mock object will implement the dependent interface on the fly. 
- **Before a mock object is generated**, the developer can configure its behavior: what methods will be called and what will they return. 
- The mock object can be used **after** that, and then expectations can be checked in order to decide the test result.

Mock objects have the **advantage over stubs** in that they are created dynamically and only for the specific scenario tested.


## How is @ContextConfiguration used?

> @ContextConfiguration defines class-level metadata that is used to determine how to load and configure an ApplicationContext for integration tests.

```java
@RunWith(SpringJUnit4ClassRunner.class) 
@ContextConfiguration(classes={KindergartenConfig.class, HighschoolConfig.class}) @ActiveProfiles("kindergarten") 
public class ProfilesJavaConfigTest {

  @Autowired 
  FoodProviderService foodProviderService;
}
```


## How does Spring Boot simplify writing tests?

1. `spring-boot-starter-test` adds the following test-scoped dependencies that can be useful when writing tests: JUnit, Spring Test, Spring Boot Test, AssertJ, Hamcrest, Mockito, JSONassert and JsonPath.

2. Spring Boot provides the @MockBean and @SpyBean annotations that allow for creation of Mockito mock and spy beans and adding them to the Spring application context.

3. Spring Boot provide an annotation, @SpringBootTest, which allows for running Spring Boot based tests and that provides additional features compared to the Spring TestContext framework.

4. Spring Boot provides the @WebMvcTest and the corresponding @WebFluxTest annotation that enables creating tests that only tests Spring MVC or WebFlux components without loading the entire application context.

5. Provides a mock web environment, or an embedded server if so desired, when testing Spring Boot web applications.

6. `spring-boot-test-autoconfigure` that includes a number of annotations that for instance enables selecting which auto-configuration classes to load and which not to load when creating the application context for a test, thus avoiding to load all auto-configuration classes for a test.

7. Auto-configuration for tests related to several technologies that can be used in Spring Boot applications. Some examples are: JPA, JDBC, MongoDB, Neo4J and Redis.


## What does @SpringBootTest do? How does it interact with @SpringBootApplication and
@SpringBootConfiguration?

`@SpringBootTest` should be used on a test class, provides features like:

1. If no **ContextLoader** is specified with `@ContextConfiguration`, it uses `org. springframework.boot.test.context.SpringBootContextLoader` by default.

2. Automated search for a Spring Boot configuration when nested `@Configuration` classes are used.

3. Loading environment-specific properties via the **properties** attribute.


5. Registering a `org.springframework.boot.test.web.client.TestRestTemplate` bean for use in web tests that use a fully running container.

```java
@RunWith(SpringRunner.class) 
@SpringBootTest(
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, 
  properties = {"app.port=9090"}) 
public class CtxControllerTest {
  // ...
}
```


## How to define a testing class in Spring? 

In order to define a test class for running in a Spring context, the following have to be done:

1. annotate the test class with `@RunWith(SpringJUnit4ClassRunner.class)`

2. annotate the class with `@ContextConfiguration` in order to tell the runner class where the bean definitions come from

3. use `@Autowired` to inject beans to be tested.


## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)