---
title: Using Java Optional
search: true
tags: 
  - JAVA
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Less NPE

## TL;DR

1. Optional should be used mostly as the return type
2. Optional should not be used in method arguments
3. Prefer `orElseGet` than `orElse`

## What is an Optional

Optional is a simple container for a value which may be null or non-null. Think of a method which may return a non-null result but sometimes return nothing. Instead of returning null you return an Optional in Java 8.

The Optional class **forces you to think** about the case when the value is not present. As a consequence, you can prevent unintended null pointer exceptions.

Its purpose is to **help design more-comprehensible APIs** so that by just reading the signature of a method, you can tell whether you can expect an optional value. This forces you to actively unwrap an Optional to deal with the absence of a value.

```java

optional.of(null);              // NullPointerExceptions

Optional<String> optional = Optional.of("bam");

optional.isPresent();           // true
optional.get();                 // "bam"
optional.orElse("fallback");    // "bam"

optional.ifPresent((s) -> System.out.println(s.charAt(0)));     // "b"
```

### Optional should be used mostly as the return type

without optional

```
if (user != null) {
    Address address = user.getAddress();
    if (address != null) {
        Country country = address.getCountry();
        if (country != null) {
            String isocode = country.getIsocode();
            if (isocode != null) {
                isocode = isocode.toUpperCase();
            }
        }
    }
}
```

With optional

```java
public class User {
    private Address address;

    public Optional<Address> getAddress() {
        return Optional.ofNullable(address);
    }
}

public class Address {
    private Country country;
    
    public Optional<Country> getCountry() {
        return Optional.ofNullable(country);
    }
}
```

```java
String result = Optional.ofNullable(user)
  .flatMap(User::getAddress)
  .flatMap(Address::getCountry)
  .map(Country::getIsocode)
  .orElse("default");
```

## Optional should not be used in method arguments

Optional is a reference type and it can be null.
If a method takes in an Optional, the first thing you need to do is to check if it's null.
So, what's the pointer of using Optional here? 

Another thing I want to address is that, you should not convert everything that passed into the method as an Nullable Optional, then handle `orElse` scenario.

Pointless.

## Prefer `orElseGet` than `orElse`

```java
User user2 = Optional.ofNullable(user).orElse(() -> createNewUser());

User user2 = Optional.ofNullable(user).orElseGet(() -> createNewUser());
```

- if the optional object **is empty**, `orElse()` and `orElseGet()` don't have any difference
- if the optional object **is not empty**, `orElseGet()` has better performance, because the substitue object won't be initiated


## References

- [Tired of Null Pointer Exceptions? Consider Using Java SE 8's Optional!](http://www.oracle.com/technetwork/articles/java/java8-optional-2175753.html)

- [Understanding, Accepting and Leveraging Optional in Java](https://stackify.com/optional-java/)

- [Java 8 Optional: How to Use it](https://dzone.com/articles/java-8-optional-how-use-it)
- [26 Reasons Why Using Optional Correctly Is Not Optional](https://dzone.com/articles/using-optional-correctly-is-not-optional)