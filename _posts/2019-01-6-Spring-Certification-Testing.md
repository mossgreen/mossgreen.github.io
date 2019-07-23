---
title: Spring Testing in Spring Certification
search: true
tags: 
  - Spring
  - Spring Testing
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

Spring framework has great support for testing.

SpringRunner is a custom JUnit runner helping to load the Spring ApplicationContext by using @ContextConfiguration(classes=AppConfig.class)

```java
@RunWith(SpringRunner.class) 
@ContextConfiguration(classes=AppConfig.class) 
public class UserServiceTests {

  @Autowired 
  UserService userService;
  
  @Test 
  public void should_load_all_users() {

    List<User> users = userService.getAllUsers();
    
    assertNotNull(users);
    assertEquals(10, users.size()); 
  }
}
```


## What type of tests typically use Spring?
- Spring provides mock objects and testing support classes for **Unit Testing**.
  - Tests one unit of functionality
  - Keeps dependencies minimal
  - Isolate from the environment (including Spring)

- Spring provides first-class support for **integration testing**. 
  - Tests the interaction of multiple units working together
  - Integrates infrastructure like database


## How can you create a shared application context in a JUnit integration test?

Spring’s integration testing support has the following primary goals:

- To manage Spring IoC container caching between tests. By default, once loaded, the configured ApplicationContext is reused for each test
- To provide Dependency Injection of test fixture instances.
- To provide transaction management appropriate to integration testing.
- To supply Spring-specific base classes that assist developers in writing integration tests.

The core class of this module is `SpringJUnit4ClassRunner`, which is used to **cache** an `ApplicationContext` **across test methods**. It's a JUnit annotation.

1. Annotate the test class with `@RunWith(SpringJUnit4ClassRunner.class)`.

2. Annotate the class with `@ContextConfiguration`. It defines class-level metadata that is used to determine how to load and configure an ApplicationContext for integration tests.

    1. bean definitions are provided **by class** `AllRepoConfig`
        ```java
        @ContextConfiguration(classes = {AllRepoConfig.class}) 
        public class GenericQualifierTest {} 

        ```
      
    2. bean definitions are loaded from **file** all-config.xml
        ```java
        @ContextConfiguration(locations = {"classpath:spring/all-config.xml"}) 
        public class GenericQualifierTest {}
        
        @ContextConfiguration("/test-config.xml") 
        ublic class XmlApplicationContextTests { }
        ```
        
    3. from both config and xml
        ```java
        @ContextConfiguration(locations = "/test-context.xml", 
          loader = CustomContextLoader.class)
        public class CustomLoaderXmlApplicationContextTests { }
        ```
    
    4 . **If no attribute defined**: the default behavior of spring is to search for a file named `{testClassName}-context.xml` in the same location as the test class and load bean definitions from there if found.
        
3. use `@Autowired` to inject beans to be tested.

**Another way** to access the application contect is by extending the **TestContext** support class specific to JUnit: `AbstractJUnit4SpringContextTests`. This class implements the `ApplicationContextAware` interface, so you can extend it to get access to the managed application context via the protected field `applicationContext`.

NB:
1. You have to delete the private field applicationContext and its setter method. 
2. Note that if you extend this support class, you don’t need to specify `SpringRunner` in the `@RunWith` annotation because this annotation is inherited from the parent.

```java
@ContextConfiguration(classes = BankConfiguration.class) 
public class AccountServiceJUnit4ContextTests extends AbstractJUnit4SpringContextTests {

private static final String TEST_ACCOUNT_NO = "1234"; 
private AccountService accountService;

@Before 
public void init() {
  accountService = applicationContext.getBean(AccountService.class);
  
  accountService.createAccount(TEST_ACCOUNT_NO);
  accountService.deposit(TEST_ACCOUNT_NO, 100); } 
}
```

## When and where do you use @Transactional in testing?

- At **method level**: the annotated test method(s) will run, each in its own transaction. By default, automatically rolled back after completion of the test.
- At **class level**: each test method within that class hierarchy runs within a transaction


## How are mock frameworks such as Mockito or EasyMock used?

Mockito lets you write tests by mocking the external dependencies with the desired behavior.

- `@Mock` to create a mock object 
- `@InjectMocks` has a behavior similar to the Spring IoC, because its role is to instantiate testing object instances and to try to inject fields annotated with @Mock or @Spy into private fields of the testing object.
- `@MockBean` is a Spring Boot annotation, used to define a new Mockito mock bean or replace a Spring bean with a mock bean and inject that into their dependent beans. Mock beans will be automatically reset after each test method.
- Use Mockito
    - Either: `@RunWith(MockitoJUnitRunner.class)` to initialize the mock objects.
    - OR: `MockitoAnnotations.initMocks(this)` in the JUnit `@Before` method.


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

`spring-boot-starter-test` pulls in the following all within test scope:
- JUnit: De-facto standard for testing Java apps 
- JSON Path: XPath for JSON 
- AssertJ: Fluent assertion library 
- Mockito: Java mocking library 
- Hamcrest: Library of matcher objects 
- JSONassert: Assertion library for JSON 
- Spring Test and Spring Boot Test: Test libraries provided by the Spring Framework and Spring Boot.

```
testCompile('org.springframework.boot:spring-boot-starter-test')
```

**Slice-based testing**




## What does @SpringBootTest do? How does it interact with @SpringBootApplication and
@SpringBootConfiguration?

**Spring Boot features** like loading external properties and logging, are available **only if** you create ApplicationContext using the `SpringApplication` class, which you’ll typically use in your entry point class. These additional Spring Boot features **won’t be available** if you use `@ContextConfiguration`.

`@SpringBootTest` uses **SpringApplication** behind the scenes to load ApplicationContext so that all the Spring Boot features will be available.

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

Spring Boot Test starter spring-boot-starter-test pulls in the JUnit, Spring Tes

## How to define a testing class in Spring? 

In order to define a test class for running in a Spring context, the following have to be done:

1. annotate the test class with `@RunWith(SpringJUnit4ClassRunner.class)`

2. annotate the class with `@ContextConfiguration` in order to tell the runner class where the bean definitions come from

3. use `@Autowired` to inject beans to be tested.


## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)