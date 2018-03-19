---
title: Prepare for OCAJP, (3)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
String and some common APIs.  

## String
1. Immutability
  - String is immutable, which means **unchangeable**.
  - Immutable only has a getter. There's no way to change the value of s once it's set.
  - immutable classes in Java are ﬁnal, and subclasses can’t add mutable behavior.
  
2. String Pool
  - myObject.toString() is a string but not a literal, so it **does not** go into the string pool.
  - Strings not in the string pool are garbage collected just like any other object.
    ```java
    String name = "Fluffy";  //String pool
    String name = new String("Fluffy"); //NO, JVM
    ```
3. Important String Methods
  - `length()`returns the number of characters in the String.
  - `charAt()`lets you query the string to find out what character is at a s index.
  - `indexOf()` second argument is optional, it's _fromIndex_.
  - `substring()` optional second parameter, which is the end index
  - `toLowerCase(`) and `toUpperCase()`
  - `equals()` and `equalsIgnoreCase()`
  - `startsWith()` and `endsWith()`
  - `contains()` looks for matches in the String.
  - `trim()`removes whitespace, `\r` (carriage return),`\t` (tab) and `\n` (newline)
  
    ```java
    String string = "animals"; 
    System.out.println(string.length()); // 7
    System.out.println(string.charAt(0)); // a
    System.out.println(string.indexOf('a', 4)); //4
    System.out.println(string.indexOf("al", 5)); //-1
    System.out.println(string.substring(3)); // mals
    System.out.println(string.substring(3, 4)); // m
    System.out.println(string.substring(3, 3)); // empty string 
    System.out.println(string.substring(3, 2)); // throws exception
    System.out.println("abc".endsWith("c")); // true
    System.out.println("abc".contains("b")); // true
    System.out.println("\t a b c\n".trim()); // a b c
    ```
4. Equality
  - `equals` compares values
  - `==` compares references
  
## StringBuilder

1. `charAt()`, `indexOf()`, `length()`, and `substring()`
2. `append()` is by far the most frequently used method
3. `insert()` adds characters to the requested index
4. `delete()` and `deleteCharAt()`
5. reverse()
6. `toString`


## Equality
  - `equals` compares values
  - `==` compares references


## Array

The array does not allocate space for the String objects.  
Instead, it allocates space for a reference to where the objects are really stored.

1. Sorting
    ```java
    String[] strings = { "10", "9", "100" }; 
    Arrays.sort(strings);
    ```
2. Searching 

    **have to be a sorted array**
    {: .notice--warning}


## ArrayList

1. import package
  ```java
  import java.util.* ;// import whole package including ArrayList 
  import java.util.ArrayList; // import just ArrayList
  ```
2. `add()` insert a new value in the ArrayList.
  ```java
  boolean add(E element) 
  void add(int index, E element)
  ```
3. `remove` remove the fi rst matching value in the ArrayList or remove the element at a specified index.
  ```java
  boolean remove(Object object) 
  E remove(int index)
  ```
4. `set()` method changes one of the elements of the ArrayList **without changing the size**. Throws IndexOutOfBoundsException
    ```java
    E set(int index, E newElement)
    ```
5. `isEmpty()` and `size()`
6. `clear()`discard all elements of the ArrayList, make it **empty**
7. `contains()`
  ```java
  boolean contains(Object object)
  ```   
8. Wrapper Classes
  ```java
  int primitive = Integer.parseInt("123"); 
  Integer wrapper = Integer.valueOf("123");
  ```
9. Converting Between array and List
  ```java
  Object[] objectArray = list.toArray();
  List<String> list = Arrays.asList(array); // returns fixed size list
  ```
  
## Dates and Times

1. Import time classes

    ```java
    import java.time.*;
    ```
2. Creating Dates and Times
  - `LocalDate`, like your birthday this year
  - `LocalTime`, like, "midnight"
  - `LocalDateTime`, like "the stroke of midnight on New Year's"
  - `ZonedDateTime`, Oracle recommends avoiding time zones unless you really need them.
  
    ```java
    LocalDate date1 = LocalDate.of(2015, Month.JANUARY, 20);
    LocalTime time1 = LocalTime.of(6, 15);// hour and minute
    LocalDateTime dateTime1 = LocalDateTime.of(2015, Month.JANUARY, 20, 6, 15, 30);
    LocalDateTime dateTime2 = LocalDateTime.of(date1, time1);
    
    LocalDate.of(2015, Month.JANUARY, 32) // throws DateTimeException
    ```
3. Manipulating Dates and Times  
    
    **The date and time classes are immutable**, just like String was. This means that we need to remember to assign the results of these methods to a reference variable so they are not lost.
    {: .notice--warning}
  
    ```java
    LocalDate date = LocalDate.of(2020, Month.JANUARY, 20);
    LocalTime time = LocalTime.of(5, 15);
    LocalDateTime dateTime = LocalDateTime.of(date, time);
    
    dateTime = dateTime.minusDays(1);
    dateTime = dateTime.minusHours(10);
    dateTime = dateTime.minusSeconds(30);
    
    //chaining method
    LocalDateTime dateTime = LocalDateTime.of(date2, time) .minusDays(1).minusHours(10).minusSeconds(30);
    ```
  
    **tricky parts**
    ```java
    LocalDate date = LocalDate.of(2020, Month.JANUARY, 20); 
    date.plusDays(10);  //January 20, 2020. Adding 10 days was useless because we ignored the result.
    
    date = date.plusMinutes(1); // DOES NOT COMPILE. LocalDate does not contain time
    ```
4. Working with Periods
  - LocalDate has `toEpochDay()`, which is the number of days since January 1, 1970.
  - LocalDateTime has `toEpochTime()`, which is the number of seconds since January 1, 1970.
  - **LocalTime does not have an epoch method.**
  - Special January 1, 1970 refers to when it was January 1, 1970 in GMT (Greenwich Mean Time).
  - You shouldnot chain methods when creating a Period

    ```java
    Period annually = Period.ofYears(1);
    Period quarterly = Period.ofMonths(3);
    Period everyThreeWeeks = Period.ofWeeks(3);
    Period everyOtherDay = Period.ofDays(2);
    Period everyYearAndAWeek = Period.of(1, 0, 7);
    
    Period wrong = Period.ofYears(1).ofWeeks(1); // every week
    ```
  
5. Formatting Dates and Times
  - DateTimeFormatter is in the package java.time.format.
  - two predefi ned formats that can show up on the exam: **SHORT** and **MEDIUM**.
  
    ```java
    LocalDate date = LocalDate.of(2020, Month.JANUARY, 20); 
    LocalTime time = LocalTime.of(11, 12, 34); 
    LocalDateTime dateTime = LocalDateTime.of(date, time);
    
    System.out.println(date .format(DateTimeFormatter.ISO_LOCAL_DATE));// 2020-01-20
    System.out.println(time.format(DateTimeFormatter.ISO_LOCAL_TIME));//11:12:34
    System.out.println(dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));//2020-01-20T11:12:34
    
    DateTimeFormatter shortDateTime = DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT);
    System.out.println(shortDateTime.format(dateTime)); // 1/20/20
    System.out.println(shortDateTime.format(date)); // 1/20/20
    System.out.println(shortDateTime.format(time)); // UnsupportedTemporalTypeException, a time cannot be formatted as a date
    
    DateTimeFormatter mediumF = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM);
    System.out.println(mediumF.format(dateTime)); // Jan 20, 2020 11:12:34 AM
    
    DateTimeFormatter f = DateTimeFormatter.ofPattern("MMMM dd, yyyy, hh:mm"); System.out.println(dateTime.format(f)); // January 20, 2020, 11:12
    ```
  
6. Parsing Dates and Times

    convert a String to a date or time.
  
    ```java
    DateTimeFormatter f = DateTimeFormatter.ofPattern("MM dd yyyy"); 
    LocalDate date = LocalDate.parse("01 02 2015", f); // 2015-01-02
    LocalTime time = LocalTime.parse("11:22"); // 11:22
    ```