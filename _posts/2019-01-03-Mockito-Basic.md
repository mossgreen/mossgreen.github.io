---
title: Mockito Basic
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

“Once,” said the Mock Turtle at last, with a deep sigh, “I was a real Turtle.”
—Alice In Wonderland, Lewis Carroll

## Mockito Basic

Knowing the SUT(system under test) is important. In order to test a SUT (the class to be tested), a developer must make sure that the class’s dependencies won’t interfere with its tests.

- You can use either mocks and stubs for the dependency.
- A stub is a fake class that comes with preprogrammed return values. It’s injected into the class under test to give you absolute control over what’s being tested as input. A typical stub is a database connection that allows you to mimic any scenario without having a real database.
- A mock is a fake class that can be examined after the test is finished for its interactions with the class under test. For example, you can ask it whether a method was called or how many times it was called. Typical mocks are classes with side effects that need to be examined, e.g. a class that sends emails or sends data to another external service.
- You can use Mockito in either Integration Test or Unit tests
- Common targets for mocking are:
  - Database connections,
  - Web services,
  - Slow classes,
  - Classes with side effects, and
  - Classes with non-deterministic behaviour.

### How to mock a behaviour

1. Before method run, you tell Mockito what to do when methods got called
2. While method run, mock instance run without dependencies
3. After method run, you verify the result

Mockito offers two ways of stubbing.

1. when this method is called, then do something
2. Do something when this mock’s method is called with the given arguments

The first way is considered preferred because: it is **typesafe** and **readable**

However, sometimes you’re forced to use the second way, such as when stubbing a real method of a spy because calling it may have unwanted side effects.

## Enable Mockito annotations

### With jUnit 4

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

### With jUnit 5

```java
@ExtendWith(MockitoExtension.class)
class MockitoAnnotationTest {}
```

## Common Annotations

- `@Mock` creates and injects mocked instances. It equals to `Mockito.mock`.
- `@Spy` spy the behavious (in order to verify them).
- `Captor` to create an ArgumentCaptor instance.
- `@InjectMocks` to inject mock fields into the tested object automatically.
- `@MockBean` uses in Spring Boot. We use it to add mock objects to the Spring application context. The mock will replace any existing bean of the same type in the application context. It's useful when you need to mock an external service.

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

It's partial mocking the object.

- You can mock its behaviour
- Othewise it uses `real` method

```java
@Spy
List<String> spiedList = new ArrayList<String>();

@Test
public void whenUseSpyAnnotation_thenSpyIsInjectedCorrectly() {
    spiedList.add("one");
    spiedList.add("two");

    Mockito.verify(spiedList).add("one");
    Mockito.verify(spiedList).add("two");

    assertEquals(2, spiedList.size());

    Mockito.doReturn(100).when(spiedList).size();
    assertEquals(100, spiedList.size());
}
```

### 3. `@Captor`

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

  ```java
    public class AppleService {
    @Inject
    SQSService sqsService;

        public void updateApple(){
            var event = new UpdatedAppleEvent();
            sqsService.queueEventWorker(event);
        }
    }

    public class AppleServiceTest {

        @Inject
        AppleService appleService;

        @InjectMock
        SQSService sqsService;

        @Captor
        ArgumentCaptor<UpdatedAppleEvent> eventCaptor =  ArgumentCaptor.forClass(UpdatedAppleEvent.class);

        @Test
        void testSendsEventToQueue() {
            appleService.updateMeasurements();

            Mockito.verify(sqsService).queueEventWorker(eventCaptor.capture());
            ScoutingMeasurementEvent event = eventCaptor.getValue();
            assertThat(event).isNotNull();
        }
    }
  ```

### 4. `@InjectMocks`

It's used to instantiate the `@InjectMock` annotated field and inject all the `@Mock` or `@Spy` annotated fields into it (if applicable).

All test class fields are scanned for annotations and proper test doubles are initialized and injected into the `@InjectMocks` annotated object (either by a constructor, property setter, or field injection, in that precise order).

If Mockito is not able to inject test doubles into the `@InjectMocks` annotated fields through either of the strategies, it won't report failure—the test will continue as if nothing happened (and most likely, you will get NullPointerException).

```java

public class Box { 
    Shoes shoes;
}

@Mock Shoes mockShoes;
@InjectMocks Box box; // mockShoes will be initialised and inject into box

@Test
public blah(){}
```

### 5. `@MockBean`

Mockito in Spring Boot

`@MockBean`

- It is a Spring Boot annotation,
- It allows to add Mockito mocks in a Spring ApplicationContext.
- If a bean, compatible with the declared class exists in the context, it replaces it by the mock.
- If it is not the case, it adds the mock in the context as a bean.
- used to define a new Mockito mock bean or replace a Spring bean with a mock bean and inject that into their dependent beans.
- The annotation can be used directly on test classes, on fields within your test, or on `@Configuration` classes and fields.
- When used on a field, the instance of the created mock is also injected
- Mock beans will be automatically reset after each test method.
- If your test uses one of Spring Boot’s test annotations (such as`@SpringBootTest`), this feature is automatically enabled.

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

## Argument Matchers

## Returing Custom Response

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

2. Do... When

   ```java
   doAnswer(invocation -> invocation.getArgument(0) + "!")
          .when(passwordEncoder).encode("1");

   doThrow(new IllegalArgumentException()).when(passwordEncoder).encode("1");

   doThrow(IllegalArgumentException.class).when(passwordEncoder).encode("1");

   ```

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

## Handle expected exception

### In jUnit 4

```java
when(myMock.doSomething()).thenThrow(new MyException());
@Test(expected=MyException.class)
```

```java
@Rule
public ExpectedException expectedException = ExpectedException.none();

@Test
public void testExceptionMessage() throws Exception {
    expectedException.expect(AnyException.class);
    expectedException.expectMessage("The expected message");

    given(foo.bar()).willThrow(new AnyException("The expected message"));
}
```

### In jUnit 5

```java
@Test
void offeringPricesIsNull() {
    Exception theException = Assertions.assertThrows(IllegalArgumentException.class, () -> {
        CalculatorUtils.calculateMonthlyBill(null, 1d);
    });

    String actualMessage = exception.getMessage();
}
```

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
- [Mock objects for testing java systems](https://link.springer.com/article/10.1007/s10664-018-9663-0)

Last update: 12 2021 on Captor
