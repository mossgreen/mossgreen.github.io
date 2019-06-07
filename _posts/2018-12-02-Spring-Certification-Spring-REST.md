---
title: Spring REST in Spring Certification
search: true
tags: 
  - Restful
  - Spring
  - Spring REST
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring REST in Spring professional certification.


## What does REST stand for?
REST stands for **RE**presentational **S**tate **T**ransfer.
REST is an **architecture style** for designing networked (distributed) applications.
RESTful applications use HTTP requests for all four CRUD (Create/Read/Update/Delete) operations.

- Representational: XML, JSON, File, HTML, or say anything
- State: 
- Transfer: REST involves transferring resource data, in some representational form, from one application to another


## What is a resource?

- Information, like data, Json, xml, html, file, image, etc.
- Resource can be identified by a Uniform Resource Identifier (URI).


## What does CRUD mean?

RESTful applications use HTTP requests to operate data in four CRUD (Create/Read/Update/Delete) operations.

- Create: POST
- Read: GET
- Update: PUT
- Delete: DELETE


## Is REST secure? What can you do to secure it?
REST by default is not secure.

To secure it, can use:  

- HTTPS
- Basic Authentication
- JSON Web Tokens (JWT)
- OAuth2


## What are safe REST operations?  

Safe methods are HTTP methods that do not modify resources. These are:
- GET
- HEAD
- OPTIONS
- TRACE

Not Safe:
- Two identical POST requests will result in two identical resources being created or errors at application level.
- PUT modifies the state on the server
- DELETE


## What are idempotent operations? Why is idempotency important?
**Idempotent** meansyou can **repeat** these operations over and over again, but the end result should be the **same**.

Idempotency operations:
- GET
- PUT
- DELETE

## Is REST scalable and/or interoperable?

### Scalability
REST is scalable, because it is stateless, its Cacheability and layered system. 

1. **Statelessness** ensures that requests can be processed by any node in a cluster of services without having to consider server-side state

2. **Cacheability** allows for creating responses from cached information without the request having to proceed to the actual service, which improves network efficiency and reduces the load on the service.

3. A **layered system** allows for introducing intermediaries such as a load balancer without clients having to modify their behavior as far as sending requests to the service is concerned. The load balancer can then distribute the requests between multiple instances of the service in order to increase the request-processing capacity of the service.

### Interoperability   
The ability to exchange and make use of information.

1. REST service supports all formats of data: xml, json, file html
2. Resource can be identified by a Uniform Resource Identifier (URI). No special language needed
3. CRUD standard operation


## Which HTTP methods does REST use?

![IMAGE](https://i.loli.net/2019/05/23/5ce653431c05e73185.jpg)


## What is an HttpMessageConverter?
The `@ResponseBody` is also used to facilitate understanding of the REST message format between client and server.

The `HttpMessageConverter` interface specifies the properties of a converter that can perform the following conversions:
- Convert a `HttpInputMessage` to an object of specified type.
- Convert an object to a `HttpOutputMessage`.

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

Yes, it is. Each request is independent, which improves scalability.


## What does @RequestMapping do?

1. Annotate both **class** and handler **methods**.
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

- Stereotype annotations are annotations that are applied to classes that fulfills a certain, distinct, role.
- The main stereotype annotation is `@Component`.
- Both `@Controller` and `@RestController` are stereotypes
-  `@Controller` + `@ResponseBody` = `@RestController`


## What is the difference between @Controller and @RestController?

`@RestController`:
1. It's stereotype
2. All handler methods in the controller should have their return value written directly to the body of the response, rather than being carried in the model to a view for rendering.
3. Yet another option would be to return a ResponseEntity object.


## When do you need @ResponseBody?

- `@ResponseBody` on method: return serialized data througth **HttpMessageConverter** to response body, rather than passing the model and view. 
- `@ResponseBody` on class: the controller becomes restcontroller.

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

1. Annotate **exception classes** in order to specify the HTTP response status and reason.
2. On controller **handler methods** 
    - will stop the DispatcherServlet from trying to find a view to render.
    - will override the original response status.
    - void method will just return a response with an empty body, E.g., DELETE method

**On Exception class**
```java
@ResponseStatus(HttpStatus.NOT_FOUND) 
public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException() { this("Resource not found!"); 
}
```

**On Method**
```java
@ResponseStatus(HttpStatus.CREATED) 
@PostMapping("/") 
public Post createPost(@RequestBody Post post) { 
  return postRepository.save(post); 
}
```


## Where do you need @ResponseBody? What about @RequestBody? Try not to get these muddled up!

### `@RequestBody`

1. `@RequestBody` to have the request body read and deserialized into an Object through an HttpMessageConverter.
2. `@RequestBody` can be combined with `@Validated`

### `@ResponseBody`
1. To have the return serialized to the response body through an HttpMessageConverter.
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

`spring-web` module **must** be present on the classpath.

## What Spring Boot starter would you use for a Spring REST application?

**spring-boot-starter-web**: “Starter for building web, including RESTful, applications using Spring MVC.”


## What are the advantages of the RestTemplate?

`RestTemplate` implements a synchronous HTTP client that simplifies sending requests and also enforces RESTful principles.

- Provides a higher-level API to perform HTTP requests compared to traditional HTTP client libraries.
- Supports URI templates
- Automatically encodes URI templates. For example, a space character in an URI will be replaced with %20 using percent-encoding.
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

