---
title: Handling Date Time in Java
search: true
tags: 
  - Java 8
  - Date
  - Time
  - Calendar
  - Date Time
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Handling Date Time in Java.

// DateTime history in Java
//

## Terminology

UTC: coordinated universal time
Unix epoch time:  1970-01-01T00:00:00Z (midnight at the start of January 1, 1970 GMT/UTC)

## Archeology

### Java Date from 1.0

- `java.util.Date` in Java 1.0
- It has no concept of time zone
- It's intended to reflect UTC, it may not do so exactly, depending on the host environment of the Java Virtual Machine.
- The class Date represents a specific instant in time, with millisecond precision. So, The new Java 8 `java.time.Instant` is the equivalent class to the classic `java.util.Date`.
- It represents the number of seconds passed since the Unix epoch time
- Years start from 1900
- months are zero-index based

### Calendar from 1.1

- `java.util.Calendar`
- `java.text.DateFormat` were introduced to parse the string dates but it's not thread-safe
- months are still zero-index based
- Calendar class is mutable then there is a thread-safety problem
- it is still problematic to do some calculations as intervals or differences between dates in a simple manner
- managing zoned dates still gives developers many headaches

### Date Time API

- `java.time`
- all immutable and thread-safe
- LocalDate, LocalTime, LocalDateTime
- Instant
- DateTimeFormatter, DateTimeFormatterBuilder
- TemporalAmount: Duration, Period
- Time Zones: ZoneID, ZoneOffset, OffsetDateTime, OffsetTime

### Java 8 Date Time API Details

- LocalDate : its instance is an immutable object representing a plain date without time of the day and store the date in the YYYY-MM-DD format. An instance of this class can be created in many ways.
- LocalTime : it is similar to LocalDate, but it represents only the time of the day without time zone details and stores the time in the HH:mm:ss.nanos format. An instance of this class can be created as follows:
- LocalDateTime : this is the combination of the previous two, holding both date and time parts without timezone details. The datetime is stored in the YYYY-MM-DDThh:mm:ss and can be created as follows:

```java
LocalDate.now(); //get the current date
LocalDate.now(ZoneId.of("Europe/Rome")); //get the current date in a specific zone
LocalDate.of(2020,06,10); //get a date from int values
LocalDate.parse("2020-06-10"); //get a date from string

LocalTime.now();//get the current time
LocalTime.now(ZoneId.of("Europe/Rome"));//get the current time in a specific zone
LocalTime.of(8, 30, 15, 10);//get an instance for 8h 30m 15s 10ns
LocalTime.parse("08:30:15.12345");

LocalDateTime.now();//get the current datetime
LocalDateTime.parse("2020-06-10T08:15:30");//get a datetime parsing the string
```

Instant : it is a specific point in the continuous timeline. It represents the seconds passed since the Epoch time 1970–01–01T00:00:00Z and internally stores two values :
    a long value representing seconds from the Epoch time
    an int value representing the nanoseconds of seconds

## Converting Date and Date Times

### Convert Date to LocalDate

convert `java.util.Date` to `java.time.LocalDate`

```java
Date date = new Date();
LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
ZonedDateTime zonedDateTime = date.toInstant().atZone(ZoneId.systemDefault());
```

### Convert LocalDate to Date

```java
ZoneId defaultZoneId = ZoneId.systemDefault();

LocalDate localDate = LocalDate.of(2046, 8, 19);
Date date = Date.from(localDate.atStartOfDay(defaultZoneId).toInstant());

LocalDateTime localDateTime = LocalDateTime.of(2046,8,19,21,46,31);
Date date2 = Date.from(localDateTime.atZone(defaultZoneId).toInstant());

        ZonedDateTime zonedDateTime = localDateTime.atZone(defaultZoneId);
Date date3 = Date.from(zonedDateTime.toInstant());
```


### To Long value from anything

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

### Date time to String

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

### Get date time parts

1. The WRONG way

    ```java
    int year = new Date().getYear();
    ```

    - @Deprecated
    - Returns the year represented by this date, minus 1900.

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

### (to be continued...)

- java.sql.Timestamp
- String to Date Time
- java.util.Date to java8 DateTime
- java8 DateTime to java.util.Date
- Date VS DateTime

## How to persist time

> Instead of saving the time in UTC along with the time zone, developers can save what the user expects us to save: the wall time. Ie. what the clock on the wall will say. In the example that would be 10:00. And we also save the timezone (Santiago/Chile). This way we can convert back to UTC or any other timezone.

see https://stackoverflow.com/questions/2532729/daylight-saving-time-and-time-zone-best-practices

## References

https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html
- [Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
https://medium.com/javarevisited/the-evolution-of-the-java-date-time-api-bfdc61375ddb
http://www.creativedeletion.com/2015/03/19/persisting_future_datetimes.html