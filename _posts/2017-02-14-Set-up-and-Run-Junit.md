---
title: Set up and Run Junit in a Java project
search: true
tags: 
  - Testing
  - JUnit
  - TDD
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Set up and Run Junit in a Java project.

## set up a gradle project with JUnit

1. Add or update the Java project's `build.gradle` file. Add the dependencies.

    ```gradle
    plugins {
     id 'java'
     id 'idea'
    }
    sourceCompatibility = '11'

    repositories {
     mavenCentral()
    }

    dependencies {
     testImplementation('org.junit.jupiter:junit-jupiter:5.5.2')
     compileOnly 'org.projectlombok:lombok:1.18.10'
     annotationProcessor 'org.projectlombok:lombok:1.18.10'
    }

    test {
     useJUnitPlatform()
     testLogging {
      events "passed", "skipped", "failed"
     }
    }
    ```

2. Dependencies

    1. The `junit-jupiter-api` dependency allows us to write tests and extensions which use JUnit 5.
    2. The `junit-jupiter-engine` dependency is the main JUnit 5 library which allows us to run tests which use JUnit 5.
    3. The `junit-vintage-engine` dependency allows us to run tests which use JUnit 3 or

3. Gradle has a native support for JUnit 5, but this support isn’t enabled by default. To enable it:

    ```gradle
    test {
        useJUnitPlatform()
    }
    ```

4. Running Unit Tests With Gradle

    ```bash
    \$ gradle clean test
    ```

## Writting Unit tests using Junit

### 1. Naming convention

for the class, which follows ClassNameTest.
testMethodName

### 2. Annotations

1. `@RunWith` annotation
        - The @RunWith annotation accepts a class name.
        - The class should extend the org.junit.runner.Runner class.
        - A runner can change the characteristics of the test class; for example, a Spring runner enables Spring context initialization nature, or a Mockito runner initializes proxy objects annotated with the `@Mock` annotation.

2. The common test annotations used within a test class (imported from `org.junit.jupiter.api`) are:
        - @BeforeAll - executed before all methods in test lass
        - @BeforeEach - execute before each test method in test class
        - @Test - actual test method
        - @AfterEach - executed after each test method in test lass
        - @AfterAll - executed after all methods in test lass
3. Other basic but useful annotations:
        - @DisplayName - custom display name for test class or method
        - @Disabled - disabling test class or method
        - @RepeatedTest - make a test template out of the test method
        - @Tag - tag a test class or method for further test selection

```java
import org.junit.jupiter.api.*;

@DisplayName("JUnit5 - Test basics")
class JUnit5Basics {

    @BeforeAll
    static void beforeAll() {
        System.out.println("Before all tests (once)");
    }

    @BeforeEach
    void beforeEach() {
        System.out.println("Runs before each test");
    }

    @Test
    void standardTest() {
        System.out.println("Test is running");
    }

    @Disabled("Failing due to unknown reason")
    @DisplayName("Disabled test")
    @Test
    void disabledTest() {
        System.out.println("Disabled, will not show up");
    }
}
```

## Test Execution Lifecycle

In JUnit 5, by default a new test instance is created for each test method in a test class. This behaviour can be adjusted with class level `@TestInstance` annotation.

```java
import org.junit.jupiter.api.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("JUnit5 - Test lifecycle adjustments")
class JUnit5PerClassLifecycle { }
```

## Assertions

JUnit 5 comes with many standard assertions that can be found in `org.junit.jupiter.api.Assertions` class.

Basic assertions:
    - assertEquals,
    - assertArrayEquals,
    - assertSame, assertNotSame,
    - assertTrue,
    - assertFalse,
    - assertNull,
    - assertNotNull,
    - assertLinesMatch,
    - assertIterablesMatch

## Junit best practices

Our test code follows the structure pattern of Arrange-Act-Assert (AAA). Other common patterns include Given-When-Then and Setup-Exercise-Verify-Teardown (Teardown is typically not explicitly needed for unit tests), but we use AAA in this article.

<http://wiki.c2.com/?ArrangeActAssert>

## How to Run a JUnit

1. Maven

    ```bash
    // To run entire test suite:
    mvn test

    //To run single/specific test(s):
    mvn -Dtest=TestName test
    ```

2. Gradle

    ```bash
    //To run entire test suite:
    gradlew test

    //To run single/specific test(s):
    gradlew -Dtest.single=testName test
    ```

## Isues

1. Maven does not find JUnit tests to run

<https://stackoverflow.com/questions/6178583/maven-does-not-find-junit-tests-to-run>

By default Maven uses the following naming conventions when looking for tests to run:

Test*
*Test
*TestCase
Your test class doesn't follow these conventions. You should rename it or configure Maven Surefire Plugin to use another pattern for test classes.

## References

- [JUnit Tutorial: Setting Up, Writing, and Running Java Unit Tests](https://blog.parasoft.com/junit-tutorial-setting-up-writing-and-running-java-unit-tests)
- [Tutorialspoint: JUnit - Test Framework](https://www.tutorialspoint.com/junit/junit_test_framework.htm)
- [JUnit 5 - Quick Tutorial](https://blog.codeleak.pl/2017/10/junit-5-basics.html)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

last update: Dec 2019
