---
title: Types of Software Testing
search: true
tags: 
  - Testing
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Test makes perfect.

## The different types of software testing

### 1. Manual vs. automated testing

Manual testing

- is done in person, by clicking through the application or interacting with the software and APIs with the appropriate tooling.
- is very expensive as it requires someone to set up an environment and execute the tests themselves, and it can be prone to human error as the tester might make typos or omit steps in the test script.

Automated tests

- are performed by a machine that executes a test script that has been written in advance.
- he quality of your automated tests depends on how well your test scripts have been written
- Automated testing is a key component of continuous integration and continuous delivery and it's a great way to scale your QA process as you add new features to your application. 

### 2. Functional Testing vs. Non-functional Testing

Functional Testing types include:

- Unit Testing
- Integration Testing
- System Testing
- Sanity Testing
- Smoke Testing
- Interface Testing
- Regression Testing
- Beta/Acceptance Testing

Non-functional Testing types include:

- Performance Testing
- Load Testing
- Stress Testing
- Volume Testing
- Security Testing
- Compatibility Testing
- Install Testing
- Recovery Testing
- Reliability Testing
- Usability Testing
- Compliance Testing
- Localization Testing

## Some Functional Testing that I'm interest in

### Unit Test

1. Testing of an individual software component
2. Done by developers rather than testers

### Integration Testing

1. Testing of all integrated modules to verify the combined functionality.
2. Modules are typically code modules, individual applications, client and server applications on a network, etc.

### Smoke Testing

1. It's intended to be a quick test to see if the application still works after a new release.
2. If you don't see or smell smoke, test is successful.

### Regression Testing

1. to ensure what has already been functioning properly in an application in the previous production release was not negatively-impacted by updates that were done to enhance the application to meet the requirements of the current release.
2. hard to cover all the system in Regression Testing, so typically Automation Testing Tools are used
3. Retest as much as you can

## Some Non-Functional Testing that I'm interest in

Performance Testing Vs Load Testing Vs Stress Testing 

### Performance Testing

- is to know how the components of a system are performing under a certain given situation.
- Resource usage, scalability, and reliability of the product are also validated under this testing.
- its goal is to establish the benchmark behavior of the system.
- does not aim to find defects in the application. It also does not pass or fail the test.
- It includes: Loading Testing, endurance Testing, Volume Testing, Scalability Testing, Spike Testing, Stree Testing.
- Performance Testing is the superset for both load & stress testing.
- E.g., a 70kb page would not take more than 15 seconds to load for the worst connection of 28.8kbps modem (latency=1000 milliseconds), while the page of the same size would appear within 5 seconds for the average connection of 256kbps DSL (latency=100 milliseconds).

### Load Testing

- Load testing is meant to test the system by constantly and steadily increasing the load on the system until it reaches the threshold limit. It is a subset of performance testing.
- can be easily done by employing any of the suitable automation tools available in the market. 
- **WAPT** and **LoadRunner** are two such famous tools that aid in load testing.
- Goal: To determine the upper limit of all the components of an application like a database, hardware, network, etc.

### Stress Testing

- various activities to overload the existing resources with excess jobs are carried out in an attempt to break the system down.
- Make sure a failure of the system and to monitor how the system recovers back gracefully. 
- may include synchronization issues, memory leaks, race conditions, etc. 
- The goal of stress testing is to analyze post-crash reports to define the behavior of the application after failure.

## References

- [Types of Software Testing – Complete List](https://www.testingexcellence.com/types-of-software-testing-complete-list/)
- [The different types of software testing](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing)
- [Performance Testing Vs Load Testing Vs Stress Testing](https://www.softwaretestinghelp.com/what-is-performance-testing-load-testing-stress-testing/)

last update: Nov 2019
