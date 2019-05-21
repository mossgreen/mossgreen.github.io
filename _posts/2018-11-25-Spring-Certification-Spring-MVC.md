---
title: Spring MVC in Spring Certification
search: true
tags: 
  - Java
  - Spring
  - Spring MVC
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Spring MVC in Spring professional certification.

## MVC is an abbreviation for a design pattern. What does it stand for and what is the idea behind it?

**Model–View–Controller** software architectural pattern is designed to decouple three components, each of them can be easily swapped with a different implementation, and together they provide a fully functional user interface. 

- **Model**: holds the current data and business logic.
- **View**: presenting data. User interacts with view.
- **Controller**: accept requests from view, issues commands to model; manipulate data from model, interacts with view.

**Advantages**: 
- separation of concerns
- decoupling among MVC
- reuse of model and controllers with different views


![IMAGE](https://i.loli.net/2019/05/21/5ce3b21f89bd264516.jpg)


## Do you need `spring-mvc.jar` in your classpath or is it part of spring-core?

- Yes, you do need this jar.
- It's not part of Spring Core.
- It inclues Spring Core.


## What is the DispatcherServlet and what is it used for?

Following **front controller pattern**, **DispatcherServlet** is the central `Servlet`, the **entry point** of the application, the heart of Spring Web MVC that coordinates all request handling operations.

A Spring web application may define **multiple** dispatcher servlets, each of which has its own namespace, its own Spring application context and its own set of mappings and handlers.

**Used for**
- Recerives requests and delegates them to registered handlers
- Resolve views by mapping view-names to view instances
- Resolves exceptions

## Is the DispatcherServlet instantiated via an application context?

- The DispatcherServlet is **not** instantiated via an application context. 
- It is instantiated **before any** application context is created.

In a Servlet 3.0 environment, the container looks for any classes in the classpath that implement the `javax.servlet.ServletContainerInitializer` interface; if any are found, they’re used to configure the servlet container.

`DispatcherServlet` can be instantiated in 2 different ways and in both it is initialized by the servlet container:
- XML
- Java bean

The `DispatcherServlet` creates a separate “servlet” application context containing all specific web beans (controller, views, view resolvers). This context is also called the web context or the `DispatcherServletContext`.

## What is a web application context? What extra scopes does it offer?

Web application context is a Spring application context for a web applications. 

It has all the properties of a regular Spring application context, given that the `WebApplicationContext` interface extends the `ApplicationContext` interface, and **add** a method for retrieving the standard Servlet API `ServletContext` for the web application.

In addition to the standard Spring bean scopes singleton and prototype, there are three additional scopes available in a web application context:
- **request**: each http request
- **session**: each http session
- **application**: per `ServletContext`


## What is the @Controller annotation used for?

- JSR-303 **validation support** is enabled
- **handlers** method are enabled, annotated with the `@RequestMapping` annotation.


## How is an incoming request mapped to a controller and mapped to a method?
When a request is issued to the application:
- DispatcherServlet of the application **receives** the request.
- DispatcherServlet **maps** the request to a method in a controller.
- DispatcherServlet **holds** a list of classes implementing the `HandlerMapping` interface.
- DispatcherServlet **dispatches** the request to the controller.
- The method in the controller is **executed**.


## What is the difference between @RequestMapping and @GetMapping?
`@GetMapping` equals to ` @RequestMapping(method = RequestMethod.GET)`


## What is @RequestParam used for?
Request parameters of arbitrary type, annotated with `@RequestParam`.


## What are the differences between @RequestParam and @PathVariable?
- `@PathVariable` instructs Spring MVC to **bind the path variable within the URL**
- for example, http:// localhost:8080/singer/1  into the id argument of the findSingerById() method. 
- Note that for the id argument, the type is Long, while Spring’s type conversion system will automatically handle the conversion from String to Long for us.

```java
@RequestMapping(value = "/{userId}", method = RequestMethod.GET) 
public String show(@PathVariable("userId") Long id, Model model) {
  // ...
}
```

Differences:
- `http://localhost:8080/greeting?firstName=dammy&lastName=good`
- `http://localhost:8080/firstname/dammy/lastname/good`

## What are some of the parameter types for a controller method?
- WebRequest
- ServletRequest
- ServletResponse
- HttpSession
- Principle
- HttpMethod
- Locale
- TimeZone
- java.io
- HttpEntity
- Collections, like Map<>
- Errors
- BindingResult
- SessionStatus
- UriComponentsbuilder

### What other annotations might you use on a controller method parameter?   
(You can ignore form-handling annotations for this exam)
- @PathVariable
- @MatrixVariable: key-value pair in url
- @RequestParam
- @CookieValue
- @RequestBody
- @RequestPart: "multipart/form-data"
- @ModelAttribute
- @SessionAttribute
- @SessionAttributes
- @RequestAttribute


## What are some of the valid return types of a controller method?
- HttpEntity
- ResponseEntity
- HttpHeaders
- String
- View
- Map<>
- ModelAndView
- void
- CompletableFuture<V> | CompletionStage<V>: Asynchronous

## What is a View and what's the idea behind supporting different types of View?
**View** is responsible for presenting the data of the application to the user. 

The user interacts with the view.

The core view resolver provided by Spring is the `InternalResourceViewResolver`; it is the **default view resolver**. 

Inside `spring-webmvc.jar ` there is a file called `DispatcherServlet.properties`, and in it all default infrastructure beans are declared.

Spring MVC provides several view resolvers to support multiple view technologies, such as JSP, Velocity, FreeMarker, JSF, Tiles, Thymeleaf, and so on.

supporting different types of views:
- Present model in **different formats**
- Adapt view to **different platforms**
- Use **different view-technology**


## How is the right View chosen when it comes to the rendering phase?

View Resolution Sequence
1. Controller returns logical view name to DispatcherServlet
2. ViewResolvers are asked in sequence (based on their Order)
3. If ViewResolver matches the logical view name then returns which View should be used to render the output. If not, it returns null and the chain continues to the next ViewResolver
4. Dispatcher Servlet passes the model to the Resolved View and it renders the output
5. If the view-name cannot be resolved, then an exception.

## What is the Model?
- An instance of an object that implements the Model interface from the Spring framework
- It is a collection of key-value pairs. 
- The contents of the model represents the state of the application and contains information that will be used when rendering the view. 
- The value-objects contained in the model may also contain business logic implemented in the classes instantiated to create those objects.

## Why do you have access to the model in your View? Where does it come from?

- It contains information that will be used when rendering the view. 
- The model is passed as a parameter to the view when the dispatcher servlet asks the selected view to render itself as part of processing a request.

## What is the purpose of the session scope?

A session-scoped Spring bean exists for the lifetime of a HTTP session. 

This enables creating, for instance, a session-scoped Spring bean that contains a shopping cart. 

The bean instance will remain the same during all requests the user makes within one and the same HTTP session.


## What is the default scope in the web context?
**Singleton Scope** is default scope.


## Why are controllers testable artifacts?

The goal of Spring MVC Test is to provide an effective way to test controllers by performing requests and generating responses **through the actual DispatcherServlet**.

The Spring MVC Test Framework also provide full Spring MVC runtime behavior for tests **without running in a servlet container**.

```java
@RunWith(SpringRunner.class) 
@WebMvcTest(HomeController.class) 
public class HomeControllerTest {

  @Autowired 
  private MockMvc mockMvc;// Injects MockMvc
  
  @Test public void testHomePage() throws Exception { 
  
    mockMvc.perform(get("/"))
      .andExpect(status().isOk())
      .andExpect(view().name("home"))
      .andExpect(content().string( containsString("Welcome to...")));
  }
}
```

## What does a ViewResolver do?

- A `ViewResolver`, that is a class implementing the ViewResolver interface, attempts to, given a view name and a locale, find a View.
- A `ViewResolver` attempts to map a view name to a View.
- The core view resolver provided by Spring is the `InternalResourceViewResolver`; it is the default view resolver. 

```java
@Bean InternalResourceViewResolver viewResolver(){ 
  InternalResourceViewResolver resolver = new InternalResourceViewResolver(); 
  resolver.setPrefix("/WEB-INF/views"); 
  resolver.setSuffix(".jspx" ); 
  resolver.setRequestContextAttribute("requestContext"); 
  return resolver; 
}
```


## References

1. [Core Spring 5 Certification in Detail by Ivan Krizsan](https://leanpub.com/corespring5certificationindetail/)
2. [Pivotal Certified Professional Spring Developer Exam Study Guide](https://www.amazon.com/Pivotal-Certified-Professional-Spring-Developer-ebook/dp/B01MS0JSML/)
3. [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.com/Pro-Spring-Depth-Guide-Framework/dp/1484228073/)

