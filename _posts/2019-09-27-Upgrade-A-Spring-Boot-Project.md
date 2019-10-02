---
title: Upgrade A Spring Boot Project from 2.0 to 2.1
search: true
tags: 
  - Java
  - Sprint Boot
  - Gradle
  - Flyway
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Upgrade Java, Spring Boot, Gradle, Flyway, etc.

## Why upgrade

- Faster
- Security
- Eliminate risks of upgrading to a higher version


## Processes

1. Before the upgrade, run all unit tests
2. Upgrade Gradle, Spring Boot, Java
3. Implement fix to make it builds
4. Run Unit tests or implements fix


## Details

### Update Gradle wrapper from 4.7 to 5.6

1. Update local Gradle to latest version (5.6)
    ```bash
    $ sdk list gradle
    $ sdk use gradle 5.6.2
    ```

2. Generate lastest Gradle Wrapper
    ```bash
    $ gradle wrapper
    ```
3. Check `gradle/wrapper/gradle-wrapper.properties` file
      ```bash
      distributionUrl=https\://services.gradle.org/distributions/gradle-5.6.2-bin.zip
      ```

### Upgrade Spring Boot from 2.0 to 2.1.8

1. Generate new `build.gradle`
    
    Go to [Spring Initializr](https://start.spring.io/), regenerate your dependencies. It uses a new default format of `build.gradle` and latest version. Tick Java 11, we'll talk it later.

2. Allow bean definition override

    ```properties
    spring.main.allow-bean-definition-overriding=true
    ```
    1. We customized `Flyway` bean to run with dynamic databases.
    2. We override bean in unit tests because we don't want the real instance to load.

3. Lombok changes

    >Spring Boot 2.1 has upgraded to Lombok `1.18.x` from `1.16.x`. In `1.18`, Lombok will no longer generate a private, no-args constructor by default. It can be enabled by setting `lombok.noArgsConstructor.extraPrivate=true` in a `lombok.config` configuration file.

4. Flyway changes

    //todo

### Oracle Java 8 to OpenJDK Java 11

There is a Java 9 introduced bug, please see [this interesting blog](https://blog.andornot.com/blog/java-11-date-parsing-locale-locale-locale/).

// todo a workaround


## References
1. [Spring Boot 2.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.1-Release-Notes#bean-overriding)
2. [Java 11 date parsing? Locale, locale, locale](https://blog.andornot.com/blog/java-11-date-parsing-locale-locale-locale/)