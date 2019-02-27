---
title: Mocking Batch Saving in Mockito
search: true
tags: 
  - Mockito
  - Unit Test
  - Testing
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

In Mockito Answer, we mock the process.

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

## References

- [MOCKITO – ANSWER VS. RETURN](https://www.planetgeek.ch/2010/07/20/mockito-answer-vs-return/)

- [Stubbing and Mocking with Mockito 2 and JUnit](https://semaphoreci.com/community/tutorials/stubbing-and-mocking-with-mockito-2-and-junit)