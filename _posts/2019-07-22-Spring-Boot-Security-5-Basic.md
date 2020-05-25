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
