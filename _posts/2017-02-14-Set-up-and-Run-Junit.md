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

1. @Test annotation
2. There are many other annotations, but the more common are @Before (which runs some statement/precondition before @Test, public void), @After (which runs some statement after @Test, public void e.g. resetting variables, deleting temporary files, variables, etc.), and @Ignore (which ignores some statement during test execution -- note that @BeforeClass and @AfterClass are used for running statements before and after all test cases, public static void, respectively).

### The assert methods

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

Maven does not find JUnit tests to run
<https://stackoverflow.com/questions/6178583/maven-does-not-find-junit-tests-to-run>

By default Maven uses the following naming conventions when looking for tests to run:

Test*
*Test
*TestCase
Your test class doesn't follow these conventions. You should rename it or configure Maven Surefire Plugin to use another pattern for test classes.

## References

- [JUnit Tutorial: Setting Up, Writing, and Running Java Unit Tests](https://blog.parasoft.com/junit-tutorial-setting-up-writing-and-running-java-unit-tests)
- [Tutorialspoint: JUnit - Test Framework](https://www.tutorialspoint.com/junit/junit_test_framework.htm)

last update: Dec 2019
