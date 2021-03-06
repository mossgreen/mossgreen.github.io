---
title: Validations in Spring
search: true
tags:
  - Spring
  - Bean Validation
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Spring integrates Bean Validation and gives you more

## 01. Validations in Java world

Validating data is a common task that occurs throughout an application, from the presentation layer to the persistence layer. Often the same validation logic is implemented in each layer, proving to be time-consuming and error-prone.

JSR (Java Specification Requests) has developed a Java Bean validation specification. Javax and Hibernate have implemented the specification.

Spring supports Bean validation and integrates Javax and Hibernate-validation and also adds more helper class to allow better validation.

I'll use the following DTO as an example:

```java
@Data
public class ToDoDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID uuid;

    @Email(message = "Please provide a valid Email")
    private String email;

    @Range(min = 13, max = 13, message = "Please provide a valid phone number. E.g., 0064-01-234-5678")
    private Integer phoneNumber;

    private String postAddress;

    @Digits(integer = 4, fraction =0,message = "Please provide a valid post code" )
    private String postCode;

    @NotBlank(message = "Content cannot be empty")
    private String content;

    @Future()
    private LocalDateTime due;
}
```

### Bean Validation API

Bean validation annotation constraints can be applied on types, fields, methods, constructors, parameters, container elements, and other container annotations. Validation is applied not only to the object level, but it can also be inherited from super classes. Entire object graphs can be validated, meaning that if a class declares a field that has the type of a separate class containing validation, cascading validation can occur.

It is specifically not tied to either the web tier or the persistence tier, and is available for both server-side application programming. It evolves as to 3 versions now:

1. [JSR-303 : Bean Validation](https://beanvalidation.org/1.0/spec/)
    - `Hibernate Validator 4.3.1.Final`
2. [JSR 349 : Bean Validation 1.1](https://beanvalidation.org/1.1/)
    - `Hibernate Validator 5.1.1.Final`
3. [JSR 380 : Bean Validation 2.0 (Jakarta Bean Validation)](https://beanvalidation.org/2.0/)
    - `Hibernate Validator 6.0.17.Final`

#### Official package

javax.validation is JavaBean Validation official package

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
```

### Hibernate implementation

You have noticed, hibernate has implemented it and uses it in different versions.

`Hibernate-Validator` extends `javax.validation`, e.g., it adds `@Range` and `@Length`.

You can mix the use of `javax.validation.constraints` and `org.hibernate.validator.constraints`.

for example, for our case, we imported both of them

```java
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Email;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotEmpty;
```

#### Hibernate-Validator Unit tests

You can get a validator by a `ValidatorFactory` and you can also just get it by `@Autowire` because Spring already provides a default validator.

```java
class ToDoDtoValidationTest {

    //@Autowired Validator validate

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void tesAllGood() {
        ToDoDto dto = new ToDoDto();
        dto.setEmail("example@example.com");
        dto.setPostCode(1234);
        dto.setContent("example");
        Set<ConstraintViolation<ToDoDto>> violations = validator.validate(dto);
        Assertions.assertTrue(violations.isEmpty(), "should be empty, however we got violations, size: " + violations.size());
    }

    @Test
    public void testContentIsEmpty() {

        ToDoDto dto = new ToDoDto();
        dto.setEmail("example@example.com");
        dto.setPostCode(1234);
        Set<ConstraintViolation<ToDoDto>> violations = validator.validate(dto);

        Assertions.assertEquals(1, violations.size(), "should be 1 exception");
    }
}
```

### Spring Validation

Spring supports Java’s Bean Validation API, This makes it easy to declare validation rules as opposed to explicitly writing declaration logic in your application code.

Spring provides a built-in validation API by way of the `Validator` interface. This interface allowing you to encapsulate your validation logic into a class responsible for validating the target object. In addition to the target object, the validate method takes an `Errors` object, which is used to collect any validation errors that may occur.

Spring also provides a handy utility class, ValidationUtils, which provides convenience methods for invoking other validators, checking for common problems such as empty strings, and reporting errors back to the provided Errors object.

LocalValidatorFactoryBean is a Spring-managed bean since Spring 3.0.

#### How to import validation package

1. If your spring-boot version is less than 2.3.x，`spring-boot-starter-web` has included `hibernate-validator` so you don't need to import other packages.
2. otherwise, you need to manually import either of the following packages:
    1. `hibernate-validator`
    2. `spring-boot-starter-validation`

### Where should the validation happen

Generally speaking, there are three layers we would like to implement validation:

- presentation layer, we must validate the DTO
- Service layer, something we need to do validation
- persistence layer, defitely you don't want to save some bad data

## 02. DTO Bean Validation in Spring, using @Valid

For now, we would like to know how Java Bean validation works in Spring.

Later, in the next chapter, we'll introduce the parameter validation in Spring. Parameters are not java beans, so you cannot use bean validation against them.

The above two validations would throw different kinds of exceptions, we'll cover it in a separate chapter.

Note that Spring MVC validates ViewModels (VM is not DTO) and put results to a BindResult, I don't have a plan to mention it in the following parts.

### Request body Validation with Bean Validation and Spring Validation

1. use Bean Validation, add `@Valid` in front of `@RequestBody` works. It validates all the fields before throwing exceptions. Invalid Request body throws `MethodArgumentNotValidException`.

    ```java
    @PostMapping
    ResponseEntity<ToDoDto> createTodo(@Valid @RequestBody ToDoDto toDoDto) {
        return ResponseEntity.ok(toDoDto);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        HttpHeaders headers = new HttpHeaders();
        String ResponseBody = "Response Body, should be a JSON";
        return new ResponseEntity(ResponseBody, headers, HttpStatus.BAD_REQUEST);
    }
    ```

2. use Spring Validation to validate Request Body

    1. class level `@Validated` doesn't help with Request Body validation
    2. Add `@Valdaited` in front of `@RequestBody` works, we'll explain why both of them work
    3. Without Spring data-binding and validation errors, it throws `MethodArgumentNotValidException` and goes to 400 error

    ```java
    @PostMapping
    ResponseEntity<ToDoDto> createTodo(@Validated @RequestBody ToDoDto toDoDto) {
        return ResponseEntity.ok(toDoDto);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        HttpHeaders headers = new HttpHeaders();
        String ResponseBody = "Response Body, should be a JSON";
        return new ResponseEntity(ResponseBody, headers, HttpStatus.BAD_REQUEST);
    }
    ```

3. Use Spring validation error binding and validation errors. You can take advantage of the errors object, it cotnains the filed and error message, so that you can return the error message to the API caller. It works for both Bean validation and Spring validation. It's from package  `org.springframework.validation`

```java
@PostMapping
ResponseEntity<ToDoDto> createTodo(@Valid @RequestBody ToDoDto toDoDto, Errors errors) {

    if (errors.hasErrors()) {
        throw new RuntimeException("Please handle these validation exceptions");
    }

    return ResponseEntity.ok(toDoDto);
}
```

```java
@PostMapping
ResponseEntity<ToDoDto> createTodo(@Validated @RequestBody ToDoDto toDoDto, Errors errors) {

    if (errors.hasErrors()) {
        throw new RuntimeException("Please handle these validation exceptions");
    }

    return ResponseEntity.ok(toDoDto);
}
```

### Testing with DTO Bean Validation

Note that you should customize the error message. We will do this in another chapter.

```java
@PostMapping
ResponseEntity<ToDoDto> createTodo(@Valid @RequestBody ToDoDto toDoDto) {
    return ResponseEntity.ok(toDoDto);
}

@ExceptionHandler({MethodArgumentNotValidException.class})
public ResponseEntity handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

    HttpHeaders headers = new HttpHeaders();
    String ResponseBody = "Response Body, should be a JSON";
    return new ResponseEntity(ResponseBody, headers, HttpStatus.BAD_REQUEST);
}
```

```java
@Test
void createToDoWithInvalidEmail() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@@");
    dto.setPostCode(1234);
    dto.setContent("exdample");

    String body = objectMapper.writeValueAsString(dto);

    mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("Response Body, should be a JSON"));
}

@Test
void createToDoWithValidEmail() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@example.com");
    dto.setPostCode(1234);
    dto.setContent("example");

    String body = objectMapper.writeValueAsString(dto);

    mockMvc.perform(post("/")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk());
}
```

## 03. Spring Parameter validation, introducing @Validated

Parameters are not JavaBeans, so Bean Validation doesn't help.
Spring implements parameter validation by itself.

The keys are:

1. add `@Validated` to the class you want to validate parameters. Without it, parameter validation is not enabled
2. you don't need to add `@Valid` to the parameter
3. it throws `ConstraintViolationException` if the parameter is invalid
4. it works for both `RequestParam` and `PathVariable`
5. you cannot use Errors Binding here, otherwise, you'll get an `IllegalStateException`

    ```java
    java.lang.IllegalStateException:
        An Errors/BindingResult argument is expected to be declared immediately after the model attribute,
        the @RequestBody or the @RequestPart arguments to which they apply:
            org.springframework.http.ResponseEntity
            com.mg.todo.ToDoController.fetchByEmail(
                    java.lang.String,org.springframework.validation.Errors)
    ```

### Example and test case

```java
import org.springframework.validation.annotation.Validated;

@Validated
@RestController
public class ToDoController {

    private final ToDoService toDoService;

    public ToDoController(ToDoService toDoService) {
        this.toDoService = toDoService;
    }

    @GetMapping
    ResponseEntity<List<ToDoDto>> fetchByEmail(@RequestParam("email") @Email(message = "should be a valid email") String email) {
        return ResponseEntity.ok(new ArrayList<ToDoDto>());
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity handleConstrainViolationException() {
        HttpHeaders headers = new HttpHeaders();
        String ResponseBody = "should be a valid email";
        return new ResponseEntity(ResponseBody,headers, HttpStatus.BAD_REQUEST );
    }
}
```

```java
@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = ToDoController.class)
class ToDoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    ToDoService toDoService;

    @Test
    void fetchByValidEmail() throws Exception {
        mockMvc.perform(get("/")
            .param("email","valid@example.com")
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());
    }

    @Test
    void fetchByInvalidEmail() throws Exception {
        mockMvc.perform(get("/")
            .param("email","invalid@@")
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("should be a valid email"));
    }
}
```

### You can also use @Validated for Request Body DTO validation

In the background, Spring wraps `Hibernate-Validator` and does the validation work.
Note that `resolveArgument()` method calls `validateIfApplicable(binder, parameter);` and this is the key.

It picks up `@Validate` parameters first and it triggers validation.
If it's absent, it looks for any parameters' annotation that start from `Valid`.

That's why `@Validated` works for both DTO and parameters and DTO here.

```java
package org.springframework.web.servlet.mvc.method.annotation;

/**
 * Resolves method arguments annotated with {@code @RequestBody} and handles return
 * values from methods annotated with {@code @ResponseBody} by reading and writing
 * to the body of the request or response with an {@link HttpMessageConverter}.
 */
public class RequestResponseBodyMethodProcessor extends AbstractMessageConverterMethodProcessor {

    /**
    * Throws MethodArgumentNotValidException if validation fails.
    * @throws HttpMessageNotReadableException if {@link RequestBody#required()}
    * is {@code true} and there is no body content or if there is no suitable
    * converter to read the content with.
    */
    @Override
    public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

        parameter = parameter.nestedIfOptional();
        Object arg = readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
        String name = Conventions.getVariableNameForParameter(parameter);

        if (binderFactory != null) {
            WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
            if (arg != null) {
                validateIfApplicable(binder, parameter);
                if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
                    throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
                }
            }
            if (mavContainer != null) {
                mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
            }
        }

        return adaptArgumentIfNecessary(arg, parameter);
    }
}
```

```java
package org.springframework.web.servlet.mvc.method.annotation;
/**
 * A base class for resolving method argument values by reading from the body of
 * a request with {@link HttpMessageConverter HttpMessageConverters}.
 */
public abstract class AbstractMessageConverterMethodArgumentResolver implements HandlerMethodArgumentResolver {
    /**
        * Validate the binding target if applicable.
        * <p>The default implementation checks for {@code @javax.validation.Valid},
        * Spring's {@link org.springframework.validation.annotation.Validated},
        * and custom annotations whose name starts with "Valid".
        */
    protected void validateIfApplicable(WebDataBinder binder, MethodParameter parameter) {
        Annotation[] annotations = parameter.getParameterAnnotations();
        for (Annotation ann : annotations) {
            Validated validatedAnn = AnnotationUtils.getAnnotation(ann, Validated.class);
            if (validatedAnn != null || ann.annotationType().getSimpleName().startsWith("Valid")) {
                Object hints = (validatedAnn != null ? validatedAnn.value() : AnnotationUtils.getValue(ann));
                Object[] validationHints = (hints instanceof Object[] ? (Object[]) hints : new Object[] {hints});
                binder.validate(validationHints);
                break;
            }
        }
    }
}
```

## 04. Handle Validation Errors

In the above examples, we would know:

1. Bean validation throws `MethodArgumentNotValidException`
    1. If we use parameter Error Binding, we can make use of the `errors` object.
    2. You can get each error by `ex.getBindingResult().getFieldErrors()`
2. Spring parameter validation throws `ConstraintViolationException`,
    1. it cannot use parameter Error Binding.
    2. You can get each error by `e.getConstraintViolations()`
3. There actually is another exception `org.springframework.validation.BindException`, thrown in MVC form submit `Content-Type: multipart/form-data`, we didn't mention this but you should know it exists.

A new issue comes out. How can we format/unify our error response body, so that the API caller would have a meaningful error message.

1. We should always return a unified Response entity for exceptions. Use `ResponseStatusException`
2. We could make use of `@RestControllerAdvice` to handle exception globally

### Returns Unified error response

this content is from [All You Need To Know About Bean Validation With Spring Boot](https://reflectoring.io/bean-validation-with-spring-boot/)

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidationErrorResponse {
    private List<Violation> violations = new ArrayList<>();
}

@Data
@AllArgsConstructor
 class Violation {
    private String fieldName;
    private String message;
}
```

```java
@ControllerAdvice
public class GlobalRestExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ValidationErrorResponse onMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ValidationErrorResponse error = new ValidationErrorResponse();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            error.getViolations().add(
                new Violation(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        return error;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ValidationErrorResponse onConstraintValidationException(
        ConstraintViolationException e) {
        ValidationErrorResponse error = new ValidationErrorResponse();
        for (ConstraintViolation violation : e.getConstraintViolations()) {
            error.getViolations().add(
                new Violation(violation.getPropertyPath().toString(), violation.getMessage()));
        }
        return error;
    }
}
```

```java
@Test
void createToDoWithInvalidEmail() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@@");
    dto.setPostCode("0060");

    String body = objectMapper.writeValueAsString(dto);

    final MvcResult mvcResult = mockMvc.perform(post("/")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andReturn();

    final String content = mvcResult.getResponse().getContentAsString();

    Assertions.assertNotNull(content);
    Assertions.assertTrue(content.contains("\"fieldName\":\"content\",\"message\":\"Content cannot be empty\""),"should contain this text");
    Assertions.assertTrue(content.contains("\"fieldName\":\"email\",\"message\":\"Please provide a valid Email\""),"should contain this text");
}
```

## 05. @Valid vs @Validated, validation groups using @Validated

Oftentimes, you need to validate a filed differently based on the scenario. A common case, we don't have an Id for an object on creating, however, we do need a valid id while updating. The `javax.validation` `@Valid` doesn't support Groups. The Spring `@Validated` does.

Steps:

1. Add groups to the Model
2. Use `@Validated` and Groups in Controller
3. MockMVC testing

### Use Validation Groups

```java
@Data
public class ToDoDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "Id should not be null on updating", groups = Update.class)
    private UUID uuid;

    @Email(message = "Please provide a valid Email", groups = {Create.class, Update.class})
    private String email;

    @Range(min = 13, max = 13, message = "Please provide a valid phone number. E.g., 0064-01-234-5678", groups = {Create.class, Update.class})
    private Integer phoneNumber;

    @Digits(integer = 4, fraction = 0, message = "Please provide a valid post code", groups = {Create.class, Update.class})
    private String postCode;

    @NotBlank(message = "Content cannot be empty", groups = {Create.class, Update.class})
    private String content;

    @Future(groups = {Create.class, Update.class})
    private LocalDateTime due;

    //on creating
    public interface Create { }

    // on updating
    public interface Update { }
}
```

```java
@PostMapping
ResponseEntity<ToDoDto> createTodo(@Validated(ToDoDto.Create.class) @RequestBody ToDoDto toDoDto) {
    return ResponseEntity.ok(toDoDto);
}
```

```java
@Test
void updateToDoWithUUID() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@example.com");
    dto.setPostCode("0060");
    dto.setContent("example");
    dto.setUuid(UUID.randomUUID());

    String body = objectMapper.writeValueAsString(dto);

    mockMvc.perform(put("/")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON));
}

@Test
void updateToDoWithoutUUID() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@example.com");
    dto.setPostCode("0060");
    dto.setContent("example");

    String body = objectMapper.writeValueAsString(dto);

    final MvcResult mvcResult = mockMvc.perform(put("/")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andReturn();

    String content = mvcResult.getResponse().getContentAsString();

    Assertions.assertTrue(content.contains( "violations"));
    Assertions.assertTrue(content.contains("Id should not be null on updating"));
}
```

## 06. @Valid vs @Validated, Collection validation using @Valid

In the Demo, all fields we validate are Java provided types, e.g., String, Long or LocalDateTime. However, it's not always the case.

1. we may need to validate another object nested in your DTO
2. We may need to validate a list of your DTOs

### Validate Nested object

```java
@Data
public class ToDoDto implements Serializable {

    // .... other fields

    @NotNull(groups = {Create.class, Update.class})
    @Valid
    private MetaData metaData;

    @Data
    public static class MetaData {

        @Min(value = 1, groups = Update.class)
        private Long Id;

        @NotNull(groups = {Create.class, Update.class})
        @Length(min = 2, max = 10, groups = {Create.class, Update.class})
        private String Name;

        @NotNull(groups = {Create.class, Update.class})
        @Length(min = 2, max = 10, groups = {Create.class, Update.class})
        private String position;
    }

    public interface Create { }
    public interface Update { }
```

In our case, if you have an empty Meta data object, you'll get the following error mesasge:

```json
{"violations":[
    {"fieldName":"metaData.Name","message":"must not be null"},
    {"fieldName":"metaData.position","message":"must not be null"}
    ]}
```

### Validate a list of DTOs

1. In `java.util.Collection`, `List` and `Set` don't work for validation
2. We need to implement our own collection, e.g., `myValidationList` to accept the data and do validation

#### Bean Validation doesn't work in List of DTOs

```java
@PostMapping(value = "/todos")
ResponseEntity<List<ToDoDto>> createTodos(@Validated(ToDoDto.Create.class) @RequestBody List<ToDoDto> toDoDtos) {
    return ResponseEntity.ok(toDoDtos);
}
```

```java
@Test
void createToDosWithInvalidEmailShouldBe400ButIs200() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@@");
    dto.setPostCode("0060");

    ToDoDto dto2 = new ToDoDto();
    dto2.setEmail("example@@");
    dto2.setPostCode("0060");

    String body = objectMapper.writeValueAsString(List.of(dto, dto2));

    mockMvc.perform(post("/todos")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk());
}
```

#### Implement MyValidationList for List of DTOs

It throws `org.springframework.beans.NotReadablePropertyException` if there is any violation

```java
public class MyValidationList<E> implements List<E> {
    @Delegate // lombok annotation
    @Valid
    public List<E> list = new ArrayList<>();
}
```

```java
@PostMapping(value = "/todos2")
ResponseEntity<List<ToDoDto>> createTodos2(@Validated(ToDoDto.Create.class) @RequestBody MyValidationList<ToDoDto> toDoDtos) {
    return ResponseEntity.ok(toDoDtos);
}

@ExceptionHandler({NotReadablePropertyException.class})
public ResponseEntity handleMethodArgumentNotValidException(NotReadablePropertyException e) {

    HttpHeaders headers = new HttpHeaders();
    String ResponseBody = e.getMessage();
    return new ResponseEntity(ResponseBody, headers, HttpStatus.BAD_REQUEST);
}
```

```java
@Test
void createToDosWithMyValidationListOfDtosWithInvalidEmail() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@@");
    dto.setPostCode("0060");

    ToDoDto dto2 = new ToDoDto();
    dto2.setEmail("example@@");
    dto2.setPostCode("0060");

    String body = objectMapper.writeValueAsString(List.of(dto, dto2));

    mockMvc.perform(post("/todos2")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isBadRequest());
}

@Test
void createToDosWithMyValidationListOfDtos() throws Exception {

    ToDoDto dto = new ToDoDto();
    dto.setEmail("example@example.com");
    dto.setPostCode("0060");
    dto.setContent("example");
    dto.setUuid(UUID.randomUUID());
    final ToDoDto.MetaData metaData = new ToDoDto.MetaData();
    metaData.setName("name");
    metaData.setPosition("position");
    dto.setMetaData(metaData);

    ToDoDto dto2 = new ToDoDto();
    dto2.setEmail("example@example.com");
    dto2.setPostCode("0060");
    dto2.setContent("example");
    dto2.setUuid(UUID.randomUUID());
    final ToDoDto.MetaData metaData2 = new ToDoDto.MetaData();
    metaData2.setName("name");
    metaData2.setPosition("position");
    dto2.setMetaData(metaData2);

    String body = objectMapper.writeValueAsString(List.of(dto));

    mockMvc.perform(post("/todos2")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk());
}
```

## 07. Declarative customized annotation validation

Again, in a real scenario, we may need more complicated logic than what Spring provides us.

Steps:

1. Add the new annotation interface
2. Add a customized validator and implement `ConstraintValidator`
3. Add this new annotation to the DTO
4. No need to do anything to the Controller or Service layer

```java
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {EncryptIdValidator.class})
public @interface NotGmail {

    String message() default "We don't support Gmail";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

```java
public class NotGmailValidator implements ConstraintValidator<NotGmail, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value != null) {
            return !value.toLowerCase().contains("@gmail");
        }
        return true;
    }
}
```

```java
@Data
public class ToDoDto implements Serializable {
    @Email(message = "Please provide a valid Email", groups = {Create.class, Update.class})
    @com.mg.todo.dto.NotGmail(message = "Sorry, no Google", groups = {Create.class, Update.class})
    private String email;
}
```

```java
@Test
void createToDoWithGoogleEmailShouldBeInvalid() throws Exception {
    ToDoDto dto = new ToDoDto();
    dto.setEmail("xiguadawang@gmail.com");
    dto.setPostCode("0060");
    dto.setContent("example");
    final ToDoDto.MetaData metaData = new ToDoDto.MetaData();
    metaData.setName("name");
    metaData.setPosition("position");
    dto.setMetaData(metaData);
    String body = objectMapper.writeValueAsString(dto);

    final MvcResult mvcResult = mockMvc.perform(post("/")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andReturn();

    final String content = mvcResult.getResponse().getContentAsString();

    Assertions.assertTrue(content.contains("{\"violations\":[{\"fieldName\":\"email\",\"message\":\"Sorry, no Google\"}]}"),"should contain this text");
}
```

## 08. Programmatic validator validation

Spring Boot provides us with a pre-configured Validator instance, and you can always explicitly reference the `javax.validation.Validator`.

It doesn't need the `@Validated` key world on the class name.

A scenario like when a new user registers. When all fields are good, we still need to validate the username is occupied or not.
We use declarative validation for the correctness of the email and we need to issue a database call to check the username which should be a programmatic validation.

### Spring Validator and Javax Validator works the same way

```java
@RestController
public class ToDoController {

    @Qualifier("defaultValidator")
    @Autowired
    private org.springframework.validation.Validator springValidator;

    @Autowired
    private javax.validation.Validator globalValidator;

    @PostMapping(value = "/javaxValidator")
    ResponseEntity<ToDoDto> createTodos3(@RequestBody ToDoDto toDoDto) {
        Set<ConstraintViolation<ToDoDto>> violations = globalValidator.validate(toDoDto, ToDoDto.Create.class);
        if (violations.isEmpty()) {
            // passed the validation, free to go
        } else {
            for (ConstraintViolation<ToDoDto> userDTOConstraintViolation : violations) {
                // Failed the validation, do your business here. E.g., send the error to a Queue
            }
        }
        return new ResponseEntity("Failed for javaxValidator", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/springValidator")
    ResponseEntity<ToDoDto> createTodos4(@RequestBody ToDoDto toDoDto) {
        Set<ConstraintViolation<ToDoDto>> violations = globalValidator.validate(toDoDto, ToDoDto.Create.class);
        if (violations.isEmpty()) {
            // passed the validation, free to go
        } else {
            for (ConstraintViolation<ToDoDto> userDTOConstraintViolation : violations) {
                // Failed the validation, do your business here. E.g., send the error to a Queue
            }
        }
        return new ResponseEntity("Failed for spring Validator", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
}
```

```java
@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = ToDoController.class)
class ToDoControllerTest {

    @Autowired
    private javax.validation.Validator globalValidator;

    @Qualifier("defaultValidator")
    @Autowired
    private org.springframework.validation.Validator springValidator;

    @Test
    void createToDosWithJavaxValidatorAndGoogleEmailShouldReturnBadRequest() throws Exception {

        ToDoDto dto = new ToDoDto();
        dto.setEmail("xiguadawang@gmail.com");
        dto.setPostCode("0060");
        dto.setContent("example");
        dto.setUuid(UUID.randomUUID());
        final ToDoDto.MetaData metaData = new ToDoDto.MetaData();
        metaData.setName("name");
        metaData.setPosition("position");
        dto.setMetaData(metaData);

        String body = objectMapper.writeValueAsString(dto);

        final MvcResult mvcResult = mockMvc.perform(post("/javaxValidator")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
            .andExpect(status().isBadRequest())
            .andReturn();

        final String content = mvcResult.getResponse().getContentAsString();
        Assertions.assertEquals("Failed for javaxValidator", content);
    }

    @Test
    void createToDosWithSpringValidatorGmailShouldReturnBadRequest() throws Exception {

        ToDoDto dto = new ToDoDto();
        dto.setEmail("xiguadawang@gmail.com");
        dto.setPostCode("0060");
        dto.setContent("example");
        dto.setUuid(UUID.randomUUID());
        final ToDoDto.MetaData metaData = new ToDoDto.MetaData();
        metaData.setName("name");
        metaData.setPosition("position");
        dto.setMetaData(metaData);

        String body = objectMapper.writeValueAsString(dto);

        final MvcResult mvcResult = mockMvc.perform(post("/springValidator")
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
            .andExpect(status().isBadRequest())
            .andReturn();

        final String content = mvcResult.getResponse().getContentAsString();
        Assertions.assertEquals("Failed for spring Validator", content);
    }
}
```

### Configure Validator Bean in Spring

You can configure a Validator bean by yourself. By default, it uses `HibernateValidator.class`, there are other options like `ApacheValidationProvider.class`.

A benefit of configuring it is to make it fail fast.

In failFast mode, it throws an exception on the first violation.

```java
@Bean
public Validator validator() {
    ValidatorFactory validatorFactory = Validation.byProvider( HibernateValidator.class)
        .configure()
        .failFast(true)
        .buildValidatorFactory();
    return validatorFactory.getValidator();
}
```

```java
ValidatorFactory validatorFactory = Validation.byProvider( HibernateValidator.class )
        .configure()
        .addProperty( "hibernate.validator.fail_fast", "true" )
        .buildValidatorFactory();
    return validatorFactory.getValidator();
```

## 09. Service layer validation needs both @Validate and @Valid

```java
@Service
@Validated
class ValidatingService{

    void validateInput(@Valid DTO dto){
      // do something
    }
}
```

## 10. Persistence layer validation

1. By default, Spring uses Hibernate-Validator by default so that it supports Bean Validation out of the box
2. The validation happends on the repository save or update method
3. No need to add any annotation to the Repository
4. It throws `ConstraintViolationException` on violations

## References

- [Spring Validation最佳实践及其实现原理](https://blog.csdn.net/j3T9Z7H/article/details/108288896)
- [Complete Guide to Validation With Spring Boot](https://reflectoring.io/bean-validation-with-spring-boot/)
- [Jakarta Bean Validation - Constrain once, validate everywhere](https://beanvalidation.org/)
