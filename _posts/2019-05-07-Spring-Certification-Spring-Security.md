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

## What are authentication and authorization? Which must come first?  

 - Authentication is the process of verifying the validity of the principal’s credentials. **Who are you?**
 - Authorization is the process of making a decision whether an authenticated user is allowed to perform a certain action within the application. **What are you allowed to do?**
 - Authentication is the first step of authorization so always comes first.	

## Is security a cross cutting concern? How is it implemented internally?  

- The cross-cutting concern is a concern which is applicable throughout the application and it affects the entire application. For example: logging, security and transactions.
- Yes, security is a cross-cutting concern.

Spring Security tackles security from two angles. 

1. To **secure web requests** and restrict access at the URL level, Spring Security uses servlet filters. 
2. Spring Security can also **secure method invocations** using Spring AOP, proxying objects and applying advice to ensure that the user has the proper authority to invoke secured methods.

![IMAGE](https://i.loli.net/2019/06/08/5cfb89f9a75c570368.jpg)


## What is the delegating filter proxy?

You needed a hook‐up mechanism so that web requests coming into the web container will first pass through your Spring Security filter chain.

1. `org.springframework.web.filter.DelegatingFilterProxy.` is a special `javax.servlet.Filter`. 

2. It acts as a proxy in front and delegates web requests to the Spring Security Filter chain bean defined by <security:http> element.

3. Its name must be defined exactly as springSecurityFilterChain in the `web.xml` file because that same name is also used by Spring Security while defining a filter chain as a bean in the ApplicationContext via the <security:http> element.


![IMAGE](https://i.loli.net/2019/06/08/5cfb80575a44e95751.jpg)


## What is the security filter chain?

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

## What is a security context?

- `SecurityContext` holds security information about the current thread of execution. 
- This information includes details about the principal. 
- Context is held in the `SecurityContextHolder`.

```java
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
assert(authentication.isAuthenticated);
```

## What does the ** pattern in an antMatcher or mvcMatcher do?

`/admin/**` matches any path starting with `/admin`.

The `antMatcher(…)` method is the equivalent of the `<intercept-url.../>` element from XML, and equivalent methods are available to replace the configuration for the login form, logout URL configuration, and CSRF token support.

```xml
<!--mvc-security.xml-->
<http auto-config="true" use-expressions="true">
  <intercept-url pattern="/users/show/*" access="hasRole(’ADMIN’)"/> 
</http>
```
```java
//or SecurityConfig.java 
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests() 
      .antMatchers("/users/show/*")
      .hasRole("ADMIN") ...
  }
}
```

## Why is an mvcMatcher more secure than an antMatcher?

- `MvcMatcher()` uses Spring MVC's `HandlerMappingIntrospector` to match the path and extract variables.
- They both implement **RequestMatcher** interface
- `MvcMatcher` can also restrict the URLs by HTTP method


## In which order do you have to write multiple intercept-url's?

- Patterns are always evaluated in the order they are defined. 
- Most specific patterns must come first and most general last.


## Does Spring Security support password hashing? What is salting?

Spring Security uses **PasswordEncoder** for encoding passwords. This interface has a `Md5PasswordEncoder` that allows for obtaining hashes of the password - that will be persisted.

**Salting** is appending a  random string to the hash to prevent hackers from matching with a hash from the standard dictionary of hashes.


## Why do you need method security? What type of object is typically secured at the method level.

(think of its purpose not its Java type.)

To apply security to lower layers of an application, **Spring Security uses AOP**. The respective bean is wrapped in a proxy that before calling the target method, first checks the credentials of the user and calls the method only if the user is authorized to call it.

Three ways of using method security:
xml, Spring Security namespace, Java Configuration and annotations

1. **`@Secured`**
Method-level security must be enabled by annotating a configuration class (good practice is to annotate the Security Configuration class to keep all configurations related to security in one place) with `@EnableGlobalMethodSecurity(secured Enabled = true)`. Methods must be secured by annotating them with Spring Security annotation `@Secured`.
    ```java
    @Configuration 
    @EnableWebSecurity 
    @EnableGlobalMethodSecurity(securedEnabled = true) 
    public class SecurityConfig extends WebSecurityConfigurerAdapter { }
    ```
    ```java
    @Service 
    @Transactional(readOnly = true, propagation = Propagation.REQUIRED) 
    public class UserServiceImpl implements UserService {
    
      @Secured("ROLE_ADMIN") 
      public User findById(Long id) { 
        return userRepo.findOne(id);
      }
    }
    ```

2. **`JSR-250` annotations**   
Method-level security must be enabled by annotating a configuration class (good practice is to annotate the Security Configuration class to keep all configurations related to security in one place) with `@EnableGlobalMethodSecurity(jsr250Enabled = true)`. Methods must be secured by annotating them with `JSR-250` annotations. The JSR 250 annotations are standards-based and **allow simple role-based constraints to be applied but do not have the power of Spring Security’s native annotations**.
    ```java
    @Configuration 
    @EnableWebSecurity 
    @EnableGlobalMethodSecurity(jsr250Enabled = true) 
    public class SecurityConfig extends WebSecurityConfigurerAdapter { }
    ```
    
    ```java
    @Service 
    @Transactional(readOnly = true, propagation = Propagation.REQUIRED) 
    public class UserServiceImpl implements UserService {
      @RolesAllowed("ROLE_ADMIN") 
      public User findById(Long id) { 
        return userRepo.findOne(id); 
      }
    }
    ```

Once you enable method-level security, you can annotate the SpringMVC controller
- request-handling methods, 
- service-layer methods, 
- or any Spring components 
 
with `@Secured`, `@PreAuthorize`, or `@RolesAllowed` in order to define your security restrictions.

**@Secured, @PreAuthorize, or @RolesAllowed annotations at the class level as well!**

- If we secure only the web layer there may be a way to access service layer in case we expose some REST endpoints. 
- Method security provides protection at a more granular level.
- It's common to combine Web security and method security. 
- If the access is denied the caller will get an **AccessDeniedException**.

**four annotations**
`@PreAuthorize`, `@PreFilter`, `@PostAuthorize`, and `@PostFilter`.
Have to set: `@EnableGlobalMethodSecurity(prePostEnabled = true)`
```java
@Configuration 
@EnableWebSecurity 
@EnableGlobalMethodSecurity(prePostEnabled = true) 
public class SecurityConfig extends WebSecurityConfigurerAdapter {}
```
```java
@Service 
@Transactional(readOnly = true, propagation = Propagation.REQUIRED) 
public class UserServiceImpl implements UserService {

  @PreAuthorize("hasRole(’USER’)") 
  public void create(User user){}
}
```


## What do @PreAuthorized and @RolesAllowed do? What is the difference between them?

- `@PreAuthorize` and `@PostAuthorize` are used on methods or controllers to enforce security constraints. 
- `@RolesAllowed` is used to secure a controller. @RolesAllowed is a java standard annotation that does not support SpEL. 

  ### What does Spring’s @Secured do?
    The same as `@RolesAllowed` except this annotation is spring specific.

  ### How are these annotations implemented?
    `@PreAuthorize` and `@PostAuthorize` are used on methods or controllers level.

  ### In which security annotation are you allowed to use SpEL?
    `@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, `@PostFilter`.
  
  ### In which security expressions are you allowed to use SpEL?
  - `hasRole(role)`: Returns true if the current user has the specified role.
  - `hasAnyRole(role1,role2)`: Returns true if the current user has any of the supplied roles.
  - `isAnonymous()`: Returns true if the current user is an anonymous user.
  - `isAuthenticated(): Returns true if the user is not anonymous.
  - `isFullyAuthenticated()`: Returns true if the user is not an anonymous or Remember-Me user.
---
# Old questions in Version 5 but removed since June 2019


## Why do you need the intercept-url?

The paths defined as values for the pattern attribute are pieces of URLs defined using ANT style paths. The URLs that match them are secured and verified according to rules defined by the <intercept-url …/> elements.

It is used to define a URL for the requests we want to have some security constraints.

```xml
<beans:beans ...> 
  <http use-expressions="true"> 
    <intercept-url pattern="/auth*" access="permitAll"/>
    <intercept-url pattern="/users/edit" access="ROLE_ADMIN"/> 
    <intercept-url pattern="/users/**" access="hasAnyRole(’ROLE_USER, ROLE_ADMIN’)"/>
    <intercept-url pattern="/users/**" access="IS_AUTHENTICATED_FULLY"/>
  </http> 
</beans:beans>
```

NB: `hasAnyRole(’[RoleList]’)` checks whether the principal has any of the roles in the RoleList.: `access="hasAnyRole(’ROLE_USER, ROLE_ADMIN’)"`

In the other hand, to limit access to certain resources also can be managed via `antMatcher(...)` methods.
```java
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  Override
  protected void configure(HttpSecurity http) throws Exception {
    http .authorizeRequests() 
      .antMatchers("/users/show/*")
      .hasRole("ADMIN")
  } 
}
```

## Is it enough to hide sections of my output (e.g. JSP-Page or Mustache template)?  
- You can use a special tag for hiding or not generating parts of JSP depending on access level. 
- You can also verify the user has access to the URL and only allow accessing to the view based on user.

## Spring security offers a security tag library for JSP, would you recognize it if you saw it in an example?

Spring Security **Taglibs** provides basic support for accessing security information.

Enable it:
1. Add `spring‐security‐taglibs` dependency.
2. Declare it in the JSP page   
    ```jsp
    <-- before use, need to import the taglib at the top of our JSP file: -->
    <%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
    ```
**Tags**
1. Authorize Tag   
The authorize tag is used to determine whether the content written between the `<sec:authorize>` tags should be evaluated by the JSP. It can be used to display individual HTML elements—such as buttons—in the page, according to the granted authorities of the current user.
    - **url** attribute
    - `ifAllGranted`, `ifNotGranted` and `ifAnyGranted` were recently **deprecated** in favor of access attribute.
    ```jsp
    <sec:authorize ifAllGranted="ROLE_EDITOR"> 
      <a href="editor.jsp">Editors only</a> 
    </sec:authorize>
    
    <sec:authorize access="!isAuthenticated()">
      Login
    </sec:authorize>
    ```

2. authenticate tag is `authentication`
The `authenticate` tag is used to access the contents of the current Authentication token in **SecurityContext**. It can be used to display information about the current user in the page.
    ```jsp
    <sec:authentication property="principal.username"/>
    
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