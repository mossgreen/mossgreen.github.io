---
title: Converting Java Date Time 
search: true
tags: 
  - Java
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Converting Java Date Time painlessly.

## To Long value from anything

1. Easiest way
    ```java
    System.currentTimeMillis();
    ```  
    Returns the current time in milliseconds, since January 1, 1970 UTC.

2. Old way, since Java 1.0
    ```java
    new Date().getTime();
    ```
`new Date()`calls `System.currentTimeMillis()` inside.

3. Calendar to Long  
    ```java
    Calendar c = Calendar.getInstance();
    long timestamp = c.getTimeInMillis();
    ```

4. Instant to Long
  - Since Java 8. 
  - Returns the number of milliseconds since the epoch of 1970-01-01T00:00:00Z.
    ```java
    Instant.now().toEpochMilli();
    ```

5. Java 8 LocalDate
    ```java
    LocalDate.now()
      .atStartOfDay(ZoneId.systemDefault())
      .toInstant()
      .toEpochMilli();
    ```
6. Java 8 LocalDateTime
    ```java
    LocalDateTime.now()
      .toInstant(ZoneOffset.ofTotalSeconds(0))
      .toEpochMilli();
    ```
7. Sql timestamp to Long

//todo 

## Long value to Date Time

1. To java.util.date  
  ```java
  Date date = new Date(longValue);
  ```
2. To Calendar
  ```java
  Calendar c = Calendar.getInstance();
  c.setTimeInMillis(longValue);
  ```
3. To Instant  
  ```java
  Instant instant = Instant.ofEpochSecond(longValue);
  ```
4. To java.sql.Timestamp  
  ```java
  Timestamp timestamp = new Timestamp(longValue) ;
  ```
5. To java 8 LocalDate  
    ```java
    LocalDate date = Instant.ofEpochMilli(longValue)
      .atZone(ZoneId.systemDefault())
      .toLocalDate();
    ```
6. To java 8 LocalDateTime  
    ```java
    LocalDateTime date = LocalDateTime
        .ofInstant(Instant.ofEpochMilli(longValue), ZoneId.systemDefault());
    ```

## Date time to String

1. Old way, use SimpleDateFormat
  ```java
  SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy hh:mm:ss");
  Date today = new Date();
  String date = sdf.format(today);
  System.out.println(date); //02 Feb 2046 08:42:21
  ```

2. Java 8, DateTimeFormatter
  ```java
  LocalDateTime localDateTime = LocalDateTime.now();
  String format = localDateTime
        .format(DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm:ss"));
  System.out.println(format);
  ```

## Get date time parts

1. The WRONG way
 ```java
 int year = new Date().getYear();
 ```
-  @Deprecated
-  Returns the year represented by this date, minus 1900.

2. The Calendar API
```java
Calendar calendar = Calendar.getInstance();
calendar.setTime(new Date());
int year = calendar.get(Calendar.YEAR);
int month = calendar.get(Calendar.MONTH);
int day = calendar.get(Calendar.DAY_OF_MONTH); 
System.out.println(year);
System.out.println(month); //Month starts from 0 (January)
System.out.println(day);
```

3. SimpleDateFormat
  ```java
  Date date = new Date();
  int year = Integer.parseInt(new SimpleDateFormat("yyyy").format(date));
  System.out.println(year); //2046
  ```

4. Java 8 LocalDateTime API
  ```java
  int year = LocalDate.now().getYear();
  Month month = LocalDate.now().getMonth();
  int monthValue = LocalDate.now().getMonth().getValue();
  int dayOfMonth = LocalDate.now().getDayOfMonth();
  ```

## (to be continued...)
- java.sql.Timestamp
- String to Date Time
- java.util.Date to java8 DateTime
- java8 DateTime to java.util.Date
- Date VS DateTime


## References

- [Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)