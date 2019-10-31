---
title: Mocking Batch Saving in Mockito
search: true
tags: 
  - Mockito
  - Unit Test
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

In Mockito Answer, we mock the process.

## Why Mockito

Unit tests are to test behaviours with initialing the real objects or load the real dependencies.

It's different from stubs. Stubs have hard coded logic.

Mockito is the most popular Mocking framework for unit tests written in Java


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
    ```java
    @RunWith(MockitoJUnitRunner.class)
    public class MockitoAnnotationTest {}
    ```

2. Initialise it inside of `@Before`
    ```
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

    //todo 

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
It's useful  for testing legacy code.
You create a spy and stub some of its methods to get the behaviour you want.

//todo

## References

- [MOCKITO – ANSWER VS. RETURN](https://www.planetgeek.ch/2010/07/20/mockito-answer-vs-return/)
- [A Unit Testing Practitioner's Guide to Everyday Mockito](https://www.toptal.com/java/a-guide-to-everyday-mockito)
- [Stubbing and Mocking with Mockito 2 and JUnit](https://semaphoreci.com/community/tutorials/stubbing-and-mocking-with-mockito-2-and-junit)
- [Getting Started with Mockito Annotations](https://www.baeldung.com/mockito-annotations)