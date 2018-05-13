---
title: Spring Data JPA 101
search: true
tags: 
  - JAVA
  - JPA
  - Database
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Working with Date/Time used to be a pain when days before Java8. For example, 
- the Date class has both date and time parts. If you want only the time infomation, you have to set date value to zero.
- the range of day in a month is 1 to 31. Whereas, the range of month is 0 to 11 rather than 1 to 12.

Here is an example form OCP_IZ0-809 book shows how Java8 Date/Time API work with datetime that acrosses timezone.

**FlightTravel.java**
```java
import java.time.Month; import java.time.ZoneId; import java.time.ZonedDateTime; import java.time.LocalDateTime; import java.time.format.DateTimeFormatter;

public class FlightTravel {

public static void main(String[] args) { DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy hh.mm a");

// Leaving on 1st Jan 2016, 6:00am from "Singapore" ZonedDateTime departure = ZonedDateTime.of(

LocalDateTime.of(2016, Month.JANUARY, 1, 6, 0), ZoneId.of("Asia/Singapore"));

System.out.println("Departure: " + dateTimeFormatter.format(departure));

// Arrival on the same day in 10 hours in "Auckland" ZonedDateTime arrival =

departure.withZoneSameInstant(ZoneId.of("Pacific/Auckland")) .plusHours(10);

System.out.println("Arrival: " + dateTimeFormatter.format(arrival));

}

}
```

## References 

- [Integrating Spring Data JPA, PostgreSQL, and Liquibase](https://auth0.com/blog/integrating-spring-data-jpa-postgresql-liquibase/?utm_source=medium&utm_medium=sc&utm_campaign=spring_data_jpa)

- [Spring JPA One-to-Many Query Examples with Property Expressions](https://medium.com/@evonsdesigns/spring-jpa-one-to-many-query-examples-281078bc457b)

- [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

- [Building a Spring Boot REST API — Part III: Integrating MySQL Database and JPA](https://medium.com/@salisuwy/building-a-spring-boot-rest-api-part-iii-integrating-mysql-database-and-jpa-81391404046a)

- [JPA “@JoinTable” annotation](https://stackoverflow.com/questions/5478328/jpa-jointable-annotation)

- [Hibernate Tips: How to map an entity to multiple tables](https://www.thoughts-on-java.org/hibernate-tips-how-to-map-an-entity-to-multiple-tables/)

