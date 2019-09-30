---
title: Upgrade A Spring Boot Project from 2.0 to 2.1
search: true
tags: 
  - Sprint Boot
  - Gradle
  - Flyway
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
// Todo 

- Gradle Wrapper 5.6
- Sprint Boot 2.0.0 -> 2.1.8
- Java 8 -> 11
- Flyway 6.0.5


### Update gradle wrapper from 4.7 to 5.6

1. Update local gradle to latest version (5.6)
    ```bash
    $ sdk list gradle
    $ sdk use gradle 5.6.2
    ```

2. Generate lastest Wrapper
    ```bash
    $ gradle wrapper
    ```
3. check `gradle/wrapper/gradle-wrapper.properties` file
      ```bash
      distributionUrl=https\://services.gradle.org/distributions/gradle-5.6.2-bin.zip
      ```