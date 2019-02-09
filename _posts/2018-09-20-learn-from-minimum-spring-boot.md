---
title: Learn Java Bean Life Cycle from a Minimum Spring Boot App
search: true
tags: 
  - Maven
  - Spring Boot
  - Java
  - XML
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Learn Java Bean lifecycle in Spring Boot.


## Create a minimum Spring Boot App
Using spring initializer, but don't select of the dependencies, then genereated, and have a look at the `POM.xml`.

##  The POM.xml file in minimum Spring Boot App
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mossgreen</groupId>
    <artifactId>ihobb</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>ihobb</name>
    <description>ihobb</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

1. What is parent?
> The dependency management section is a mechanism for centralizing dependency information. When you have a set of projects that inherits a common parent it's possible to put all information about the dependency in the common POM and have simpler references to the artifacts in the child POMs.  -- maven.apache.org

> The `spring-boot-starter-parent` is a special starter that provides useful Maven defaults. It also provides a dependency-management section so that you can omit version tags for “blessed” dependencies. -- spring.io

In this case, of couse we can get rid of this parent by adopting the real dependency

```xml
<dependencyManagement>
   <dependencies>
    <dependency>
        <!-- Import dependency management from Spring Boot -->
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>1.4.3.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
    </dependency>

  </dependencies>
</dependencyManagement>
```

2. properties  
Define the JDK version, here is `1.8`

3. dependencies
Just like its name

4. build 
In order to crate a self-contained executable jar file, we archives all compiled classes along with all jar dependencies. We add `spring-boot-maven-plugin`.

## (to be continued...)


## References

- [Missing artifact org.springframework.boot:spring-boot-starter-parent:jar](https://stackoverflow.com/questions/35745971/missing-artifact-org-springframework-bootspring-boot-starter-parentjar1-3-2-r)

- [Developing Your First Spring Boot Application](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-first-application.html)