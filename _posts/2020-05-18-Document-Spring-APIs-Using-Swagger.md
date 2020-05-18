---
title: Swagger in Spring
search: true
tags: 
  - API
  - Swagger
  - Spring
  - Spring Boot
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Use Swagger to document Spring porject's APIs

## What is Swagger

Swagger UI is a built-in solution which makes user interaction with the Swagger-generated API documentation much easier.

Springfox also supports the bean validation annotations through its springfox-bean-validators library.

Swagger UI With an OAuth-secured API

## Why we need to use it

disadvantage

Benefits

## Swagger interfaces

4 parts

## Integrating Swagger with Spring Boot

Swagger specifications are implemented by Springfox suit of java libraries.

, using Maven

```xml
<dependencies>
 <dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger2</artifactId>
  <version>2.6.1</version>
 </dependency>
 <dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger-ui</artifactId>
  <version>2.6.1</version>
 </dependency>
</dependencies>
```

using Gradle

```properties
compile "io.springfox:springfox-swagger2:2.6.1"
compile 'io.springfox:springfox-swagger-ui:2.6.1'
```

## Default configuration

1. The @EnableSwagger2 annotation is used to enable Swagger 2 support for the application.
2. All the configuration is done through the Docket Bean. You can give a title and write a nice description for your apis using apiInfo configuration.
3. Also, you can decide which apis to include in the documentation by selecting paths which matches your predicates.
4. go to /swagger-ui.html endpoint to access swagger documentation.

## Integrating Swagger with Spring (without Boot)

If you are not using Spring boot in your project, then /swagger-ui.html endpoint will give 404 not found error because no resource handler is configured for this endpoint.

Swagger UI adds a set of resources which you must configure as part of a class that extends WebMvcConfigurerAdapter, and is annotated with @EnableWebMvc.

create a WebMvcConfig.java file inside config package of your project with the following contents -

```java
@Configuration
@EnableWebMvc
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");

        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
```

## swagger config file

```java
@Bean
public Docket api() {
return new Docket(DocumentationType.SWAGGER_2)
.select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo());
}
private ApiInfo apiInfo() {
return new ApiInfo(){

```

## Swagger API annotations

## Bean Validations

Springfox also supports the bean validation annotations through its springfox-bean-validators library.

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-bean-validators</artifactId>
    <version>2.9.2</version>
</dependency>
```

## Controllers grouping, tags

```java
@Api(tags = "教师管理")
@RestController
@RequestMapping(value = "/teacher")
static class TeacherController {

    // ...

}

@Api(tags = "学生管理")
@RestController
@RequestMapping(value = "/student")
static class StudentController {

    // ...

}
```

## API Versioning

Spring Boot does not provide any dedicated solutions for versioning APIs.

Swagger2 library, which provides a grouping mechanism from version 2.8.0, which is perfect for generating documentation of versioned REST API.

## Swagger UI With an OAuth-secured API

Let's see how we can allow Swagger to access an OAuth-secured API – using the Authorization Code grant type in this example.

We'll configure Swagger to access our secured API using the SecurityScheme and SecurityContext support:

```java
@Bean
public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2).select()
        .apis(RequestHandlerSelectors.any())
        .paths(PathSelectors.any())
        .build()
        .securitySchemes(Arrays.asList(securityScheme()))
        .securityContexts(Arrays.asList(securityContext()));
}
```

## References

<https://swagger.io/>
<https://springfox.github.io/springfox/docs/current/#introduction>
<https://www.baeldung.com/swagger-2-documentation-for-spring-rest-api>

<https://www.ibm.com/developerworks/cn/java/j-using-swagger-in-a-spring-boot-project/index.html>
<https://www.callicoder.com/documenting-spring-rest-apis-using-swagger/>

https://blog.csdn.net/qq122516902/article/details/89417964
