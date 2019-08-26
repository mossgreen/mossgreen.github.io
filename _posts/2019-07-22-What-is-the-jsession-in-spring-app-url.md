---
title: What Is the Jsessionid in Your Spring App URL
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

Why does Spring Boot append JsessionId in your URL and how to stop it?

// todo not finish yet...
## What is Cookie

A cookie is data stored on the client-side. They’re used to identify a client when sending a subsequent request. They can also be used for passing some data from one servlet to another. Cookies are added to the request by the client. The client checks its parameters and decides if it can deliver it to the current URL.

The Cookie class is defined in the `javax.servlet.http` package.

To send it to the client, we need to create one and add it to the response:

```java
Cookie demoCookie = new Cookie("id", "demo");
response.addCookie(uiColorCookie);
```


## What is HttpSession

We can obtain an HttpSession straight from an HTTP request.

A session is server-side storage holding contextual data. Sessions allow applications running in a web container to keep track of individual users.

Data isn’t shared between different session objects (client can access data from its session only).

A servlet distinguishes users by their unique session IDs. The session ID arrives with each request. If the user's browser is cookie-enabled, the session ID is stored as a cookie. As an alternative, the session ID can be conveyed to the servlet by URL rewriting, in which the session ID is appended to the URL of the servlet or JavaServer Pages (JSP) file from which the user is making requests. 

### HTTP session invalidation

HTTP sessions are invalidated by calling the invalidate method on the session object or by specifying a specific time interval using the MaxInactiveInterval property.

Sessions that are invalidated explicitly by application code are invalidated immediately.


## Spring Session Resolver

The `SessionLocaleResolver` lets you retrieve **Locale** and **TimeZone** from the session that might be associated with the user’s request. In contrast to `CookieLocaleResolver`, this strategy stores locally have chosen locale settings in the Servlet container’s `HttpSession`. As a consequence, those settings are temporary for each session and are, therefore, lost when each session terminates.


## Spring Session
Spring Boot provides Spring Session auto-configuration for a wide range of data stores. When building a Servlet web application, the following stores can be auto-configured:
- JDBC
- Redis
- Hazelcast
- MongoDB

```properties
spring.session.store-type=jdbc
```

## Spring reference 14.2.1 Web Application Security

`<http>` Attributes

disable-url-rewriting Prevents session IDs from being appended to URLs in the application. Clients must use cookies if this attribute is set to true . The default is true .


## What is jsession

I’m using Spring Security’s concurrent session control to prevent users from logging in more than once at a time.

When I open another browser window after logging in, it doesn’t stop me from logging in again. Why can I log in more than once?

Browsers generally maintain a single session per browser instance. You cannot have two separate sessions at once. So if you log in again in another window or tab you are just reauthenticating in the same session. The server doesn’t know anything about tabs, windows or browser instances. All it sees are HTTP requests and it ties those to a particular session according to the value of the JSESSIONID cookie that they contain. When a user authenticates during a session, Spring Security’s concurrent session control checks the number of other authenticated sessions that they have. If they are already authenticated with the same session, then re-authenticating will not affect.

I’m not switching between HTTP and HTTPS but my session is still getting lost

Sessions are maintained either by exchanging a session cookie or by adding a jsessionid parameter to URLs (this happens automatically if you are using JSTL to output URLs, or if you call HttpServletResponse.encodeUrl on URLs (before a redirect, for example). If clients have cookies disabled, and you are not rewriting URLs to include the jsessionid , then the session will be lost. Note that the use of cookies is preferred for security reasons, as it does not expose the session information in the URL.


## References

1. [IBM Knowledge Center - Sessions](https://www.ibm.com/support/knowledgecenter/SSEQTP_9.0.5/com.ibm.websphere.base.doc/ae/cprs_sess.html)
2. [IBM Knowledge Center - Best practices for using HTTP sessions](https://www.ibm.com/support/knowledgecenter/en/SSEQTP_9.0.5/com.ibm.websphere.base.doc/ae/cprs_best_practice.html) 
3. [javax Interface HttpSession](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpSession.html)
4. [Handling Cookies and a Session in a Java Servlet](https://www.baeldung.com/java-servlet-cookies-session/)