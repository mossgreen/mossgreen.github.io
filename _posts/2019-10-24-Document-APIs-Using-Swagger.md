---
title: Document APIs using Swagger
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

Use Swagger to document Spring boots porject's APIs

## Swagger instruction

Swagger is a set of API development tools from design, documentation, test and deployment.

Swagger UI is a built-in solution which makes user interaction with the Swagger-generated API documentation much easier.

Springfox also supports the bean validation (JSR-303) annotations through its `springfox-bean-validators` library.

## Integrating Swagger with Spring Boot

Gradle and Maven configs in V3 nd V2

### V3

```code
dependencies {
    implementation "io.springfox:springfox-boot-starter:3.0.0"
}
```

```xml
<pom>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-boot-starter</artifactId>
        <version>3.0.0</version>
    </dependency>
</pom>
```

### V2

```xml
<dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-swagger2</artifactId>
  <version>2.9.2</version>
</dependency>

<dependency>
 <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger-ui</artifactId>
  <version>2.9.2</version>
</dependency>

```

### Default configuration

1. The `@EnableSwagger2` annotation is used to enable Swagger 2 support for the application.
2. All the configuration is done through the Docket Bean. You can give a title and write a nice description for your apis using apiInfo configuration.
3. Also, you can decide which apis to include in the documentation by selecting paths which matches your predicates.
4. go to `/swagger-ui.html` endpoint to access swagger documentation.

### Integrating Swagger with Spring (without Boot)

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

### A Simple Sagger Config File

To document the service we use a Docket.
Docket stands for A summary or other brief statement of the contents of a document; an abstract.
Docket helps configure a subset of the services to be documented and groups them by name. Significant changes to this is the ability to provide an expressive predicate based for api selection.

```java
@Configuration
@EnableWebMvc //NOTE: Only needed in a non-springboot application
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example"))
                .paths(PathSelectors.any())
                .build();
    }


    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Moss' Swagger doc")
                .description("very basic, very simple")
                .contact(new Contact("Moss", "http://example.com", "moss@example.com"))
                .termsOfServiceUrl("http://www.example.com")
                .version("1.0")
                .build();
    }
}
```

## Swagger API annotations

### Model Example

- `@ApiModel`
- `@ApiModelProperty`
  - `value`, String
  - `name`, String
  - `data`Type, String
  - `required`, boolean
  - `example`, String
  - `hidden`, boolean
  - `allowEmptyValue`, boolean
  - `allowableValues`, for Enum

```java
@ApiModel(description = "this is a model for may be a user")
public class SomeModel {

    @ApiModelProperty(value = "ID", example = "100")
    private Integer id;

    @ApiModelProperty(value = "name", example = "Shown Mew")
    private String name;

    @ApiModelProperty(value = "some property blah~")
    private long someProperty;
 }
```

### Controller Example

- `@Api`
  - `tags`, String[]
  - `description`, String
- `@ApiOperation`
  - `value`, String
  - `notes`, String,
  - `tags`, String[]
  - `response`, Class<?>
  - `httpMethod`, String
- `​@ApiParam`
- `​@ApiImplicitParams`
- `​@ApiImplicitParam`
  - `paramType`, path, query, header, form
  - `dataType`, Long, String
  - `name`
  - `value`
  - `required`, true, false(default)
- `@ApiIgnore` Works when you don't want to expose some APIS via Swagger, e.g., `/delete`

```java
@ApiOperation(value = "Find pet by Status",
     ​notes = "${SomeController.findPetsByStatus.notes}",
     response = Pet.class)￼
@RequestMapping(value = "/findByStatus", method = RequestMethod.GET, params = {"status"}, produces="application/json")
public Pet findPetsByStatus(
   ​@ApiParam(value = "${SomeController.findPetsByStatus.status}",￼
        ​required = true,...)
   ​@RequestParam("status",
       ​defaultValue="${SomeController.findPetsByStatus.status.default}") String status) {￼
   ​//...
}

​@ApiOperation(notes = "Operation 2", value = "${SomeController.operation2.value}"...)￼
​@ApiImplicitParams(
    ​@ApiImplicitParam(name="header1", value="${SomeController.operation2.header1}", ...)￼
​)
​@RequestMapping(value = "operation2", method = RequestMethod.POST, produces="application/json")
​public ResponseEntity<String> operation2() {
  ​return ResponseEntity.ok("");
 ```

### Controllers grouping, tags

- `@Api`

```java
@Api(tags = "for teachers")
@RestController
@RequestMapping(value = "/teacher")
class TeacherController {
    // ...
}

@Api(tags = "for students")
@RestController
@RequestMapping(value = "/student")
static class StudentController {
    // ...
}
```

## APIs filtering

You may want to filter some APIs out from Swagger because they're sensitive, you can do this with either:

1. add `@ApiIgnore` to the endpoint
2. filter if out in Docket in `apis()` or `paths()`
    - `apis()` filter on packages
    - `paths()` filter for urls

```java
@ApiIgnore
public boolean delete(@PathVariable("id") int id)
``

```java
.apis(RequestHandlerSelectors.basePackage("example.sbswagger.controller"))
.paths(Predicates.or(PathSelectors.ant("/user/add"),
        PathSelectors.ant("/user/find/*")))
```

## Customisized response

Swagger allows us to overwirete the HTTP response using Docket `globalResponseMessage()`.
This is an example that we overwrite all 500 and 403 errors in GET. In `SwaggerConfig.java`, we do

```java
.useDefaultResponseMessages(false)
.globalResponseMessage(RequestMethod.GET, newArrayList(
new ResponseMessageBuilder()
              .code(500)
              .message("Server error")
              .responseModel(new ModelRef("Error"))
              .build(),
       new ResponseMessageBuilder()
              .code(403)
              .message("Resource unavailable")
              .build()
));
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

## QA

### NumberFormatException in Swagger upgrading

The issue

```code
ava.lang.NumberFormatException: For input string: ""
    at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
    at java.lang.Long.parseLong(Long.java:601)
    at java.lang.Long.valueOf(Long.java:803)
    at io.swagger.models.parameters.AbstractSerializableParameter.getExample(AbstractSerializableParameter.java:412)
```

The reason

In `@ApiModelProperty`, if your data type is `Long`, the default value is an empty string. It throws `NumberFormatException` while converting to a Long value.

The easiest way to fix it is to add a `example=12.34`. However, in most of the case, it's not a proper solution.

```java
@ApiModelProperty(value = "order Id",example = "1234")
private Long orderId;
```

The Fix

This bug is introduced in Swagger after 1.6.0, we would fix it by using the correct dependency in that version.

```xml
<dependencies>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <exclusions>
            <exclusion>
                <groupId>io.swagger</groupId>
                <artifactId>swagger-annotations</artifactId>
            </exclusion>
            <exclusion>
                <groupId>io.swagger</groupId>
                <artifactId>swagger-models</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
    </dependency>
    <!--Fix the NumberFormatException in Swagger 2.9.2-->
    <dependency>
        <groupId>io.swagger</groupId>
        <artifactId>swagger-models</artifactId>
        <version>1.6.0</version>
    </dependency>
    <dependency>
        <groupId>io.swagger</groupId>
        <artifactId>swagger-annotations</artifactId>
        <version>1.6.0</version>
    </dependency>
</dependencies>
```

### Migrate from V2 to V3 in spring boot projects

1. Remove library inclusions of earlier releases. Specifically remove `springfox-swagger2` and `springfox-swagger-ui` inclusions.
2. Remove the `@EnableSwagger2` annotations
3. Add the `springfox-boot-starter`

## References

- [Springfox document](https://springfox.github.io/springfox/docs/current/#introduction)
- [CSDN user blog](https://blog.csdn.net/qq122516902/article/details/89417964)
- [IBM Developer blog](https://www.ibm.com/developerworks/cn/java/j-using-swagger-in-a-spring-boot-project/index.html)
