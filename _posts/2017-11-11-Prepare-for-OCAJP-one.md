---
title: Prepare for OCAJP, (1)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Java Building Blocks.

## Java Class Structure

1. Two primary members: methods (functions), and fields (variables).
  - Variables hold the state of the program 
  - Methods operate on that state

2. Classes vs. Files
  - To compile Java code, the file must have the extension `.java`. 
  - The name of the file must match the name of the class.
  - To compile and execute
```bash
$ javac Zoo.java 
$ java Zoo
```

3. Comments
  - single-line comment
  - multiple line comment
  - javadoc comment

```java
// comment until end of line

/* Multiple
* line comment 
*/
* 
/** 
* Javadoc multiple-line comment 
* @author Moss GU
*/
```



## Package vs. Imports

1. `java.lang` is special. It is automatically imported

2. `.*` whildcards doesn’t import child packages, fields, or methods; it imports only classes

3. If you really need to use two classes with same name

```java
import java.util.Date;
public class Conflicts {
  Date date; 
  java.sql.Date sqlDate;
}

//OR

public class Conflicts {
  java.util.Date date; 
  java.sql.Date sqlDate;
}
```

**Code Formatting on the Exam**:
It will often omit the imports to save space. You’ll see examples with line numbers that don’t begin with 1 in this case.
{: .notice--warning}

## Creating Objects

1. Order of Initialization
  - Fields and instance initializer blocks are run in the order in which they appear in the file
  - The constructor runs after all fields and instance initializer blocks have run

2. References and Primitives
  - Java has eight built-in data types, referred to as the Java primitive types
  - A `byte` can hold a value from –128 to 127.
  - A feature added in Java 7. You can have underscores in numbers to make them easier to read.

**NOTE**: The exam assumes you are well versed in the eight primitive data types, their relative sizes, and what can be stored in them
{: .notice--warning}

//TODO: TABLE here

```java
double notAtStart = _1000.00; // DOES NOT COMPILE, cannot be at beginning
double notAtEnd = 1000.00_; // DOES NOT COMPILE, cannot be at end
double notByDecimal = 1000_.00; // DOES NOT COMPILE, cannot be in front of `.`
double annoyingButLegal = 1_00_0.0_0; //GOOD
```

## Primitives vs. Reference

- Reference types can be assigned null; Primitive types will give you a compiler error if you attempt to assign them null
- Reference types can be used to call methods when they do not point to null. Primitives do not have methods declared on them

```java
String reference = "hello"; 
int len = reference.length(); 
int bad = len.length(); // DOES NOT COMPILE
```

## Declaring and Initializing Variables

You can declare many variables in the same declaration as long as they are all of the same type

```java
String s3 = "yes", s4 = "no";
int num, String value; // DOES NOT COMPILE, difference type
double d1, double d2; //DOES NOT COMPILE, duplicated
```

## Identifiers
Three rules
- The name must begin with a letter or the symbol `$` or `_`
- Subsequent characters may also be numbers
- You cannot use the same name as a **Java reserved word**

```java
okidentifier //GOOD
$OK2Identifier //GOOD 
_alsoOK1d3ntifi3r //GOOD
__SStillOkbutKnotsonice$ //GOOD

3DPointClass // identifiers cannot begin with a number 
hollywood@vine // @ is not a letter, digit, $ or _ 
*$coffee // * is not a letter, digit, $ or _
```

## Initialization of Variables

- A local variable is a variable defined within a method
- Local variables must be initialized before use


## Garbage Collection

- `finalize()`, it might not get called and that it defi nitely won’t be called twice.