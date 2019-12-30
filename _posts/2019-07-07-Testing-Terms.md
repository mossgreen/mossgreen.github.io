---
title: Testing Terms
search: true
tags: 
  - TDD
  - Unit Test
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Terms using in Unit Tests.

## Terms

1. Unit Tests
Code written by a developer to verify that another piece code—usually the implementation of a feature—works correctly.

2. TDD
In TDD, a failing test is written irst, then code is written to satisfy the test, and then the code quality is improved by refactoring the code and applying patterns. So unit tests drive the design.

3. JUnit
The most popular and widely used unit test framework for Java.

4. Test suite
A test suite groups and executes multiple tests.

5. Refactoring
Changing code without changing its behavior.

6. Happy path VS Corner cases
In TDD, the normal path of execution and, ideally, the general business use case. Because it delivers the highest business value, and gets us closer to the component's expected capabilities.
To recoginze corner cases:
    - Conformance: Does a value conform to an expected format?
    - Ordering: Is a set of values ordered appropriately?
    - Range: Is a value within a minimum and maximum definition?
    - Reference: Is there a reference to anything external that isn't controlled by your component (notifications)?
    - Existence: Does the value exist (for example not null, non-zero, present in a set, and so on)?
    - Cardinality: Are there exactly enough values?
    - Time (absolute and relative): Is everything happening in order? At the right time? In time?

7. SUT - system under test
It describes the system that we are testing. In a unit test, the first section creates an instance of the object to be tested. This section establishes the SUT's related state prior to any test activities.

8. DOC - depended-on component
Using a DOC that encapsulates access to external resources brings along testing related trouble in many respects:
    - Depending on the components that we cannot control might impede the decent verification of a test specification. Just think of our real-world web service that could be unavailable at times. This could cause a test failure, although the SUT itself is working properly.
    - DOCs might also slow down test execution. Again think of the web service example.
    - the DOC's behavior may change unexpectedly due to the usage of a newer version of the web service API, for example.
Practically, it implies that a component should be designed in such a manner that each DOC can be replaced by a so-called test double. This is a lightweight stand-in collaborator used instead of the real DOC.

9. Fixture
Because creating the testing object constitutes well-deined test input and preconditions, it is also called the fixture of a test. A test's ixture setup includes all the activities necessary to prepare a well-deined input state on which a component's functionality is invoked. This may affect things like component creation, setting of particular values, registering of test doubles, and so on

10. AAA
Structuring a test like: Arrange, Act, Assert.

11. Four-phases-pattern test
    - Setup always deines the test's precondition,
    - exercise actually invokes the functionality under test, and
    - verify checks the expected outcome that constitutes a component's behavior.
    - Last, teardown is all about housekeeping

12. Test Doubles
Test doubles serve various purposes like indirect input provisioning, recording of indirect output, or immediate veriication of interactions.
    1. Dummy: Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.
    2. Fake objects: actually have working implementations, but usually take some shortcut(limited capabilities) which makes them not suitable for production. It's like Test Stub, but lighter. E.g.,
        - In-memory test database
        - response from web services
    3. Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Two ways of doing this:
        - Hard coded TEst Staub, which will return the same response
        - Configurable Test Stub, which will return coresponding response
    4. Spies are stubs that also record some information based on how they were called. One form of this might be an email service that records how many messages it was sent.
    5. Mocks are pre-programmed with expectations which form a specification of the calls they are expected to receive. They can throw an exception if they receive a call they don't expect and are checked during verification to ensure they got all the calls they were expecting.
    Of these kinds of doubles, only mocks insist upon behavior verification. The other doubles can, and usually do, use state verification. Mocks actually do behave like other doubles during the exercise phase, as they need to make the SUT believe it's talking with its real collaborators - but mocks differ in the setup and the verification phases.

## References

1. [A Set of Unit Testing Rules](https://www.artima.com/weblogs/viewpost.jsp?thread=126923)
2. [What's the difference between a mock & stub?](https://stackoverflow.com/questions/3459287/whats-the-difference-between-a-mock-stub)
3. [TestDouble](https://martinfowler.com/bliki/TestDouble.html)
4. [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)

Last update: Dec 2019
