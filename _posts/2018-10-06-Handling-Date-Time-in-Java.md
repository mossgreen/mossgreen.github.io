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
Unix epoch time: 1970-01-01T00:00:00Z (midnight at the start of January 1, 1970 GMT/UTC)
DST: Daylight Saving Time

## Archeology

Why use a class to represent dates rather than a built-in type?

### Java Date since Java 1.0

- `java.util.Date` in Java 1.0
- It has no concept of time zone
- It doesn’t represent a date, but a point in time with millisecond precision
- It's intended to reflect UTC, it may not do so exactly, depending on the host environment of the Java Virtual Machine
- The class Date represents a specific instant in time, with millisecond precision. So, The new Java 8 `java.time.Instant` is the equivalent class to the classic `java.util.Date`.
- It represents the number of seconds passed since the Unix epoch time
- Years start from 1900
- months are zero-index based
- the `toString()` method is quite misleading because it includes the JVM’s default time zone

### java.sql.Date since Java 1.1

```java
package java.sql;
public class Date extends java.util.Date {/**/}
```

### Calendar sicne 1.1

- `java.util.Calendar`
- `java.text.DateFormat` were introduced to parse the string dates but it's not thread-safe. If two threads try to parse a date by using the same formatter at the same time, you may receive unpredictable results.
- months are still zero-index based
- Calendar class is mutable then there is a thread-safety problem
- It got rid of the 1900 offset for the year
- Months also start at index 0
- it is still problematic to do some calculations as intervals or differences between dates in a simple manner
- managing zoned dates still gives developers many headaches

### Joda-Time

- A third-party date and time library
- Java 8 integrates many of the Joda-Time features in the `java.time` package

### Date Time API since Java 1.8

- `java.time` package
- all immutable and thread-safe
- LocalDate, LocalTime, LocalDateTime
- Instant
- TemporalAmount: Duration, Period
- DateTimeFormatter, DateTimeFormatterBuilder
- Time Zones: ZoneID, ZoneOffset, OffsetDateTime, OffsetTime

## Java 8 Date Time API Details

### LocalDate, LocalTime, LocalDateTime

- Don't have time zone info
- Human readable

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

### Instant

- Comparing to above classes, `Instant` is more like a concept for machine
- From a machine point of view, the most natural format to model time is a single large number representing a point on a continuous timeline
- This approach is used by the new `java.time.Instant` class, which represents the number of seconds passed since the Unix epoch time, set by convention to midnight of January 1, 1970 UTC
- the Instant class supports **nanosecond** precision
- It supposed not to be with human readable classes
- However, it works with `Duration` and `Period` classes

### Duration, Period

- All the classes above implement the `Temporal` interface, which defines how to read and manipulate the values of an object modeling a generic point in time
- `Duration` is the time tween two temporal objects
- It makes sense to human-readble time classes (LocalTime, LocalDateTime) as well as machine-sense classes (Instant). So there is a duration between each catetory of them.
- However, you cannot either use `LocalDate`, because it doesn't represents time, nor mix of them. `DateTimeException` is what you'll get.
- For the time represents an amount of time in terms of years, months, and days, you can use the `Period` class

```java
// between method,
Duration d1 = Duration.between(time1, time2);
Duration d1 = Duration.between(dateTime1, dateTime2);
Duration d2 = Duration.between(instant1, instant2);
Period tenDays = Period.between(LocalDate.of(2001, 9, 11), LocalDate.of(2046, 9, 21));

// create instances
Duration threeMinutes = Duration.ofMinutes(3);
Period tenDays = Period.ofDays(10);
```

### TemporalAdjusters

TemporalAdjusters allow you to manipulate a date in a more complex way than changing one of its values, and you can define and use your own custom date transformations.

```java
// implement your own TemporalAdjusters
```

### Printing and parsing date-time objects

In comparison with the old `java.util.DateFormat` class, all the `DateTimeFormatter` instances are thread-safe. Therefore, you can create singleton formatters like the ones defined by the `DateTimeFormatter` constants and share them among multiple threads.

```java
LocalDate date = LocalDate.of(2046, 3, 18);
String s1 = date.format(DateTimeFormatter.BASIC_ISO_DATE); // 20460318
String s2 = date.format(DateTimeFormatter.ISO_LOCAL_DATE); // 2046-03-18

LocalDate date1 = LocalDate.parse("20140318", DateTimeFormatter.BASIC_ISO_DATE);
LocalDate date2 = LocalDate.parse("2014-03-18", DateTimeFormatter.ISO_LOCAL_DATE);

// creating a DateTimeFormatter from a pattern
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
LocalDate date1 = LocalDate.of(2014, 3, 18);
String formattedDate = date1.format(formatter);
LocalDate date2 = LocalDate.parse(formattedDate, formatter);
```

```java
// todo DateTimeFormatterBuilder
```

### Java 8 with Time Zones using ZoneId

- A specific ZoneId is identified by a region ID, as in this example:

    ```java
    ZoneId romeZone = ZoneId.of("Europe/Rome");
    ```

- All the region IDs are in the format "`{area}/{city}`", and the set of available locations is the one supplied by the [Internet Assigned Numbers Authority (IANA) Time Zone Database](https://www.iana.org/time-zones).

- You can also convert an old TimeZone object to a ZoneId by using the new method toZoneId:

    ```java
    ZoneId zoneId = TimeZone.getDefault().toZoneId();
    ```

- When you have a ZoneId object, you can combine it with a `LocalDate`, a `LocalDateTime`, or an `Instant` to transform it into `ZonedDateTime` instances, which represent points in time relative to the specified time zone. `LocalDate + LocalTime + ZoneId = ZonedDateTime`

    ```java
    LocalDate date = LocalDate.of(2014, Month.MARCH, 18);
    ZonedDateTime zdt1 = date.atStartOfDay(romeZone); // LocalDate + LocalTime (atStartOfDay) + ZoneId

    LocalDateTime dateTime = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45);
    ZonedDateTime zdt2 = dateTime.atZone(romeZone); // LocalDateTime + ZoneId

    Instant instant = Instant.now();
    ZonedDateTime zdt3 = instant.atZone(romeZone);
    ```

### Java 8 with Time Zones using Offset from UTC

- Another common way to express a time zone is to use a fixed offset from UTC/Greenwich.
- `ZoneOffset` is a subclass of `ZoneId`, so it should be able to replace `ZoneId`
- `ZoneOffset` represents the difference between a time and the zero meridian of Greenwich, London, as follows:

    ```java
    ZoneOffset newYorkOffset = ZoneOffset.of("-05:00"); // New York is five hours behind London
    ```

- A `ZoneOffset` defined this way doesn’t have any Daylight Saving Time management, and for this reason, it isn’t suggested in the majority of cases

## Converting Date and Java 8 DateTimes

- Sometimes, you have to work with legacy code and deal with `Date` class.
- `Instant` is kinda the middle layer between the old and the new, because it has similar meaning as the old Date.
- You can also convert a LocalDateTime to an Instant by using a ZoneId and other around

    ```java
    // localDateTime to instant
    LocalDateTime dateTime = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45);
    Instant instantFromDateTime = dateTime.toInstant(romeZone);

    // instant to localDateTime
    Instant instant = Instant.now();
    LocalDateTime timeFromInstant = LocalDateTime.ofInstant(instant, romeZone);
    ```

### Convert between Date and Java 8 Date Time

1. convert `java.util.Date` to `java.time.LocalDate`

    ```java
    Date date = new Date();
    LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    ZonedDateTime zonedDateTime = date.toInstant().atZone(ZoneId.systemDefault());
    ```

2. convert `java.time.LocalDate` to `java.util.Date`

    ```java
    ZoneId defaultZoneId = ZoneId.systemDefault();

    LocalDate localDate = LocalDate.of(2046, 8, 19);
    Date date = java.util.Date.from(
        localDate // `LocalDate` class represents a date-only, without time-of-day and without time zone nor offset-from-UTC.
        .atStartOfDay( // Let java.time determine the first moment of the day on that date in that zone. Never assume the day starts at 00:00:00.
            defaultZoneId // Specify time zone using proper name in `continent/region` format, never 3-4 letter pseudo-zones such as “PST”, “CST”, “IST”.
            ) // Produce a `ZonedDateTime` object.
            .toInstant()); // Extract an `Instant` object, a moment always in UTC.

    LocalDateTime localDateTime = LocalDateTime.of(2046,8,19,21,46,31);
    Date date2 = Date.from(localDateTime.atZone(defaultZoneId).toInstant());

            ZonedDateTime zonedDateTime = localDateTime.atZone(defaultZoneId);
    Date date3 = Date.from(zonedDateTime.toInstant());
    ```

3. Implement your DateUtiles.class

    ```java
    public class DateUtils {

        public static Date asDate(LocalDate localDate) {
            return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
        }

        public static Date asDate(LocalDateTime localDateTime) {
            return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
        }

        public static LocalDate asLocalDate(Date date) {
            return Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
        }

        public static LocalDateTime asLocalDateTime(Date date) {
            return Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
    }

    ```

### Convert between Long value

In some systems, Date are saved as long value.

1. Easiest way

    ```java
    System.currentTimeMillis();
    ```  

2. Old way, since Java 1.0

    ```java
    Long longValue = new Date().getTime(); // it calls System.currentTimeMillis() inside
    Date date = new Date(longValue);
    ```

3. Calendar to Long  

    ```java
    Calendar c = Calendar.getInstance();
    long timestamp = c.getTimeInMillis(); // get
    c.setTimeInMillis(longValue); // set
    ```

4. Instant to Long

    ```java
    Instant.now().toEpochMilli();
    Instant instant = Instant.ofEpochSecond(longValue);
    ```

5. Java 8 LocalDate

    ```java
    LocalDate.now()
      .atStartOfDay(ZoneId.systemDefault())
      .toInstant()
      .toEpochMilli();

    LocalDate date = Instant.ofEpochMilli(longValue)
        .atZone(ZoneId.systemDefault())
        .toLocalDate();
    ```

6. Java 8 LocalDateTime

    ```java
    LocalDateTime.now()
      .toInstant(ZoneOffset.ofTotalSeconds(0))
      .toEpochMilli();

    LocalDateTime date = LocalDateTime
        .ofInstant(Instant.ofEpochMilli(longValue), ZoneId.systemDefault());
    ```

### Conver between formatted String and Date Time

Two main ways:

`java.text.SimpleDateFormat` is since Java 1.1
`java.time.format.DateTimeFormatter` is since Java 1.8
Both of them throw `DateTimeParseException`, which extends `RuntimeException`

1. Old way, use SimpleDateFormat

    ```java
    SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy hh:mm:ss");

    // String to Date
    String dateString = "2019-05-23 00:00:00.0";
    Date date = sdf.parse(dateString);

    // Date to String
    Date today = new Date();
    String date = sdf.format(today);
    ```

2. Java 8, DateTimeFormatter

    ```java
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm:ss");

    // String to Date
    String dateString = "2046-03-21 00:00:00.0";
    LocalDateTime localDateTime = LocalDateTime.parse(dateString, formatter);

    // Date to String
    LocalDateTime localDateTimeNow = LocalDateTime.now();
    String dateTimeNow = formatter.format(localDateTimeNow);
    ```

### Get date time fields value

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

## How to persist Date Time

> Instead of saving the time in UTC along with the time zone, developers can save what the user expects us to save: the wall time. Ie. what the clock on the wall will say. In the example that would be 10:00. And we also save the timezone (Santiago/Chile). This way we can convert back to UTC or any other timezone.

see <https://stackoverflow.com/questions/2532729/daylight-saving-time-and-time-zone-best-practices>

### Persist Java 8 Date Time in Postgres

The PostgreSQL™ JDBC driver implements native support for the Java 8 Date and Time API (JSR-310) using JDBC 4.2.
ZonedDateTime, Instant and OffsetTime / TIME [ WITHOUT TIMEZONE ] are not supported.
Also note that all OffsetDateTime will instances will have be in UTC (have offset 0). This is because the backend stores them as UTC.

## References

- [Modern Java in Action](https://www.manning.com/books/modern-java-in-action)
- [Introduction to the Java 8 Date/Time API](https://www.baeldung.com/java-8-date-time-intro)
- [the-evolution-of-the-java-date-time-api](https://medium.com/javarevisited/the-evolution-of-the-java-date-time-api-bfdc61375ddb)
