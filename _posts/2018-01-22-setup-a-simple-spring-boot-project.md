---
title: Setup a simplest Spring Boot Project
search: true
tags: 
  - Spring
  - Spring Boot
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---
Get a simplest Spring Boot project up and running.

## Where to start

1. [Spring initializr](https://start.spring.io/) (recommended)
2. Create project from your IDE: IntelliJ, or Eclipse, etc..

```bash
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	runtimeOnly 'org.postgresql:postgresql'
	annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

## How to import a existing project

1. Open the project using the build file  
In IntelliJ IDEA, Menu:
File | Open | Path_to_the_file | build.gradle
Open as a project

2. Build your project
    - make sure your select the correct version of java
    - make sure the gradle or maven version is correct. 


## How to run

1. IDEA recognises the `Main` method
2. Otherwise, you needto run it manually. **Application** class is normally in the class with `@SpringBootApplication`.
3. If you have DB dependencies, need to configure your db 
4. `application.properties`
    ```properties
    spring.datasource.driverClassName=org.postgresql.Driver
    spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/ihobbdb
    spring.datasource.username=myusername
    spring.datasource.password=mypassword
    
    spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQL9Dialect
    ```


## Git ignore

Checkout official `.gitignore` file from [Spring Boot](https://github.com/spring-projects/spring-boot/blob/master/.gitignore).


## Take ways

1. How fast is it to start?   
With db running, it's 3 seconds-ish
