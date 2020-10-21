---
title: Servlet Container and Spring Framework
search: true
tags:
  - Spring
  - Spring Boot
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Servlet Container vs. Spring Containers (not finished yet)

## Concepts

- Web Server:
  - It supports HTTP protocol.
  - It only supports static resource, like image and HTML files. However, it cannot handle dynamic containers.
  - **Apache Web Server** is the most popular web server, followed by MS's IIS, Nginx is also a good one
    ![image](https://user-images.githubusercontent.com/8748075/86555858-be36e880-bfa5-11ea-8b46-558c16346a87.png)

- Web Container
  - Web Container = Servlet container, supports JSP/Servlet API
  - A web container is responsible for managing the lifecycle of servlets, mapping a URL to a particular servlet and ensuring that the URL requester has the correct access rights.
  - The Web container creates servlet instances, loads and unloads servlets, creates and manages request and response objects, and performs other servlet-management tasks.
  - E.g., Apache Tomcat, Jetty, WildFly
  - It works in Web Server, e.g., Tomcat lives in Apache
  - It generates some static content and returns responses
    ![image](https://user-images.githubusercontent.com/8748075/86555875-c7c05080-bfa5-11ea-9d81-dd570de4fe76.png)

- Servlet Container
  - Web Container = Servlet container

- Tomcat
  - Tomcat is both a web server and a web container, but it's not really meant to function as a high-performance web server, nor does it include some features typical of a web server.
  - Tomcat is the Servlet runtime environment, that is, a Servlet container.
    ![image](https://user-images.githubusercontent.com/8748075/86556084-6187fd80-bfa6-11ea-8e7b-34a6eb1b9b65.png)

- Servlet
- Servlet Filter, filter
- Servlet Listener, listener
- Spring Container, IOC Container
    ![image](https://user-images.githubusercontent.com/8748075/86555900-d9095d00-bfa5-11ea-87f9-fac27fc6de3f.png)

- Spring Security filters, DelegatingFilterProxy, security filter chain
- Spring MVC DispacherServlet
  - The DispatcherServlet is an actual Servlet (it inherits from the HttpServlet base class)
- Interceptor
- AOP

### Apache vs. Tomcat

**A metaphor:**

Apache is a car that can load static objects (HTML static web pages, etc.); but can not be loaded with dynamic water (JSP, CGI, etc.), you need a bucket (container, Tomcat) to load water.

- Apache focuses on HTTP Server; Tomcat focuses on the Servlet engine.
- Apache only supports static ordinary web pages such as HTML. It can connect Tomcat in one direction; Tomcat is a Servlet container that can support JSP, PHP and CGI, etc.
- Apache can access Tomcat resources, and vice versa.

### ServletContext vs. ApplicationContext

**ServletContext:**

When the servlet container (like Apache Tomcat) starts up, it will deploy and load all its web applications.

When a web application is loaded, the servlet container creates the ServletContext once and keeps it in the server's memory.

Then, the cotnianer initializes and loads all filters, servlets and listeners by calling their `init()` method.

When the servlet container is finished with all of the above described initialization steps, then the `ServletContextListener#contextInitialized()` will be invoked.

**ApplicationContext:**

`ApplicationContext` represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the aforementioned beans.

Spring Boot follows a different initialization sequence. Rather than hooking into the lifecycle of the Servlet container, Spring Boot uses Spring configuration to bootstrap itself and the embedded Servlet container. Filter and Servlet declarations are detected in Spring configuration and registered with the Servlet container. For more details, see the Spring Boot documentation.

`public abstract class SpringBootServletInitializer implements WebApplicationInitializer`

```java
@Override
public void onStartup(ServletContext servletContext) throws ServletException {
 // Logger initialization is deferred in case an ordered
 // LogServletContextInitializer is being used
 this.logger = LogFactory.getLog(getClass());
 WebApplicationContext rootApplicationContext = createRootApplicationContext(servletContext);
 if (rootApplicationContext != null) {
  servletContext.addListener(new SpringBootContextLoaderListener(rootApplicationContext, servletContext));
 }
 else {
  this.logger.debug("No ContextLoaderListener registered, as createRootApplicationContext() did not "
    + "return an application context");
 }
}
```

## Java Web and Spring overview

- Apache Web Server serves static content efficiently.
- Tomcat serves dynamic content, it also can handle static content, but less efficient.
- Three components of a Servlet Container: Filter, Servlet and Listener.
  - When a request comes in the Tomcat, which is the Servlet Container, Servlet Filter is the first stop.
  - Servlet handles the request and generates the response.
- In Spring Web Applications, there are two types of container, each of which is configured and initialized differently: IOC container and MVC Container
- IOC container: responsible for instantiating, configuring, and assembling the aforementioned beans. There will be one `ApplicationContext` per application
- MVC Container: each `DispatcherServlet` has its own `WebApplicationContext`, which inherits all the beans already defined in the root WebApplicationContext. These inherited beans can be overridden in the servlet-specific scope, and you can define new scope-specific beans local to a given Servlet instance.
- DispatcherServlets handles all requests and dispatches them to the appropriate channels.

## Servlet Container, Tomcat

### Servlet Container Life Cycle

A servlet listener can be registered with an application to indicate when it has been started up or shut down. Therefore, by listening for such events, the servlet has the opportunity to perform some actions when they occur.

To create a listener that performs actions based on a container event, you must develop a class that implements the ServletContextListener interface. The methods that need to be implemented are `contextInitialized` and `contextDestroyed`. Both of the methods accept a ServletContextEvent as an argument, and they are automatically called each time the servlet container is initialized or shut down, respectively. To register the listener with the container, you can use one of the following techniques:

- Utilize the `@WebListener` annotation, as demonstrated by the solution to this recipe.
- Register the listener within the `web.xml` application deployment descriptor.
- Use the `addListener` methods defined on `ServletContext`.

```java
@WebListener
public class StartupShutdownListener implements ServletContextListener {

public void contextInitialized(ServletContextEvent event) {
    System.out.println("Servlet startup...");
    System.out.println(event.getServletContext().getServerInfo());
    System.out.println(System.currentTimeMillis());
    sendEmail("Servlet context has initialized");
}

public void contextDestroyed(ServletContextEvent event) {
    System.out.println("Servlet shutdown...");
    System.out.println(event.getServletContext().getServerInfo());
    System.out.println(System.currentTimeMillis());
    sendEmail("Servlet context has been destroyed...");
}

// notify
private void sendEmail() { }
```

### ServletContext

Defines a set of methods that a servlet uses to communicate with its servlet container, for example, to get the MIME type of a file, dispatch requests, or write to a log file.

There is one context per "web application" per Java Virtual Machine. A "web application" is a collection of servlets and content installed under a specific subset of the server's URL namespace.

### How Tomcat hanldes requests

7 Servlets in Tomcat // todo

## Servlets

- Servlets are Java classes that respond to incoming requests, mostly HTTP Web requests.
- A servlet must be deployed to a Java servlet container in order to become usable.
- A servlet generally performs some processing in the implementation of its methods and then returns a response to the client.

### Servlet Life Cycle

1. When a request is received by the container for a Servlet. The Servlet class is loaded via the Class Loader.
    - the Java Servlet container calls the servlet’s constructor.
    - The constructor of every servlet must accept no arguments.
2. The container instantiates the servlet class and it's ready to use.
3. The init method which is found in the javax.servlet.Servletinterface is invoked by the web container.
4. The `service()` method is invoked once the above three steps have been completed. Thereafter every time this instance of the Servlet is required to fulfil a request the service method is invoked. Implementing the `service()` method is optional.
5. Finally the container calls the destroy method in order to remove this instantiated class. At this point the servlet cleans up any memory or threads etc. that are no longer required.

Servlet Interface

```java
public interface Servlet {
    public void init(ServletConfig config) throws ServletException;

    public void service(ServletRequest req, ServletResponse res)throws ServletException, IOException;

    public void destroy();

    public String getServletInfo();

    public ServletConfig getServletConfig();
}
```

- If you rewrite the `init()` remember to call `super.init(config);`

### Config your Servlet

1. XML Config

    ```xml
    <servlet>
        <servlet-name>MyServletName</servlet-name>
        <servlet-class>MyServletNameClassname</servlet-class>
    </servlet>
    <servlet-mapping>
        <servelt-name>MyServletName</servelt-name>
        <url-pattern>/demo</url-pattern>
    </servlet-mapping>
    ```

2. Annotations

    ```java
    @WebServlet("/demo")
    public class DemoAction  extends HttpServlet{ }
    ```

### HttpServlet

![image](https://user-images.githubusercontent.com/8748075/86558342-33f28280-bfad-11ea-9e51-ed34c0743d47.png)

`HttpServlet` is an abstract class, a subclass of `GenericServlet`.

It overwrites the `Service()` and added its own `Service()` method.

```java
@Override
public void service(ServletRequest req, ServletResponse res)
    throws ServletException, IOException {

    HttpServletRequest  request;
    HttpServletResponse response;

    try {
        request = (HttpServletRequest) req;
        response = (HttpServletResponse) res;
    } catch (ClassCastException e) {
        throw new ServletException(lStrings.getString("http.non_http"));
    }
    service(request, response);
}

// Receives standard HTTP requests from the public, HTTP-specific
protected void service(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
        //
}
```

### ServletConfig

A servlet configuration object used by a servlet container to pass information to a servlet during initialization.

- Tomcat creates `ServletConfig` along with Servlet.
- It's loaded in the `init()` method of Servlet.

    ```java
    public interface Servlet {
        public void init(ServletConfig config) throws ServletException;
    }
    ```

- In Servlet, you can use this config in its methods, e.g., doGet();

    ```java
    ServletConfig config = getServletConfig();
    log.info(confg.getInitParameter("url"));
    ```

ServletConfig.java

```java
public interface ServletConfig {
    public String getServletName();
    public ServletContext getServletContext();
    public String getInitParameter(String name);
    public Enumeration<String> getInitParameterNames();
}
```

### Write your own servlet

```java
// todo
```

## Servlet Filter

 A filter is an object that performs filtering tasks on either the request to a resource (a servlet or static content), or on the response from a resource, or both.

- a filter is more of a request pre-processor and a response post-processor.
- Filters are usually used where multiple servlets and any other Java EE web components require some common functionality, such as authentication, logging, and encryption.
  - Authentication Filters
  - Logging and Auditing Filters
  - Image conversion Filters
  - Data compression Filters
  - Encryption Filters
  - Tokenizing Filters
  - Filters that trigger resource access events
  - XSL/T filters
  - Mime-type chain Filter

Web filters are useful for preprocessing requests and invoking certain functionality when a given URL is visited.

Rather than invoking a servlet that exists at a given URL directly, any filter that contains the same URL pattern will be invoked prior to the servlet.

Filters must implement the `javax.servlet.Filter` interface. Methods contained within this interface include init, destroy, and doFilter. The `init` and `destroy` methods are invoked by the container. The `doFilter` method is used to implement tasks for the filter class.

```java
@WebFilter("/*")
public class LoggingFilter implements Filter {

    private FilterConfig filterConf = null;

    public void init(FilterConfig filterConfig) { this.filterConf = filterConf; }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)throws IOException, ServletException {
        String userAddy = request.getRemoteHost();
        filterConf. getServletContext().log("Visitor User IP: " + userAddy);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() { throw new UnsupportedOperationException("Not supported yet.");}
}
```

### Filter Life Cycle

1. Filter is created by Servlet Container
    - Call constructer
    - Call `init()` method
2. `doFilter()` for each request/response
3. Servlet Container call `destroy()` while the container shut down

### FilterConfig

A filter configuration object used by a servlet container to pass information to a filter during initialization.

It's used in Filter's initialisation phase:

```java
public void init(FilterConfig filterConfig) {}
```

```java
public interface FilterConfig {
    // get the name of the filter.
    public String getFilterName();
    public ServletContext getServletContext();

    // the value of the named initialization parameter
    public String getInitParameter(String name);

    // get the names of the filter's initialization parameters
    public Enumeration<String> getInitParameterNames();
}
```

### Filter Chain

Filters use the FilterChain to **invoke the next filter** in the chain. If the calling filter is the last filter in the chain, to invoke the resource at the end of the chain.

- For multiple filters, the execute order is based on their configuration in `web.xml`
- All filters and the target resource will be in one thread
- All filters shares the same request object
- Think about Spring Security!

There is only one method in the `FilterChain` interface.

```java
public interface FilterChain {
    public void doFilter(ServletRequest request, ServletResponse response)
            throws IOException, ServletException;
}
```

### Filter matching pattern

A URL pattern may contain a subset of US-ASCII characters. Other values must be escaped.

Filter only cares about the URL, doesn't care about the existence of the resource.

web.xml

```xml
<filter-mapping>
  <filter-name>demo</filter-name>
  <url-pattern>/demo/*</url-pattern>
</filter-mapping>
```

- Exact matching
- Path matching `/admin/*`
- Type matching `.css`

### Filter works with ThreadLocal to manage transaction

```code
//todo
```

## Servlet Listener

The ability to perform an action within a servlet when a servlet attribute is added, removed, or updated.

Listeners are generally used in cases where you want to

1. execute some actions or load some data/configuration on application startup,
2. or to open and close database connections on the occurrence of an event
3. and to perform any actions on the application being shut down.

When you add a listener to your application, you need to

1. write a class that implements the appropriate listener interface and
2. declare the listener in the web deployment listener.

A few different options can be used to register the listener with the container.

- The `@WebListener` annotation is the easiest way to do so, and the only downfall to using it is that you will need to recompile code in order to remove the listener annotation if you ever need to do so.
- The listener can be registered within the web deployment descriptor, or it can be registered using one of the `addListener` methods contained in `ServletContext`.

Use the `@WebListener` annotation to define a listener to get events for various operations on the particular web application context. Classes annotated with `@WebListener` must implement one of the following interfaces:

```java
javax.servlet.ServletContextListener
javax.servlet.ServletContextAttributeListener
javax.servlet.ServletRequestListener
javax.servlet.ServletRequestAttributeListener
javax.servlet.http.HttpSessionListener
javax.servlet.http.HttpSessionAttributeListener
```

AttributeListener.java Example

```java
@WebListener
public final class AttributeListener implements ServletContextListener, HttpSessionAttributeListener {

private ServletContext context = null;

public void attributeAdded(HttpSessionBindingEvent se) {

    HttpSession session = se.getSession();
    String id = session.getId();
    String name = se.getName();
    String value = (String) se.getValue();
    String message = new StringBuffer("New attribute has been added to session: \n"). append("Attribute Name: ").append(name).append("\n").append("Attribute Value:"). append(value).toString();
    log(message);
}

public void attributeRemoved(HttpSessionBindingEvent se) {
    HttpSession session = se.getSession();
    String id = session.getId();
    String name = se.getName();
    if (name == null) { name = "Unknown"; }
    String value = (String) se.getValue();
    String message = new StringBuffer("Attribute has been removed: \n") .append("Attribute Name: ").append(name).append("\n").append("Attribute Value:") .append(value).toString();
    log(message);
}

@Override
public void attributeReplaced(HttpSessionBindingEvent se) {

    String name = se.getName();
    if (name == null) { name = "Unknown"; }
    String value = (String) se.getValue();
    String message = new StringBuffer("Attribute has been replaced: \n ").append(name). toString();
    log(message);
}

@Override
public void contextInitialized(ServletContextEvent event) {

    this.context = event.getServletContext();
    log("contextInitialized()");
}

@Override public void contextDestroyed(ServletContextEvent event) { /*Do something*/ } }
```

## Spring MVC

Spring MVC is the most popular Java web framework based on the Model-View-Controller (MVC) design pattern.

Spring Boot supports Tomcat, Jetty, and Undertow servlet containers out-of-the-box and provides customization hooks to implement all server level customizations.

We can say that the core element of Spring MVC is the Dispatcher Servlet, which is the main servlet that handles all requests and dispatches them to the appropriate channels. With the Dispatcher Servlet, Spring MVC follows the Front Controller pattern that provides an entry point for handling all requests of web applications.

A standard servlet listener is used to bootstrap and shutdown the Spring application context. The application context is created and injected into the DispatcherServlet before any request is made, and when the application is stopped, the Spring context is closed gracefully.

### Spring MVC Interceptor

A HandlerInterceptor gets called before the appropriate HandlerAdapter triggers the execution of the handler itself. This mechanism can be used for a large field of preprocessing aspects, e.g. for authorization checks, or common handler behavior like locale or theme changes. Its main purpose is to allow for factoring out repetitive handler code.

```java
public interface HandlerInterceptor {
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    r   eturn true;
    }

    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception { }

    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception { }
}
```

In Java configuration, you can register interceptors to apply to incoming requests.

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LocaleChangeInterceptor());
        registry.addInterceptor(new ThemeChangeInterceptor()).addPathPatterns("/**").excludePathPatterns("/admin/**");
        registry.addInterceptor(new SecurityInterceptor()).addPathPatterns("/secure/*");
    }
}
```

## Spring Security Filters

## Spring AOP Interceptor

the method executing order:

1. Servlet filter (out side of Spring)
2. MVC interceptor (spring components)
3. AOP interceptor (Component methods)

## Spring boot embedded tomcat

## References

- [How Java Servlet Works](https://examples.javacodegeeks.com/how-java-servlet-works/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+JavaCodeGeeks+%28Java+Code+Geeks%29)
- [Java Servlet Technology](https://javaee.github.io/tutorial/servlets.html#BNAFD)
