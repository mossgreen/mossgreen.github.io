---
title: Spring Security in Spring Certification
search: true
tags: 
  - Java
  - Spring
  - Spring Security
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Spring Security in Spring Professional Certification.

### What are authentication and authorization? Which must come first?  
 - Authentication is the process of verifying the validity of the principal’s credentials. **Who are you?**
 - Authorization is the process of making a decision whether an authenticated user is allowed to perform a certain action within the application. **What are you allowed to do?**
 - Authentication is the first step of authorization so always comes first.	

### Is security a cross cutting concern? How is it implemented internally?  
- The cross-cutting concern is a concern which is applicable throughout the application and it affects the entire application. For example: logging, security and transactions.
- Yes, security is a cross-cutting concern.

Spring Security tackles security from two angles. 

1. To **secure web requests** and restrict access at the URL level, Spring Security uses servlet filters. 
2. Spring Security can also **secure method invocations** using Spring AOP, proxying objects and applying advice to ensure that the user has the proper authority to invoke secured methods.

![IMAGE](https://i.loli.net/2019/06/08/5cfb89f9a75c570368.jpg)
### What is the delegating filter proxy?

- Spring Security is a single physical Filter but delegates processing to a chain of internal filters.
- `DelegatingFilterProxy` is a servlet filter registered with the web container that delegates the requests to a Filter implementation on the Spring context side.
- `DelegatingFilterProxy` does not have to be a Spring @Bean.
- The `DelegatingFilterProxy` will look up a bean of the type Filter for the specified targetBeanName.

`AbstractSecurityWebApplicationInitializer` implements `WebApplicationInitializer`, so it will be discovered by Spring and be used to register `DelegatingFilterProxy` with the web container.

```java
@Configuration 
@EnableWebSecurity 
public class SecurityConfig extends WebSecurityConfigurerAdapter { }
```

![IMAGE](https://i.loli.net/2019/06/08/5cfb80575a44e95751.jpg)


### What is the security filter chain?

- The `DelegatingFilterProxy` delegates to a `FilterChainProxy` usually with a fixed name  `springSecurityFilterChain.
- The `FilterChainProxy` contains all the security logic arranged internally as a chain (or chains) of filters. 
- `FilterChainProxy` is always a @Bean.
-  A chain of filters that is customizable by pulling in and taking out some filters as well as customizing them.

This chain of filters has the following key responsibilities:

- driving authentication
- enforcing authorization
- managing logout
- maintaining SecurityContext in HttpSession

```java
// Empty class needed to register the springSecurityFilterChain bean 
public class SecurityInitializer extends AbstractSecurityWebApplicationInitializer { }
```

### What is a security context?

- `SecurityContext` holds security information about the current thread of execution. 
- This information includes details about the principal. 
- Context is held in the `SecurityContextHolder`.

```java
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
assert(authentication.isAuthenticated);
```

### Why do you need the intercept-url?
- It is used to define a URL for the requests we want to have some security constraints.

```xml
<intercept-url pattern="/something" access="hasRole('ROLE_USER')"/>
```

### In which order do you have to write multiple intercept-url's?

- Patterns are always evaluated in the order they are defined. 
- Most specific patterns must come first and most general last.

### What does the ** pattern in an antMatcher or mvcMatcher do?

- `/admin/**` matches any path starting with `/admin`.

### Why is an mvcMatcher more secure than an antMatcher?

- `AntMatcher()` is an implementation for Apache Ant-style path patterns. 
- `MvcMatcher()` uses Spring MVC's `HandlerMappingIntrospector` to match the path and extract variables.
- They both implement **RequestMatcher** interface
- `MvcMatcher` can also restrict the URLs by HTTP method

### Does Spring Security support password hashing? What is salting?

- Spring Security uses **PasswordEncoder** for encoding passwords. This interface has a Md5PasswordEncoder that allows for obtaining hashes of the password - that will be persisted.
- **Salting** is appending a  random string to the hash to prevent hackers from matching with a hash from the standard dictionary of hashes.

### Why do you need method security? What type of object is typically secured at the method level

- If we secure only the web layer there may be a way to access service layer in case we expose some REST endpoints. 
- Method security provides protection at a more granular level.
- It's common to combine Web security and method security. 
- If the access is denied the caller will get an **AccessDeniedException**.

```java
// enable method security
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SampleSecureApplication {
}

// use method security
@Service
public class MyService {

  @Secured("ROLE_USER")
  public String secure() {
    return "Hello Security";
  }
}
```

### What do @PreAuthorized and @RolesAllowed do? What is the difference between them?

- `@PreAuthorize` and `@PostAuthorize` are used on methods or controllers to enforce security constraints. 
- `@RolesAllowed` is used to secure a controller. @RolesAllowed is a java standard annotation that does not support SpEL. 

  #### What does Spring’s @Secured do?
    The same as `@RolesAllowed` except this annotation is spring specific.

  #### How are these annotations implemented?
    `@PreAuthorize` and `@PostAuthorize` are used on methods or controllers level.

  #### In which security annotation are you allowed to use SpEL?
    `@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, `@PostFilter`.

### Is it enough to hide sections of my output (e.g. JSP-Page or Mustache template)?  
- You can use a special tag for hiding or not generating parts of JSP depending on access level. 
- You can also verify the user has access to the URL and only allow accessing to the view based on user.

### Spring security offers a security tag library for JSP, would you recognize it if you saw it in an example?

Spring Security **Taglibs** provides basic support for accessing security information.

```xml
<-- before use, need to import the taglib at the top of our JSP file: -->
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>


<sec:authorize access="!isAuthenticated()">
  Login
</sec:authorize>

<sec:authorize access="hasRole('ADMIN')">
  Manage Users
</sec:authorize>

<sec:authorize access="isAuthenticated()">
    Welcome Back, <sec:authentication property="name"/>
</sec:authorize>
```



### References
1. [Spring Security Architecture](https://spring.io/guides/topicals/spring-security-architecture)
2. [Spring Security with Boot](https://docs.spring.io/spring-security/site/docs/current/guides/html5/helloworld-boot.html)
3. [Introduction to Spring Security Taglibs](https://www.baeldung.com/spring-security-taglibs)
4. [Spring Security Notes from tonnguyen](https://quizlet.com/304129018/security-flash-cards/)
5. [Difference between Authentication and Authorization](http://www.differencebetween.net/technology/difference-between-authentication-and-authorization/)


