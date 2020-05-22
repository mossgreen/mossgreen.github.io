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

Simple demos that explains.

// todo not finish yet...

## Initializer

### 1. Dependencies

```gradle
dependencies {
 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
 implementation 'org.springframework.boot:spring-boot-starter-web'
 developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

### 2. HomeController

```java
@Controller
public class HomeController {

    @GetMapping(value = {"/", "/home"})
    public String home() { return "home"; }

    @GetMapping("/api")
    @ResponseBody
    public String api() { return "security api"; }
}
```

### 3. HTMLs

```html
<body> <h2>This is home page</h2> </body>
```

### 4. Run

1. `http://localhost:8080/` -> home page
2. `http://localhost:8080/home` -> home page
3. `http://localhost:8080/api` -> security api

## DEMO 1 - Default Login/Logout page

### 1. Add Spring Boot Security dependency

```gradle
implementation 'org.springframework.boot:spring-boot-starter-security'
```

### 2. Spring Security generated default password

Run your project, in the log, you'll find your password

```log
2046-99-21 39:29:44.043  INFO 1733 --- [  restartedMain] .s.s.UserDetailsServiceAutoConfiguration :

Using generated security password: 1d4d7018-a42a-4418-afb1-7565250facdd

2046-99-21 39:29:44.112  INFO 1733 --- [  restartedMain] o.s.s.web.DefaultSecurityFilterChain     : Creating filter chain: blah
```

### Test with default login

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

### config username/pwd in `application.properties` file

```properties
spring.security.user.name=whatIsYourUserName
spring.security.user.password=hardToGuess
```

1. Restart project
  the Spring generated security password is gone
2. username and password is case-senstive

## Demo 2: customised login/logout page

### Set it up

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

3. Customize security config

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

4. // test
