---
title: How to use Mockito
search: true
tags:
  - Mockito
  - Unit Test
  - Spring
  - Spring Boot
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

In Mockito Answer, we mock the process.

## Why Mockito

Unit tests are to test behaviours with initialing the real objects or load the real dependencies.
Mocks and stubs are fake Java classes that replace these external dependencies. Stubs have hard coded logic. Mockito is the most popular Mocking framework for unit tests written in Java.

Common targets for mocking are:

- Database connections,
- Web services,
- Classes that are slow ,
- Classes with side effects, and
- Classes with non-deterministic behavior.

## How to mock a behaviour

1. Before method run, you tell Mockito what to do when methods got called
2. While method run, mock instance run without dependencies
3. After method run, you verify the result

Mockito offers two ways of stubbing.

1. when this method is called, then do something
2. Do something when this mock’s method is called with the given arguments

The first way is considered preferred because

- it is typesafe and
- readable.

However, you’re forced to use the second way, such as when stubbing a real method of a spy because calling it may have unwanted side effects.

## Enable Mockito annotations

Two ways

1. Annotate the JUnit testing class

   Mockito runner initializes proxy objects annotated with the `@Mock` annotation.

   ```java
   @RunWith(MockitoJUnitRunner.class)
   public class MockitoAnnotationTest {}
   ```

2. Initialise it inside of `@Before`

   ```java
   @Before
   public void init() {
       MockitoAnnotations.initMocks(this);
   }
   ```

## Annotations

- `@Mock` creates and injects mocked instances. It equals to `Mockito.mock`.
- `@Spy` spy the behavious (in order to vefify them).
- `Captor` to create an ArgumentCaptor instance.
- `@InjectMocks` to inject mock fields into the tested object automatically.
- `@MockBean` uses in Srint Boot. We use it to add mock objects to the Spring application context. The mock will replace any existing bean of the same type in the application context. It's useful when you need to mock an external service.

### 1. `@Mock`

- Without `@Mock`

  ```java
  @Test
  public void testWithoutMockAnnotation() {
      List mockList = Mockito.mock(ArrayList.class);
      mockList.add("one");
  }
  ```

- With `@Mock`

  ```java
  @Mock List<String> mockedList;

  @Test
  public void testWithMockAnnotation() {
      mockList.add("one");
  }
  ```

### 2. `@Spy`

- Without `@Spy`

  ```java
  @Test
  public void testWithoutSpyAnnotation() {
      List<String> spyList = Mockito.spy(new ArrayList<String>());

      spyList.add("one");
      Mockito.verify(spyList).add("one");
  }
  ```

- With `@Spy`

  ```java
  @Spy List<String> spiedList = new ArrayList<String>();

  @Test
  public void testWithSpyAnnotation() {
      spiedList.add("one");
      Mockito.verify(spiedList).add("one");
  }
  ```

### 3. `@Captor`

- Without `@Captor`

  ```java
  @Test
  public void testWithoutCaptorAnnotation() {
      List mockList = Mockito.mock(List.class);
      ArgumentCaptor<String> arg = ArgumentCaptor.forClass(String.class);

      mockList.add("one");
      Mockito.verify(mockList).add(arg.capture());

      assertEquals("one", arg.getValue());
  }
  ```

- With `@Captor`

  ```java
  @Mock List mockedList;
  @Captor ArgumentCaptor argCaptor;

  @Test
  public void testWithCaptorAnnotation() {
      mockedList.add("one");
      Mockito.verify(mockedList).add(argCaptor.capture());

      assertEquals("one", argCaptor.getValue());
  }
  ```

### 4. `@InjectMocks`

It's used to instantiate the @InjectMock annotated field and inject all the @Mock or @Spy annotated fields into it (if applicable).

All test class fields are scanned for annotations and proper test doubles are initialized and injected into the @InjectMocks annotated object (either by a constructor, property setter, or field injection, in that precise order).

If Mockito is not able to inject test doubles into the @InjectMocks annotated fields through either of the strategies, it won't report failure—the test will continue as if nothing happened (and most likely, you will get NullPointerException).

### 5. `@MockBean`

The `@MockBean` will also be injected into the field.

```java
@RunWith(SpringRunner.class)
public class MockBeanAnnotationIntegrationTest {

    @MockBean
    UserRepository mockUserRepository;

    @Test
    public void givenCountMethodMocked_WhenCountInvoked_ThenMockValueReturned() {
        Mockito.when(mockUserRepository.getSomething())
            .thenReturn(new Something());
    }
}
```

## RETURNING CUSTOM RESPONSES

1. When... Then

   ```java
   when(passwordEncoder.encode("1")).thenAnswer(
          invocation -> invocation.getArgument(0) + "!");

   when(passwordEncoder.encode("1")).thenAnswer(invocation -> {
      throw new IllegalArgumentException();
   });

   // throw exception instance
   when(passwordEncoder.encode("1"))
     .thenThrow(new IllegalArgumentException());

   // throw exception class
   when(passwordEncoder.encode("1"))
     .thenThrow(IllegalArgumentException.class);
   ```

    ```

2. Do... When

   ```java
   doAnswer(invocation -> invocation.getArgument(0) + "!")
          .when(passwordEncoder).encode("1");

   doThrow(new IllegalArgumentException()).when(passwordEncoder).encode("1");

   doThrow(IllegalArgumentException.class).when(passwordEncoder).encode("1");

   ```

## Argument Matchers

- `eq()`
  //todo

## Mock a void method

## Mock a single saving

Saving a new User object, means service accept a user without Id and will return a user with id to the front end. When we mockito it, we would do it this way:

```java
when(mockingRepository.save(any(User.class))).thenAnswer(new Answer<String>() {
    @Override
    public User answer(InvocationOnMock invocation) throws Throwable {
        User user = (User)invocation.getArguments()[0];
        user.setId(999L);
        return user;
    }
});
```

## Mock a batch saving

In order to improve performance, we sometimes like to use saveAll() method. So this time we pass in a list of Users, here is the answer:

```java
Mockito.when(mockRepository.saveAll(any(ArrayList.class)))
    .thenAnswer(new Answer<List<User>>() {
        @Override
        public List<User> answer(InvocationOnMock invocation) throws Throwable {
            List<User> users = (List)invocation.getArguments()[0];

            User user = users
                    .filter(user -> user.getId() == null)
                    .findFirst()
                    .get();

            user.setId(999L);
            return users;
        }
    });
```

## Spy

Spy doesn't use as much as Mock.
It's useful for testing legacy code.
You create a spy and stub some of its methods to get the behaviour you want.

//todo

## What Mockito cannot do

Mockito cannot mock or spy on:

- Java constructs such as final classes and methods
- static methods,
- enums,
- private methods (with Spring ReflectionTestUtils)
- the `equals()` and `hashCode()` methods,
- primitive types, and
- anonymous classes.

Answer to this:

- PowerMockito, an extension of the Mockito, let us mock static and private methods.
- As per the design, you should not opt for mocking private or static properties because it violates the encapsulation.
- You should refactor the offending code to make it testable.

### Mockito mock private methods using RelectionTestUtils

The `org.springframework.test.util` package contains `ReflectionTestUtils`, which is a collection of relection-based utility methods to set a non-public field or invoke a private/protected setter method when testing the application code.

```java
public class ReflectionUtilsTest {

    @Test
    public void private_field_access() throws Exception {

        Secret myClass = new Secret();
        myClass.initiate("aio");

        Field secretField = ReflectionUtils.findField(Secret.class, "secret", String.class); assertNotNull(secretField);

        ReflectionUtils.makeAccessible(secretField);
        assertEquals("zko", ReflectionUtils.getField(secretField, myClass));

        ReflectionUtils.setField(secretField, myClass, "cool");
        assertEquals("cool", ReflectionUtils.getField(secretField, myClass));
    }
}
```

## Scenarios

### 1. The component is really bad designed and had too many dependencies

If we need to re-mock many dependency beans, how about we extract the logic into an abstract class?

```java
public abstract class MockedRepository {
    @MockBean
    public ApplicationContext applicationContext;

    @MockBean
    public NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @MockBean
    public JdbcTemplate jdbc;

    @MockBean
    public Security security;

    @MockBean
    public UsersRepository usersRepository;
}
```

### 2. To mock it self

```java
@RunWith(SpringRunner.class)
@ContextConfiguration
public class ItSelfRepositoryTest extends MockedRepository {

    @MockBean
    private DependencyOne dependencyOne;

    @MockBean
    private DependencyTwo dependencyTwo;

    @Autowired
    private ItSelfRepository itSelfRepository;

     @TestConfiguration
    static class ItSelfRepositoryConfiguration {
        @Bean
        public ItSelfRepository itSelfRepository() {
            return new ItSelfRepository();
        }
    }
}
```

### 3. Override default Spring-Boot application.properties settings in Junit Test

You can use `@TestPropertySource` to override values in `application.properties`. E.g., 

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ExampleApplication.class)
@TestPropertySource(locations="classpath:test.properties")
public class ExampleApplicationTests { }
```

NB. `@TestPropertySource` can accept a properties argument to overwrite some property inline, such as `@TestPropertySource(properties = "myConf.myProp=valueInTest")`, it's useful in case that you don't want a totally brand new property file.

## References

- [MOCKITO – ANSWER VS. RETURN](https://www.planetgeek.ch/2010/07/20/mockito-answer-vs-return/)
- [A Unit Testing Practitioner's Guide to Everyday Mockito](https://www.toptal.com/java/a-guide-to-everyday-mockito)
- [Stubbing and Mocking with Mockito 2 and JUnit](https://semaphoreci.com/community/tutorials/stubbing-and-mocking-with-mockito-2-and-junit)
- [Getting Started with Mockito Annotations](https://www.baeldung.com/mockito-annotations)

Last update: Dec 2019
