---
title: Spring Security in Spring Certification
search: true
tags: 
  - Spring
  - Spring Security
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Spring Security in Pivotal Spring Professional Certification (6%).


## What are authentication and authorization? Which must come first?  

- **Authentication** is the process of verifying the validity of the principal’s credentials. Answers question of: Who are you?
 
- **Authorization** is the process of making a decision whether an authenticated user is allowed to perform a certain action within the application. Answers question of: What are you allowed to do?  It can be happen at both:
    - **web request level**
    - **method invocation level**

Authentication is the first step of authorization so always comes first.	

**Spring Security supports authentications**:
- Basic
- Form
- OAuth
- X.509
- Cookies
- Single-Sign-On

**How credentials are stored**:
- LDAP
- RDBMS
- properties files
- DAOs
- Beans
- others

**Most common user roles**:
- ADMIN
- MEMBER
- GUEST


## Is security a cross cutting concern? How is it implemented internally?  

The cross-cutting concern is a concern which is applicable throughout the application and it affects the entire application. For example: logging, security and transactions.
- Yes, security is a cross-cutting concern.

Spring Security tackles security from two angles:

1. To **secure web requests** and restrict access at the URL level, Spring Security is based entirely on standard servlet ﬁlters.
    - It doesn’t use servlets or any other servlet-based frameworks (such as Spring MVC) internally, so it has no strong links to any particular web technology. 
    - It deals in `HttpServletRequest` s and `HttpServletResponse` s and doesn’t care whether the requests come from a browser, a web service client, or AJAX.
    - Spring Security’s web infrastructure should only be used by delegating to an instance of `FilterChainProxy` .

2. Spring Security can also **secure method invocations** using Spring AOP, proxying objects and applying advice to ensure that the user has the proper authority to invoke secured methods.

**Spring Security Configuration**
1. declare the security filter for the application
2. define the Spring Security context
3. configure authentication and authorization

**Spring Security WebMvc under the hood**

1. A user tries to access the application by making a request. The application requires the user to provide the credentials so it can be logged in.
2. The credentials are verified by the Authenticaltion Manager and the user is granted access to the application. The authorization rights for this user are loaded into the **Spring Security context**.
3. The user makes a resource request (view, edit, insert, or delete information) and the **Security Interceptor** intercepts the request before the user accesses a protected/secured resource.
4. The Security Interceptor extracts the user authorization data from the security context and…
5. …delegates the decision to the Access Decision Manager.
6. The Access Decision Manager polls a list of voters to return a decision regarding the rights of the authenticated user to system resources.
7. Access is granted or denied to the resource based on the user rights and the resource attributes.

**Securing RESTful-WS** three-step process:

1. a security filter named springSecurityFilterChain needs to be added, the filter is replaced by a class extending `AbstractSecurityWebApplicationInitializer`. This class registers `DelegatingFilterProxy` to use `springSecurityFilterChain` before any other registered Filter.

2. add a Spring configuration class for security where we will declare who can access the application and what they are allowed to do. In the case of this application, things are easy: we are using in-memory authentication for teaching purposes, so add a user named _prospring5_ with the password _prospring5_ and the role _REMOTE_.

    ```java
    @Configuration 
    @EnableWebSecurity //enable secured behavior
    public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
        private static Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    
        @Autowired 
        protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception { 
            auth.inMemoryAuthentication() 
                .withUser("prospring5") 
                .password("prospring5") 
                .roles("REMOTE");
        }
        
        @Override 
        protected void configure(HttpSecurity http) throws Exception {
            http.sessionManagement() 
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS) 
            .and() 
            .authorizeRequests() 
            .antMatchers("/**")
            .permitAll() 
            .antMatchers("/rest/**")
            .hasRole("REMOTE")
            .anyRequest()
            .authenticated() 
            .and() 
            .formLogin() 
            .and() 
            .httpBasic() 
            .and() 
            .csrf()
            .disable();
        }
    
    }
    ```
3. add the rest application context, besides adding SecurityConfig to the root context application.
```java
public class WebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override 
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{ DataServiceConfig.class, SecurityConfig.class}; 
    }
    
    @Override 
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{ WebConfig.class}; 
    }
    
    @Override 
    protected String[] getServletMappings() { 
        return new String[]{"/rest/**"}; 
    }
}
```

**Securing a Web Application**
//todo


**Spring Security in Sprint Boot**
If library `spring-boot-starter-security` is in the classpath, Spring Boot automatically secures all HTTP endpoints with basic authentication. This will add the 
1. spring-security-core, 
2. spring-security-config, and 
3. springsecurity-web 

dependencies to your project.


## What is the delegating filter proxy?

Delegating filter proxy is a servlet filter registered with the web container that delegates the requests to a Filter implementation on the Spring context side. There're 2 places servlet filters are attached to:

1. Web container 
2. Spring context

As of Spring Security all requests pass through delegating filter proxy that is registered with the container and then go to `FilterChainProxy` (another filter but this time on the Spring context side).

Delegating filter proxy may be declared in 2 ways:

1. In `web.xml` (from WEB-INF folder)
2. By extending `AbstractSecurityWebApplicationInitializer`
    ```javapp
    public class SecurityWebInitializer extends AbstractSecurityWebApplicationInitializer { }
    ```

![IMAGE](https://i.loli.net/2019/06/08/5cfb80575a44e95751.jpg)


## What is the security filter chain?

1. The `DelegatingFilterProxy` delegates to `springSecurityFilterChain` which is a `FilterChainProxy`. 

2. The `FilterChainProxy` contains all the security logic arranged internally as a chain (or chains) of filters. 

3. Under the hood of `springSecurityFilterChain`, in a secured web environment the secured requests are handled by a chain of Spring-managed beans, which is why the proxy bean is named `springSecurityFilterChain`, because those filters are chained. 

The `springSecurityFilterChain` is a mandatory name that refers to a bean with the same name in the **Spring root application context**. 

This chain of filters has the following key responsibilities:

- driving authentication
- enforcing authorization
- managing logout
- maintaining SecurityContext in HttpSession

**A simple security configuration**

Any bean in the Spring application context that implements `WebSecurityConfigurer` can contribute to Spring Security configuration, but it’s often **most convenient** for the configuration class to extend `WebSecurityConfigurerAdapter`.

```java
@Configuration 
@EnableWebSecurity  //enables web security, use @EnableWebMvcSecurity if appliable
public class SecurityConfig extends WebSecurityConfigurerAdapter { 

}
```

**Overriding WebSecurityConfigurerAdapter’s `configure()` methods**
- `configure(WebSecurity)` Override to configure Spring Security’s **filter chain**.
- `configure(HttpSecurity)` Override to configure how requests are secured by **interceptors**.
- `configure(AuthenticationManagerBuilder)` Override to configure **user-details services**.


## What is a security context?

There are several ways to determine who the user is. These are a few of the most common ways:
1. Inject a _Principal_ object into the controller method.
2. Inject an _Authentication_ object into the controller method.
3. Use _SecurityContextHolder_ to get at the security context.
4. Use an `@AuthenticationPrincipal` annotated method.




- `SecurityContext` holds security information about the current thread of execution. 
- This information includes details about the principal. 
- Context is held in the `SecurityContextHolder`.
- By default the `SecurityContextHolder` uses a ThreadLocal to store these details, which means that the security context is always available to methods in the same thread of execution, even if the security context is not explicitly passed around as an argument to those methods.

**Obtaining information about the current user**
```java
Authentication authentication = SecurityContextHolder
    .getContext()
    .getAuthentication(); 
    
User user = (User) authentication.getPrincipal();
```


## What does the ** pattern in an antMatcher or mvcMatcher do?

`antMatcher(String antPattern)`
    Allows configuring the HttpSecurity to only be invoked when matching the provided **Ant-style pattern**.
1. `/admin/**` matches any path starting with `/admin`.

2. The `antMatcher(…)` method is the equivalent of the `<intercept-url.../>` element from XML, and equivalent methods are available to replace the configuration for the login form, logout URL configuration, and CSRF token support.


`mvcMatcher(String mvcPattern)`
Allows configuring the HttpSecurity to only be invoked when matching the provided Spring MVC pattern. Generally mvcMatcher is **more secure** than an antMatcher.

1. `antMatchers("/secured")` matches only the exact `/secured` URL

2. `mvcMatchers("/secured")` matches `/secured` as well as `/secured/`, `/secured.html`, `/secured.xyz`

```java
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

```java
@EnableWebSecurity 
public class DirectlyConfiguredJwkSetUri extends WebSecurityConfigurerAdapter {

  protected void configure(HttpSecurity http) {

    http 
      .authorizeRequests() 
        .mvcMatchers("/contacts/**").hasAuthority("SCOPE_contacts") .mvcMatchers("/messages/**").hasAuthority("SCOPE_messages")
        .anyRequest().authenticated() 
        .and() 
      .oauth2ResourceServer() .jwt();
  }
}
```


## Why is an mvcMatcher more secure than an antMatcher?

- `MvcMatcher()` uses Spring MVC's `HandlerMappingIntrospector` to match the path and extract variables.
- They both implement **RequestMatcher** interface
- `MvcMatcher` can also restrict the URLs by HTTP method

**In which order do you have to write multiple intercept-url's**?

- Patterns are always evaluated in the order they are defined. 
- Most specific patterns must come first and most general last.


## Does Spring Security support password hashing? What is salting?

Spring Security uses **PasswordEncoder** for encoding passwords. This interface has a `Md5PasswordEncoder` that allows for obtaining hashes of the password - that will be persisted.

**Salting** is appending a  random string to the hash to prevent hackers from matching with a hash from the standard dictionary of hashes.


## Why do you need method security? What type of object is typically secured at the method level.

(think of its purpose not its Java type.)

To apply security to lower layers of an application, **Spring Security uses AOP**. The respective bean is wrapped in a proxy that before calling the target method, first checks the credentials of the user and calls the method only if the user is authorized to call it.

Spring Security provides three different kinds of security annotations:

1. Spring Security’s own `@Secured`
2. JSR-250’s `@RolesAllowed`
3. Expression-driven annotations, with 
    - `@PreAuthorize` and `@PostAuthorize`, 
    - `@PreFilter`, and `@PostFilter`

The `@Secured` and `@RolesAllowed` annotations are the simplest options, restricting access based on what authorities have been granted to the user.

More flexibility in defining security rules on methods, Spring Security offers `@PreAuthorize` and `@PostAuthorize`. And `@PreFilter`/`@PostFilter` filter elements out of collections returned from or passed into a method.

1. **`@Secured`**
    - Method-level security must be enabled by annotating a configuration class (good practice is to annotate the Security Configuration class to keep all configurations related to security in one place) with `@EnableGlobalMethodSecurity(secured Enabled = true)`. Methods must be secured by annotating them with Spring Security annotation `@Secured`. 
    - When `securedEnabled` is true, a **pointcut** is created such that the **Spring Security aspects** will wrap bean methods that are annotated with `@Secured`. 
    - One drawback of the `@Secured` annotation is that it’s a Spring-specific annotation. If you’re more comfortable using annotations defined in Java standards, then perhaps you should consider using `@RolesAllowed` instead.
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
    - Method-level security must be enabled by annotating a configuration class (good practice is to annotate the Security Configuration class to keep all configurations related to security in one place) with `@EnableGlobalMethodSecurity(jsr250Enabled = true)`. 
    - `jsr250Enabled` and `securedEnabled` can be used together
    - Methods must be secured by annotating them with `JSR-250` annotations. 
    - With `jsr250Enabled` set to true, a **pointcut** will be effected such that any methods annotated with @RolesAllowed will be wrapped with Spring Security’s aspects.
    - The JSR 250 annotations are standards-based and **allow simple role-based constraints to be applied but do not have the power of Spring Security’s native annotations**.
    - The `@RolesAllowed` annotation is equivalent to `@Secured` in almost every way
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

3. Use SpEL to enable more security constraints on methods
    - `@PreAuthorize`: Restricts access to a method before invocation based on the result of evaluating an expression
    - `@PostAuthorize`: Allows a method to be invoked, but throws a security exception if the expression evaluates to **false**
    - `@PostFilter`: Allows a method to be invoked, but filters the results of that method based on an expression
    - `@PreFilter`: Allows a method to be invoked, but filters input prior to entering the method
    
    **@Secured, @PreAuthorize, or @RolesAllowed annotations at the class level as well!**.

    Each of these annotations accepts a SpEL expression for its value parameter. If the expression evaluates to `true`, then the security rule passes; otherwise, it fails. The implications of a passing versus failing security rule differ depending on which annotation is in use. You need to enable them by setting `@EnableGlobalMethodSecurity`’s `prePostEnabled` attribute to true:

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

**@Secured** and **@RolesAllowed** prevent a method from being executed unless the user has the required authority. But their weakness is that they’re only able to make their decisions based on the user’s granted authorities.

With SpEL expressions guiding access decisions, far more advanced security constraints can be written.
```java
@PreAuthorize( "(hasRole('ROLE_SPITTER') and #spittle.text.length() <= 140) or hasRole('ROLE_PREMIUM')") 
public void addSpittle(Spittle spittle) { }
```

**In which security annotation are you allowed to use SpEL?**
`@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, `@PostFilter`.
  
**In which security expressions are you allowed to use SpEL?**
- `hasRole(role)`: Returns true if the current user has the specified role.
- `hasAnyRole(role1,role2)`: Returns true if the current user has any of the supplied roles.
- `isAnonymous()`: Returns true if the current user is an anonymous user.
- `isAuthenticated()`: Returns true if the user is not anonymous.
- `isFullyAuthenticated()`: Returns true if the user is not an anonymous or Remember-Me user.



## Old questions in Version 5 but removed since June 2019
---
## Why do you need the intercept-url?

The paths defined as values for the pattern attribute are pieces of URLs defined using ANT style paths. The URLs that match them are secured and verified according to rules defined by the `<intercept-url …/>` elements.

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


## References
1. [Spring Security Architecture](https://spring.io/guides/topicals/spring-security-architecture)
2. [Spring Security with Boot](https://docs.spring.io/spring-security/site/docs/current/guides/html5/helloworld-boot.html)
3. [Introduction to Spring Security Taglibs](https://www.baeldung.com/spring-security-taglibs)
4. [Spring Security Notes from tonnguyen](https://quizlet.com/304129018/security-flash-cards/)
5. [Difference between Authentication and Authorization](http://www.differencebetween.net/technology/difference-between-authentication-and-authorization/)
6. [Core Spring 4.2 Study Guide answers by Vitalie)](https://codingideas.blog/core-spring-4-2-study-guide-answers-part-5-security#What_is_the_delegating_filter_proxy/)
7. [Spring in Action, Fifth Edition](https://www.manning.com/books/spring-in-action-fifth-edition/)