---
title: Session is Lost in Session Scope Controller in Spring MVC App
search: true
tags: 
  - Spring
  - Spring MVC
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Why is my session lost and created as new in every servlet request?

I got a question from coworker:
> Fiddling with some web stuff on spring mvc one my localhost I can’t for the life of me figure our why I am getting a new session created on every request. Debug lots making sure each controller has a @Scope(“session”).  Sometimes session is there sometimes not, but mostly not and it is new on every request. Checked production and session seams find!

The answer is, finally he figured out himself, `localhost` is not a valid domain name and cookies won't be created.

If we test on localhost, we whould give it a name like 'localhost.com' it would just work well.



### References
1. [Session is lost and created as new in every servlet request](https://stackoverflow.com/questions/2138245/session-is-lost-and-created-as-new-in-every-servlet-request)
