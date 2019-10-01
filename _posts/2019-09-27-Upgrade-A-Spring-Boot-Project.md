---
title: Lombok in Spring
search: true
tags: 
  - Spring
  - Lombok
  - Gradle
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Lombok makes Java prettier, and your life easier.

## Why do you want to use Lombok

1. Eliminate Java Boilerplate
2. Avoid Repetitive Code
3. The Builder Pattern
4. Logger

## How to use in your Spring project

### Gradle plugin

Makes it easy to deploy. See **[io.freefair.lombok](https://plugins.gradle.org/plugin/io.freefair.lombok)**.


### Gradle Built-in

tell Gradle to add Lombok only during compilation. See `build.gradle`

```bash
repositories {
    mavenCentral()
}

dependencies {
    compileOnly 'org.projectlombok:lombok:1.18.10'
    annotationProcessor 'org.projectlombok:lombok:1.18.10'
}
```


## My favourite Lombok features

### 1. @Getter/@Setter

1. put a @Getter and/or @Setter annotation on a class. In that case, it's as if you annotate all the non-static fields in that class with the annotation.
2. Disable setter or getter: `AccessLevel.NONE`
3. `@Accessors(fluent=true)` 
    ```java
    @Getter
    @Setter
    class myEntity{
        @Setter(AccessLevel.PROTECTED) 
        private String name;
    }
    ```

### 2. @ToString

1. By default, all non-static fields will be printed. 
2. skip some fields, you can annotate these fields with `@ToString.Exclude`.
3. @ToString can also be used on an enum definition.
    
    ```java
    @ToString
    public class myEntity {
    
        @ToString.Exclude 
        private AnotherEntity anotherEntity;
    }  
    ```

### 3. @EqualsAndHashCode

```java
@EqualsAndHashCode
public class myEntity {
    
    @EqualsAndHashCode.Exclude
    private AnotherEntity anotherEntity;
}
```
    
### 4. @NoArgsConstructor, @RequiredArgsConstructor and @AllArgsConstructor

- `@NoArgsConstructor` will generate a constructor with no parameters.
- `@RequiredArgsConstructor` generates a constructor with 1 parameter for each field that requires special handling. All non-initialized final fields get a parameter, as well as any fields that are marked as @NonNull that aren't initialized where they are declared.
- `@AllArgsConstructor` generates a constructor with 1 parameter for each field in your class. Fields marked with @NonNull result in null checks on those parameters.


### 5. @Data

A shortcut for @ToString, @EqualsAndHashCode, @Getter on all fields, @Setter on all non-final fields, and @RequiredArgsConstructor


### 6. @Log

You put the variant of @Log on your class (whichever one applies to the logging system you use); you then have a static final log field, initialized as is the commonly prescribed way for the logging framework you use, which you can then use to write log statements.

`@Slf4j`  Creates 

```java
private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LogExample.class);
```
```java
@Slf4j
public class LogExampleOther {
  
  public static void main(String... args) {
    log.error("Something else is wrong here");
  }
}
```


### 7. @Builder

1. The @Builder annotation produces complex builder APIs for your classes.
2. @Builder can be placed on a class, or on a constructor, or on a method.

    ```java
    @Builder
    public class BuilderExample {
      @Builder.Default 
      private long created = System.currentTimeMillis();
      
      private String name;
      
      private int age;
      
      @Singular 
      private Set<String> occupations;
    }
    ```


## References 

- [Project Lombok](https://projectlombok.org/)
- [Introduction to Project Lombok](https://www.baeldung.com/intro-to-project-lombok)