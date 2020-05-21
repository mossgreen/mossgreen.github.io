---
title: Spring Security Basic
search: true
tags: 
  - Spring
  - Session
  - Spring Web
  - Spring Security
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Answers some questions you may ask in work.

// todo not finish yet...

## Initializer

```gradle
dependencies {
 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
 implementation 'org.springframework.boot:spring-boot-starter-web'
 developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

## DEMO 1 - Set up

### HomeController

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

### Home html page

```html
<body> <h2>This is home page</h2> </body>
```

### demo 1 login

1. `http://localhost:8080/` -> home page
2. `http://localhost:8080/home` -> home page
3. `http://localhost:8080/api` -> security api

## DEMO 2 - Default Login/Logout page

### Add a dependency

```gradle
implementation 'org.springframework.boot:spring-boot-starter-security'
```

### Restart project, get your password

In the log, you'll find something like:

```log
2046-99-21 39:29:44.043  INFO 1733 --- [  restartedMain] .s.s.UserDetailsServiceAutoConfiguration :

Using generated security password: 1d4d7018-a42a-4418-afb1-7565250facdd

2046-99-21 39:29:44.112  INFO 1733 --- [  restartedMain] o.s.s.web.DefaultSecurityFilterChain     : Creating filter chain: blah
```

### demo 2 login

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

## DEMO 3 - configure username/pwd

### config in `application.properties` file

```properties
spring.security.user.name=whatIsYourUserName
spring.security.user.password=hardToGuess
```

### Restart project

the Spring generated security password is gone

### demo 3 login

- username and password is case-senstive
