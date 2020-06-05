---
title: Spring Boot Security 5 Basic
search: true
tags: 
  - Spring
  - Spring Boot
  - Spring Web
  - Spring Security
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Simple demos that explains something.

// todo not finish yet...

## Initializer

### 1. Dependencies

```gradle
dependencies {
 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
 implementation 'org.springframework.boot:spring-boot-starter-web'
 implementation 'org.springframework.boot:spring-boot-starter-security'
 developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

## 1. Default Login/Logout page

### 1.1 Spring Security generated default password

Run your project, in the log, you'll find your password

```log
2046-99-21 39:29:44.043  INFO 1733 --- [  restartedMain] .s.s.UserDetailsServiceAutoConfiguration :

Using generated security password: 1d4d7018-a42a-4418-afb1-7565250facdd

2046-99-21 39:29:44.112  INFO 1733 --- [  restartedMain] o.s.s.web.DefaultSecurityFilterChain     : Creating filter chain: blah
```

### 1.2 Test with default login

1. Default login form
    1. `http://localhost:8080/`, directs to `http://localhost:8080/login`, default login form
    2. `http://localhost:8080/home`, directs to `http://localhost:8080/login`, default login form
    3. `http://localhost:8080/api`, directs to `http://localhost:8080/login`, default login form

2. login details
    1. The username is `user`, and the password is `1d4d7018-a42a-4418-afb1-7565250facdd`
    2. Test using `curl` and `basic auth`

    ```bash
    \$ curl -u user:1d4d7018-a42a-4418-afb1-7565250facdd localhost:8080/api
    security api

    \$ echo -n "user:1d4d7018-a42a-4418-afb1-7565250facdd" | base64
    dXNlcjoxZDRkNzAxOC1hNDJhLTQ0MTgtYWZiMS03NTY1MjUwZmFjZGQ=

    \$ curl -H 'Accept:application/json' -H 'Authorization:Basic dXNlcjoxZDRkNzAxOC1hNDJhLTQ0MTgtYWZiMS03NTY1MjUwZmFjZGQ=' localhost:8080/api
    security api
    ```

3. Default logout function
    `http://localhost:8080/logout`

### 1.3 config username/pwd in `application.properties` file

```properties
spring.security.user.name=whatIsYourUserName
spring.security.user.password=hardToGuess
```

1. Restart project
  the Spring generated security password is gone
2. username and password is case-senstive

## 2. Customised login/logout page

### 2.1 Set it up

1. new `LoginController`

    ```java
    @Controller
    public class LoginController {
        @RequestMapping("/loginPage")
        public String login() { return "login_page"; }

        @RequestMapping("/logoutPage")
        public String logout() { return "logout_page"; }
    }
    ```

2. new Views

`resources/templates/login_page.html`

```html
<html xmlns:th="https://www.thymeleaf.org">
<head>
    <title>Custom Login</title>
</head>
<body>
<div>
    <form  th:action="@{/loginPage}" method="post">
        <fieldset>
            <legend>Custom Login</legend>
            <div th:if="${param.error}">
                <p style="color:red">invalid username or password.</p>
            </div>
            <div th:if="${param.logout}">
                <p style="color: green">You have been logged out.</p>
            </div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" />
            <label for="password">Password</label>
            <input type="text" id="password" name="password" />
            <div class="form-actions">
                <button class="btn" type="submit">Log In</button>
            </div>
        </fieldset>
    </form>

</div>
</body>
</html>
```

`resources/templates/logout_page.html`

```html
<html xmlns:th="https://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Custom Logout</title>
</head>
<body>
<h2>Custom Logout Page</h2>
<form th:action="@{/logoutPage}" method="post">
    <input type="submit" value="Log out" />
</form>
</body>
</html>
```

### 2.2 Customize security config

`SecurityConfig.java`

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    /*
    Copy from WebSecurityConfigurerAdapter, now we need to override it
     */
//    protected void configure(HttpSecurity http) throws Exception {
//        logger.debug("Using default configure(HttpSecurity). If subclassed this will potentially override subclass configure(HttpSecurity).");
//        http.authorizeRequests()
//            .anyRequest().authenticated()
//            .and()
//            .formLogin()
//            .and()
//            .httpBasic();
//    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .anyRequest()
            .authenticated()

            .and()
            .formLogin()
            .loginPage("/loginPage")
            .permitAll()

            .and()
            .logout()
            .logoutUrl("/logoutPage")
            .logoutSuccessUrl("/loginPage?logout")
            .permitAll();
    }
}
```

### 2.3 Test customized login page

## 3. Multiple Login Page

### 3.1 Set up vew for multi login pages

Add following files:

1. `resources/templates/admin/home.html`
2. `resources/templates/admin/login.html`
3. `resources/templates/user/home.html`
4. `resources/templates/user/login.html`

Example code from resources/templates/admin/login.html

```html
<html xmlns:th="https://www.thymeleaf.org">
<head>
    <title>Admin Login</title>
</head>
<body>
<h2>Welcome to admin login page</h2>
<form th:action="@{/admin/login}" method="post">
    <div id="loginTable">
        <table>
            <tbody>
            <tr>
                <td><label for="username">Username</label></td>
                <td><input type="text" id="username" name="username"></td>
            </tr>
            <tr>
                <td><label for="password">Password</label></td>
                <td><input type="text" name="password" id="password"></td>
            </tr>
            <tr>
                <td><input type="submit" value="Sign In"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="error" th:if="${param.error}">Invalid username or password.</div>
                    <div class="info" th:if="${param.logout}">You have been logged out.</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</form>
</body>
</html>
```

### 3.2 Set up MvcConfig

Add new config file `MvcConfig`

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("user/home");
        registry.addViewController("/admin/login").setViewName("admin/login");
        registry.addViewController("/admin/home").setViewName("admin/home");
        registry.addViewController("/user/login").setViewName("user/login");
        registry.addViewController("/user/home").setViewName("user/home");
    }
}
```

### 3.3 Set up SecurityConfig

1. Add new config file `SecurityConfig`
2. Add `AdminSecurityConfig`
3. Add `UserSecurityConfig`
4. Configure InMemoryUserDetails for ADMIN and User roles
5. PasswordEncoder

```java
Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Configuration
    @Order(1)
    public static class AdminSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/admin/**")
                .authorizeRequests()
                .antMatchers("/css/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest()
                .authenticated()

                .and()
                .formLogin()
                .loginPage("/admin/login")
                .defaultSuccessUrl("/admin/home")
                .permitAll()

                .and()
                .logout()
                .logoutUrl("/admin/logout")
                .permitAll();

        }
    }

    @Configuration
    @Order(2)
    public static class UserSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.antMatcher("/user/**")
                .authorizeRequests()
                .antMatchers("/css/**").permitAll()
                .antMatchers("/user/**").hasRole("USER")
                .anyRequest()
                .authenticated()

                .and()
                .formLogin()
                .loginPage("/user/login")
                .defaultSuccessUrl("/user/home")
                .permitAll()

                .and()
                .logout()
                .logoutUrl("/user/logout")
                .permitAll();

        }
    }

    @Bean
    public static PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user")
            .password(encoder().encode("123456"))
            .roles("user")
            .build());
        manager.createUser(User.withUsername("admin")
            .password(encoder().encode("123456"))
            .roles("ADMIN")
            .build());
        return manager;
    }
```

### 3.4 Test Multi login form

It creates two roles and got two in memory users. You can go to `http://localhost:8080/admin/login` to login admin users or `http://localhost:8080/user/login` to login in as USER role users.

## 4. hasRole and hasAuthority

### 4.1 Set up

HomeController.java

```java
@RestController
@AllArgsConstructor
@RequestMapping("/employee")
public class EmployeeController {

    @GetMapping
    public String findAll() { return "list"; }

    @DeleteMapping("/{id}")
    public Long delete(@PathVariable Long id) { return id; }
}
```

SecurityConfig.java

```java
Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Configuration
    @Order(1)
    public static class UserSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic();
        }
    }

        @Bean
    public static PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("admin")
            .password(encoder().encode("123456"))
            .roles("ADMIN")
            .build());
        manager.createUser(User.withUsername("user")
            .password(encoder().encode("123456"))
            .roles("USER")
            .build());
        manager.createUser(User.withUsername("guest")
            .password(encoder().encode("123456"))
            .roles("GUEST")
            .build());
        return manager;
    }
}
```

### 4.2 Test users

```bash
curl -H 'Accept:application/json' -u guest:123456 localhost:8080/employee
list
curl -H 'Accept:application/json' -u admin:123456 localhost:8080/employee
list
curl -H 'Accept:application/json' -u fake:123456 localhost:8080/employee
(nothing)
```

### 4.3 hasRole in HttpSecurity Filter

```java
    @Configuration
    @Order(1)
    public static class UserSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/employee**").hasRole("USER")
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic();
        }
    }
```

```bash
$ curl -H 'Accept:application/json' -u user:123456 localhost:8080/employee
list

$ curl -H 'Accept:application/json' -u guest:123456 localhost:8080/employee
{"timestamp":"2020-05-24T07:07:40.496+00:00","status":403,"error":"Forbidden","message":"Forbidden","path":"/employee"}
```

The guest user got `403` error, because it doesn't have `USER` role.

NB:

1. `.antMatchers(HttpMethod.GET, "/employee**").hasRole("USER")` notice the `/` in url

### 4.4 hasRole in method level

SecurityConfig.java

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {}
```

EmployeeController

```java
@GetMapping
@PreAuthorize("hasRole('USER')")
public String findAll() { return "list"; }
```

```bash
$ curl -H 'Accept:application/json' -u user:123456 localhost:8080/employee
list

$ curl -H 'Accept:application/json' -u guest:123456 localhost:8080/employee
{"timestamp":"2020-05-24T07:18:16.635+00:00","status":403,"error":"Forbidden","trace":"..."}
```

NB:

- Mind the annotation on `SecurityConfig.java` `@EnableGlobalMethodSecurity(prePostEnabled = true)`

### 4.5 hasAuthrise in SecurityConfig

```java
@Configuration
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Configuration
    @Order(1)
    public static class UserSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/employee**").hasAuthority("read")
                .antMatchers(HttpMethod.DELETE, "/employee/**").hasAuthority("delete")
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic();
        }
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("admin")
            .password(encoder().encode("123456"))
            .authorities("read","delete")
            .build());
        manager.createUser(User.withUsername("user")
            .password(encoder().encode("123456"))
            .authorities("read")
            .build());
        manager.createUser(User.withUsername("guest")
            .password(encoder().encode("123456"))
            .roles("GUEST")
            .build());
        return manager;
    }
```

```bash
$ curl -X DELETE  -u admin:123456 localhost:8080/employee/100
100%  

$ curl -X DELETE  -u user:123456 localhost:8080/employee/100  
{"timestamp":"2020-05-24T07:42:14.023+00:00","status":403,"error":"Forbidden","message":"Forbidden","path":"/employee/100"}%  
```

NB:

- `.antMatchers(HttpMethod.DELETE, "/employee/**").hasAuthority("delete")` mind the `/employee/`, it has two `/`s

### 4.6 hasAuthrise in method level

EmployeeController.java

```java
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('delete')")
    public Long delete(@PathVariable Long id) { return id; }
```

```bash
$ curl -X DELETE  -u admin:123456 localhost:8080/employee/100
100%
$ curl -X DELETE  -u guest:123456 localhost:8080/employee/100
{"timestamp":"2020-05-24T07:46:33.765+00:00","status":403,"error":"Forbidden","message":"Forbidden","path":"/employee/100"}%
```

## 5. Whitelist

1. Set up

    ```java
    @GetMapping("/home/ip")
    @ResponseBody
    public String ip(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
    ```

2. Whitelist in your security config
    In your security config, update:

    ```java
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/home/ip").hasIpAddress("192.168.1.0") // <-- whitelist
        ...
        }
    ```

3. Customize whitelist

    ```java
    public class CustomIpAuthenticationProvider implements AuthenticationProvider {

        private final List<String> ipWhiteList = new ArrayList<>();

        public CustomIpAuthenticationProvider() {

            // this list can be populated from DB
            ipWhiteList.add("192.168.1.0");
            ipWhiteList.add("192.168.1.1");
            ipWhiteList.add("192.168.1.1");
        }

        @Override
        public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            WebAuthenticationDetails details = (WebAuthenticationDetails) authentication.getDetails();
            String ip = details.getRemoteAddress();
            if (!ipWhiteList.contains(ip)) {
                throw new BadCredentialsException("Invalid Ip");
            }
            return authentication;
        }

        @Override
        public boolean supports(Class<?> authentication) {
            return true;
        }
    }
    ```

## 6. Custom Authentication

### 6.1 Set up

application.properteis

```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2
spring.h2.console.settings.trace=false
spring.h2.console.settings.web-allow-others=false

spring.datasource.url=jdbc:h2:D://data//test;DB_CLOSE_DELAY=-1;
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
```

SecurityConfig.java

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().ignoringAntMatchers("/h2/**")
            .and()
            .headers().frameOptions().sameOrigin()
            .and()
            .authorizeRequests()
            .antMatchers("/h2/**").permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .formLogin();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

CustomUsernamePasswordAuthenticationProvider.java

```java
@Component
public class CustomUsernamePasswordAuthenticationProvider implements AuthenticationProvider {

    final private EmployeeRepo employeeRepo;

    public CustomUsernamePasswordAuthenticationProvider(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        Employee employee = employeeRepo.findByName(username)
            .orElseThrow(()-> new BadCredentialsException("Invalid username"));

        String usernameDB = employee.getName();
        String passwordDB = employee.getPassword();

        boolean isPasswordCorrect = BCrypt.checkpw(password, passwordDB);

        if (username.equals(usernameDB) && isPasswordCorrect) {
            return new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
```

### 6.2 Set up Repo

EmployeeRepo.java

```java
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    Optional<Employee> findByName(String name);
}
```

### 6.3 Set up H2 database

1. Start the project
2. got to h2 db interface
    - `Driver Class:org.h2.Driver`
    - `JDBC URL: jdbc:h2:D://data//test;DB_CLOSE_DELAY=-1;`
    - `User Name: sa`
    - `Password: (empty)` // we didn't config it
3. Insert a demo user
    - id:1
    - name: "user"
    - password, go to `https://www.browserling.com/tools/bcrypt` to generate one

### 6.4 test

## 7. Block Attacks from an IP

### 7.1 Set up components

add dependency

```gradle
compile group: 'com.google.guava', name: 'guava', version: '21.0'
```

LoginAttemptService.java

```java
@Service
public class LoginAttemptService {
    private static final Integer MAX_ATTAMPT = 3;
    private LoadingCache<String, Integer> attemptCache;

    public LoginAttemptService() {
        this.attemptCache = CacheBuilder.newBuilder()
            .expireAfterAccess(1, TimeUnit.DAYS)
            .build(new CacheLoader<String, Integer>() {
                @Override
                public Integer load(String key) throws Exception {
                    return 0;
                }
            });
    }

    public void loginSucceed(String ip) {
        attemptCache.invalidate(ip);
    }

    public void loginFailed(String ip) {
        Integer attempts = 0;
        try {
            attempts = attemptCache.get(ip);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        attempts ++;

        attemptCache.put(ip, attempts);
    }

    public boolean isBlocked(String ip) {
        Integer attempts = 0;
        try {
           attempts = attemptCache.get(ip);
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return attempts > MAX_ATTAMPT;
    }
}
```

### 7.2 Set up event listeners

AuthenticationLoginFailureEventListener.java

```java
@Component
public class AuthenticationLoginFailureEventListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    private LoginAttemptService loginAttemptService;

    public AuthenticationLoginFailureEventListener(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        WebAuthenticationDetails details = (WebAuthenticationDetails) event.getAuthentication().getDetails();
        loginAttemptService.loginFailed(details.getRemoteAddress());
    }
}
```

AuthenticationLoginSuccessEventListener.java

```java
@Component
public class AuthenticationLoginSuccessEventListener implements ApplicationListener<AuthenticationSuccessEvent> {

    private LoginAttemptService loginAttemptService;

    public AuthenticationLoginSuccessEventListener(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        WebAuthenticationDetails webAuthenticationDetails = (WebAuthenticationDetails) event.getAuthentication().getDetails();
        loginAttemptService.loginSucceed(webAuthenticationDetails.getRemoteAddress()
        );
    }
}
```

### 7.3 Inject services into CustomUsernamePasswordAuthenticationProvider

CustomUsernamePasswordAuthenticationProvider.java

```java
@Override
public Authentication authenticate(Authentication authentication) throws AuthenticationException {

    final WebAuthenticationDetails details = (WebAuthenticationDetails) authentication.getDetails();
    if (loginAttemptService.isBlocked(details.getRemoteAddress())) {
        throw new BadCredentialsException("Invalid ip");
    }

    String username = authentication.getName();
    String password = authentication.getCredentials().toString();

    Employee employee = employeeRepo.findByName(username)
        .orElseThrow(()-> new BadCredentialsException("Invalid username"));

    String usernameDB = employee.getName();
    String passwordDB = employee.getPassword();

    boolean isPasswordCorrect = BCrypt.checkpw(password, passwordDB);

    if (username.equals(usernameDB) && isPasswordCorrect) {
        return new UsernamePasswordAuthenticationToken(username, password, new ArrayList<>());
    } else {
        throw new BadCredentialsException("Invalid username or password");
    }
}
```

### 7.4 test

Try to login but provide wrong password for five times.
Try to login again, will get invalid ip error message.

## 8. Acquire user's information

### 8.1 pre setting

application.properties

```properties
spring.security.user.name=username
spring.security.user.password=123456
```

### 8.2 Implement

UserInfoController.java

```java

@RestController
@Slf4j
public class UserInfoController {

    @GetMapping("/userInfo")
    public String userInfo(Authentication authentication) {
        log.info("name: {}", authentication.getName());
        log.info("principle: {}", authentication.getPrincipal());
        log.info("details: {}", authentication.getDetails());
        log.info("credentials: {}", authentication.getCredentials());
        log.info("authorities: {}", authentication.getAuthorities());
        return authentication.getName();
    }
}
```

It logs with:

```log
c.m.springsecurity.UserInfoController    : name: user
c.m.springsecurity.UserInfoController    : principle: user
c.m.springsecurity.UserInfoController    : details: org.springframework.security.web.authentication.WebAuthenticationDetails@380f4: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: D4239E2FC21B82D9BADB6D5F25A29B79
c.m.springsecurity.UserInfoController    : credentials: null
c.m.springsecurity.UserInfoController    : authorities: []
```

details have info like:

- ip,
- session

### 8.3 keep credentials in the Authenticate object

credentials will be removed by default. If you want the credential to be kept within the Authentication object, in `Securityconfig.java` update:

SecurityConfig.java

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  // something no need to mention
  
    @Override
    protected void configure(AuthenticationManagerBuilder auth)  throws  Exception {
        auth.eraseCredentials(false);
        auth.authenticationProvider(customUsernamePasswordAuthenticationProvider);
    }

}
```

In the log you'll see: `credentials: 123456`

### 8.4 Other ways you get user's info

1. Current way is to inject `Authentication` directely to the controller's parameter
2. You can also get `Authentication` inside of method body
3. You can use `Principle` rather than `Authentication`

```java
@GetMapping("/userInfo")
public String userInfo(Authentication authentication) {
    return authentication.getName();
}

@GetMapping("/userInfo2")
public String userInfo2() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getName();
}

@GetMapping("/userInfo3")
public String userInfo3(Principal principal) {
    return principal.getName();
}
```

## 9. httpBasic vs. loginform

httpBasic: interface
loginForm: web page
you can use either of them, or both of them.

### 9.1 code

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeRequests()
        .anyRequest()
        .authenticated()
        .and()
        .httpBasic()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
}

@Override
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeRequests()
        .anyRequest()
        .authenticated()
        .and()
        .formLogin()
        .successForwardUrl("/home")
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
}

@Override
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeRequests()
        .anyRequest()
        .authenticated()
        .and()
        .httpBasic()
        .and()
        .formLogin()
        .defaultSuccessUrl("/index");
}
```

### 9.2 httpBasic

- default behaviour
- A dialog form poped out, user needs to fill in username and password.

### 9.3 formlogin()

- default login page
- default logout url

### 9.4 Cookie and Session in Spring Security

- `formLogin` use `ifRequired` session policy
- `httpBasic` use `STATELESS` session policy
