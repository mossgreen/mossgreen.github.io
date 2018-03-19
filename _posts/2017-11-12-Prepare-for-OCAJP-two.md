---
title: Prepare for OCAJP, (2)
search: true
tags: 
  - JAVA
  - OCAJP
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---
Java Operators and Statements.

## Unary Operators
`x++` vs. `++x`
  - `++x` will return `x+1`
  - `x++` will return x, than increment
```java
int counter = 0; 
System.out.println(counter); // Outputs 0 
System.out.println(++counter); // Outputs 1 
System.out.println(counter); // Outputs 1 
System.out.println(counter--); // Outputs 1 
System.out.println(counter); // Outputs 0
```

## Binary Operators

1. Numeric Promotion Rules
  - If two values have different data types, Java will promote one to the larger of the two data types
  - If one value is intergral and another is floating-point, intergral promoted to floating-point
  - byte, short,char will first pomoted to int. Even if neither of the operands is int
  - In the end, resulting value will have same data type as its promoted operands
```java
short x = 10; 
short y = 3; 
short z = x * y; // DOES NOT COMPILE, int*int cannot assign to short
short z = (short)(x * y);
```
2. Overflow vs. Underflow  
**Overﬂow** is when a number is so large that it will no longer ﬁt within the data type, so the system “wraps around” to the next lowest value and counts up from there
```
System.out.print(2147483647+1); // -2147483648
```

    Since 2147483647 is the maximum int value, adding any strictly positive value to it will cause it to wrap to the next negative number.
    {: .notice--warning}

3. Compound operators  
**Compound operators** can also save us from having to explicitly cast a value.
```java
long x = 10; 
int y = 5; 
y = y * x;// DOES NOT COMPILE, becasue data types
y *= x;
```

4. Logical Operators
  - AND is only true if both operands are true.
  - Inclusive OR is only false if both operands are false.
  - Exclusive OR is only true if the operands are different.

## Ternary Operators
As of Java 7, only one of the right-hand expressions of the ternary operator will be evaluated at runtime.

## SWITCH  
A **switch** statement has a target variable that is not evaluated until runtime

Note that **boolean** and **long**, and their associated wrapper classes, are not supported by switch statements.
{: .notice--danger}

The exam creators are fond of switch examples that are missing break statements!
{: .notice--warning}

```java
private int getSortOrder(String firstName, final String lastName) {

String middleName = "Patricia"; 
final String suffix = "JR"; 
int id = 0; 

switch(firstName) {
  case "Test":
    return 52;
  case middleName:// DOES NOT COMPILE, String is not final
    id = 5; 
    break; 
  case suffix:
    id = 0; 
    break; 
    
  /*despite lastName being final, 
  *it is not constant as it is passed to the function
  */  
  case lastName: // DOES NOT COMPILE
    id = 8; 
    break; 
  case 5: // DOES NOT COMPILE 
    id = 7; 
    break; 
  case 'J': // DOES NOT COMPILE 
    id = 10; 
    break; 
  case java.time.DayOfWeek.SUNDAY:// DOES NOT COMPILE
    id=15; 
    break;
  } 
  return id;
}
```

## FOR LOOP

1. Redeclaring Varialbes in Initialization Block
  ```java
  int x = 0; 
  for(long y = 0, x = 4; x < 5 && y < 10; x++, y++) { // DOES NOT COMPILE
    System.out.print(x + " "); 
  }
  ```
  
    Note: The difference is that x is repeated in the initialization block after already being declared before the loop, resulting in the compiler stopping because of a duplicate variable declaration
    {: .notice--warning}


2. Incompatible Data Types in Initialization Block
  ```java
  for(long y = 0, int x = 4; x < 5 && y<10; x++, y++) { // DOES NOT COMPILE
    System.out.print(x + " "); 
  }
  ```
  
    The variables in the initialization block must all be of the same type
    {: .notice--warning}
