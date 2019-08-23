---
title: Spring REST in Spring Certification
search: true
tags: 
  - Spring
  - Spring REST
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Spring REST in Pivotal Spring professional certification (6%).

## What does REST stand for?

REST stands for **RE**presentational **S**tate **T**ransfer.
REST is an **architecture style** for designing networked (distributed) applications.
RESTful applications use HTTP requests for all four CRUD (Create/Read/Update/Delete) operations.

- Representational: XML, JSON, File, HTML, or say anything
- State: 
- Transfer: REST involves transferring resource data, in some representational form, from one application to another


## What is a resource?

Information, like data, Json, xml, html, file, image, etc.

Resource can be identified by a Uniform Resource Identifier (URI).


## What does CRUD mean?

RESTful applications use HTTP requests to operate data in four CRUD (Create/Read/Update/Delete) operations.

- Create: POST
- Read: GET
- Update: PUT
- Delete: DELETE

![IMAGE](https://i.loli.net/2019/05/23/5ce653431c05e73185.jpg)


## Is REST secure? What can you do to secure it?

REST by default is not secure.

To secure it, can use:  
- HTTPS
- Basic Authentication
- JSON Web Tokens (JWT)
- OAuth2


## What are safe REST operations?  

In all, there are 9 different HTTP request types: 
- HEAD, 
- GET, 
- POST, 
- PUT, 
- DELETE, 
- PATCH, 
- TRACE, 
- OPTIONS, and 
- CONNECT

**Safe methods** are HTTP methods that do not modify resources. 
Spring Security implements CSRF protection with a synchronizer token. Statechanging requests(not safe methods) will be intercepted and checked for a CSRF token.
- GET
- HEAD
- OPTIONS
- TRACE

**Not Safe**:
- POST: 
    Two identical POST requests will result in two identical resources being created or errors at application level.
- PUT: it modifies the state on the server
- DELETE


## What are idempotent operations? Why is idempotency important?

**Idempotent** means you can **repeat** these operations over and over again, but the end result should be the **same**.

Idempotency operations:
- GET
- PUT
- DELETE


## Is REST scalable and/or interoperable?

### Scalability

REST is scalable, because it is stateless, its Cacheability and layered system. 

1. **Statelessness** ensures that requests can be processed by any node in a cluster of services without having to consider server-side state

2. **Cacheability** allows for creating responses from cached information without the request having to proceed to the actual service, which improves network efficiency and reduces the load on the  service.

3. A **layered system** allows for introducing intermediaries such as a load balancer without clients having to modify their behavior as far as sending requests to the service is concerned. The load balancer can then distribute the requests between multiple instances of the service in order to increase the request-processing capacity of the service.

### Interoperability   

The ability to exchange and make use of information.

1. REST service supports all formats of data: xml, json, file html
2. Resource can be identified by a Uniform Resource Identifier (URI). No special language needed
3. CRUD standard operation


## Which HTTP methods does REST use?

1. POST
2. GET
3. PUT: Update/Replace
4. PATCH: Update/Modify
5. DELETE


## What is an HttpMessageConverter?

1. The resource representation can have different formats: XML, JSON, HTML, etc.
2. The client must know the format to use, or request a resource with a representation it understands form the server. 
3. Representations are converted to HTTP requests and from HTTP responses by implementations `HttpMessageConverter` interface. 
    - Convert a `HttpInputMessage` to an object of specified type.
    - Convert an object to a `HttpOutputMessage`.
4. Message converters are automatically detected and used by Spring
5. JSON format, so MappingJackson2HttpMessageConverter is used.
6. the `consumes` and `produces` annotation attributes of the `@RequestMapping`
    - The **consumes** attribute defines 
        1. the consumable media types of the mapped request (defined on the **server**) 
        
        2. the value of the Content-Type header (defined on the **client** side) must match at least one of the values of this property in order for a method to handle a specific REST request.
    
    - The **produces** attribute defines the producible media types of the mapped request, narrowing the primary mapping, and the value of the Accept header (on the client side) must match at least one of the values of this property in order for a method to handle a specific REST request.

```java
@Configuration 
@EnableWebMvc 
@ComponentScan(basePackages = {"com.ps.web", "com.ps.exs"}) 
public class WebConfig extends WebMvcConfigurerAdapter {

  @Override 
  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    super.configureMessageConverters(converters);
    converters.add(mappingJackson2HttpMessageConverter()); 
  }
  
  @Bean
  public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
    MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter(); // when client is a browser JSON response is displayed indented 
    mappingJackson2HttpMessageConverter.setPrettyPrint(true); //set encoding of the response 
    mappingJackson2HttpMessageConverter.setDefaultCharset (StandardCharsets.UTF_8); 
    mappingJackson2HttpMessageConverter.setObjectMapper(objectMapper()); 
    return mappingJackson2HttpMessageConverter;
  }
}
```


## Is REST normally stateless?

Yes, it is stateless. 

Each request is independent, which improves scalability.


## What does @RequestMapping do?

1. Annotate both for **class** and **handler methods**.

2. `@RequestMapping` mehtods are **handler method**, it provides information regarding when method should be called.

3. Has various attributes to match by:
    - URL, 
    - HTTP method, 
    - request parameters, 
    - headers, 
    - produces: media types,
    - consumes: media type


## Is @Controller a stereotype? Is @RestController a stereotype?   

What is a stereotype annotation? What does that mean?

Stereotype annotations are annotations that are applied to classes that fulfills a certain, distinct, role.
- The main stereotype annotation is `@Component`.
- Both `@Controller` and `@RestController` are stereotypes
-  `@Controller` + `@ResponseBody` = `@RestController`


## What is the difference between @Controller and @RestController?

`@RestController`:
1. It's stereotype
2. All handler methods in the rest controller should have their return value written directly to the body of the response, rather than being carried in the model to a view for rendering.


## When do you need @ResponseBody?

With Spring 4.0, the `@ResponseBody` annotation has been moved to the type level, so it can be added to interfaces, classes, or other annotations.

1. on class: the controller becomes restcontroller.

2. on method: return serialized data througth **HttpMessageConverter** to response body, rather than passing the model and view. 
    ```java
    @RequestMapping(value="/test", 
      produces = {MediaType.APPLICATION_JSON_UTF8_VALUE}) 
    public @ResponseBody List<Journal> getJournal(){ 
      return repo.findAll(); 
    }
    
    @ResponseStatus(HttpStatus.OK) 
    @RequestMapping(value = "/listdata", method = RequestMethod.GET) 
    @ResponseBody 
    public Singers listData() { 
      return new Singers(singerService.findAll()); 
    }
    ```


## What does @PathVariable do?

`@PathVariable` maps a part of the URL, an URI template variable, to a handler method argument


## What are the HTTP status return codes for a successful GET, POST, PUT or DELETE operation?

### HTTP response codes

1. 1XX: information. Request hs been received and processing of it continues.
2. 2XX: Successful. Successfully received, understood and accepted.
3. 3XX: Redirection. Further action is needed to complete the request.
4. 4XX: Client error. Request is invalid.
5. 5XX: Server error. Server is unavailable for a valid request.

### HTTP method

1. GET: 200 OK
2. POST: 200 OK, 201 Created, 204 No Content
3. PUT: 200 OK, 201 Created, 204 No Content
4. DELETE: 204 No Content, 202 Accepted, 205 Reset Content (not performed)


## When do you need @ResponseStatus?

It’s always a good idea to use` @ResponseStatus` where appropriate to communicate the most **descriptive and accurate HTTP status code** to the client.

1. Annotate **exception classes** in order to specify the HTTP response status and reason.
    ```java
    @ResponseStatus(HttpStatus.NOT_FOUND) 
    public class ResourceNotFoundException extends RuntimeException {
      public ResourceNotFoundException() { 
        this("Resource not found!"); 
    }
    ```

2. On controller **handler methods** 
    - will stop the DispatcherServlet from trying to find a view to render.
    - will override the original response status.
    - void method will just return a response with an empty body, E.g., DELETE method
    ```java
    @ResponseStatus(HttpStatus.CREATED) 
    @PostMapping("/") 
    public Post createPost(@RequestBody Post post) { 
      return postRepository.save(post); 
    }
    ```


## Where do you need @ResponseBody? What about @RequestBody? Try not to get these muddled up!

### `@RequestBody`

1. `@RequestBody` to have the web request body read and deserialized into an Object through an `HttpMessageConverter` to method parameter.
2. `@RequestBody` can be combined with `@Validated`. 

### `@ResponseBody`
1. To have the return serialized to the response body through an `HttpMessageConverter`.
2. `@ResponseStatus` can be combined to specify response status.


## If you saw example Controller code, would you understand what it is doing? Could you tell if it was

An example

```java
@RestController 
@RequestMapping(value = "/singer") 
public class SingerController { 

  final Logger logger = LoggerFactory.getLogger(SingerController.class);
  
  @Autowired 
  private SingerService singerService;

  @ResponseStatus(HttpStatus.OK) 
  @GetMapping(value = "/listdata") 
  public List<Singer> listData() { 
    return singerService.findAll(); 
  }
  
  @ResponseStatus(HttpStatus.OK) 
  @GetMapping(value = "/{id}") 
  public Singer findSingerById(@PathVariable Long id) { 
    return singerService.findById(id); 
  }
  
  @ResponseStatus(HttpStatus.CREATED) 
  @PostMapping(value="/") 
  public Singer create(@RequestBody Singer singer) {
  
    logger.info("Creating singer: " + singer);
    singerService.save(singer);
    logger.info("Singer created successfully with info: " + singer);
    return singer; 
  }
  
  @PostMapping 
  public Book create(@RequestBody Book book, UriComponentsBuilder uriBuilder) {
  
    Book created = bookService.create(book);
    URI newBookUri = uriBuilder
      .path("/books/{isbn}")
      .build(created.getIsbn());
    
    return ResponseEntity
      .created(newBookUri)
      .body(created); 
  }
}
```


## Do you need Spring MVC in your classpath?

- The `spring-mvc.jar` **is not part of** `spring-core`.
- `spring-web` module **must** be present on the classpath.


## What Spring Boot starter would you use for a Spring REST application?

**spring-boot-starter-web**: “Starter for building web, including RESTful, applications using Spring MVC.”


## What are the advantages of the RestTemplate?

`RestTemplate` implements a synchronous HTTP client that simplifies sending requests and also enforces RESTful principles.

- Provides a higher-level API to perform HTTP requests compared to traditional HTTP client libraries.
- Supports URI templates
- Automatically encodes URI templates. For example, a space character in an URI will be replaced with `%20` using percent-encoding.
- Supports automatic detection of content type
- Supports automatic conversion between objects and HTTP messages.
- Allows for easy customization of response errors. A custom ResponseErrorHandler can be registered on the RestTemplate.
- Provides methods for conveniently sending common HTTP request types and also provides methods that allow for increased detail when sending requests. Examples of the former method type are: delete, getForObject, getForEntity, headForHeaders, postForObject and put.


## If you saw an example using RestTemplate would you understand what it is doing?

```java
String uriTemplate = "http://example.com/hotels/{hotel}";
URI uri = UriComponentsBuilder.fromUriString(uriTemplate).build(42);

RequestEntity<Void> requestEntity = RequestEntity.get(uri)
        .header(("MyRequestHeader", "MyValue")
        .build();

ResponseEntity<String> response = template.exchange(requestEntity, String.class);

String responseHeader = response.getHeaders().getFirst("MyResponseHeader");
String body = response.getBody();
```

## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)
4. [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition/)
5. [Beginning Spring](https://www.amazon.com/Beginning-Spring-Mert-Caliskan-ebook/dp/B00T1JV8TI) 