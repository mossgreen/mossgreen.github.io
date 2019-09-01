---
title: Java Enum and How to Persist It
search: true
tags: 
  - Java
  - Enum
  - Spring Data JPA
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Should use enums any time you need to represent a fixed set of constants.

- A simple instruction to Java Enum
- How to use Enum
- Persist an Enum object

## What is an Enum

An enum type (or enumerated type) is a type whose fields consist of a fixed set of constants. Eg: Seasons of a year. In plain English, "to enumerate" means to count off or name one by one from a list.

1. We can add fields, constructors and methods to an enum.
2. Enum can also implement interfaces.
3. When anything else other than constants is there, comma-separated constants should be terminated with a semicolon. Otherwise, the semicolon is optional.
4. We can use `==` to compare enum constants effectively because constants are final and we cannot call an enum’s constructors to create more constants.
5. Enums supports switch statement.

**Example**
```java
public enum Season {
    SPRING,
    SUMMER,
    AUTUMN,
    WINTER; 
}
```

### Enum fields and methods

Enum constructor:
```java
protected Enum(String name, int ordinal)
```

Parameters:
1. `name`
    - The name of this enum constant, which is the identifier used to declare it. 
    - Should use toString to return a more user-friendly name.

2. `ordinal`: 
    - Its position in its enum declaration, starts from 0.
    - Should avoid to use it. 
    - It is designed for use by sophisticated enum-based data structures, such as `EnumSet` and `EnumMap`.

Overridden methods:

1. `clone ()` – Throws `CloneNotSupportedException`. This guarantees that enums are never cloned, which is necessary to preserve their "singleton" status.
2. `equals ()` – Returns true if the specified object is equal to this enum constant.
3. `finalize ()` – to ensure that constants cannot be finalized.
4. `hashCode ()` – because equals is overridden
5. `toString ()` – to return constant’s name.
6. `compareTo()` – Enum implements Comparable.

Important methods
1. `name()` – returns constant’s name. 

2. `ordinal()` – position of the constant within enum type. compareTo () compares ordinals.

3. ` The values()` static method of the enum returns an array of all constants that are declared in the enum. It's not part of Enum’s java documentation. It's added by the compiler.
    ```java
    for (Planet p : Planet.values()) {
        System.out.printf("Your weight on %s is %f%n", p, p.surfaceWeight(mass));
    }
    ```

4. `getDeclaringClass()` - Returns the Class object corresponding to this enum constant's enum type.
    - Two enum constants e1 and e2 are of the same enum type if and only if `e1.getDeclaringClass() == e2.getDeclaringClass()`
    - The value returned by this method may differ from the one returned by the Object.getClass() method for enum constants with constant-specific class bodies.

### JSON Representation of Enum

Enums are POJOs. They can be represented as a JSON.
//todo

### Benefits of using Enum:

1. More readable code. 
2. Enum is type-safe. You cannot assign anything else other than predefined Enum constants to an Enum variable
3. Set of Constant declaration.
4. Can be usable in switch-case.


## Implement Design Patterns using Enum
// todo
### ingleton Pattern
### Strategy Pattern

## Persisting Enums in JPA

1. persist the ordinal with `@Enumerated(EnumType.ORDINAL) `
2. persist the String with `@Enumerated(EnumType.STRING)`.
3.  JPA 2.1 `@Converter` Annotation
4.  Database specification for Enum data type // todo
    1. Postgres
    2. MySQL

### Ordinal

The Good
- `ORDINAL`  can use a SMALLINT which is the most compact db option.
- Rename filed without pressure.


The Bad
- New enum elements must be added to the end of the list. If we add a new value in the middle or rearrange the enum’s order, we’ll break the existing data model.
- Removing existing elements from ann Enum will require to shift all entries in case you are using `ORDINAL`.

The Others
- `@Enumerated` column does not need to take the `ORDINAL` EnumType value since that’s used by default. 

### String Value

1. A string is bigger than, like, int. So will use more space and hence slower.
2. Renaming an enum value will still break the database data.


### Using `@Converter`

```java
public enum Season {
    SPRING("1"),
    SUMMER("2"),
    AUTUMN("3"),
    WINTER("4");

    private String code;

    Season(String code) {
        this.code = code;
    }
}
```
```java
@Entity @Data
public class Flower {
    @Id private Long id;
    private Season season;
}
```
```java
@Converter(autoApply = true)
public class SeasonConverter implements AttributeConverter<Season, String> {
    @Override
    public String convertToDatabaseColumn(Season attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCode();
    }

    @Override
    public Season convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Stream.of(Season.values())
                .filter(s -> s.getCode().equalsIgnoreCase(dbData))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
```
```java
@Test
public void canSave() {

	Flower flower = new Flower();
	flower.setId(1L);
	flower.setSeason(Season.SPRING);

	final Flower save = flowerRepository.save(flower);

	Assert.assertTrue(save != null);
}
```


## References

- [Oracle doc: Class Enum](https://docs.oracle.com/javase/6/docs/api/java/lang/Enum.html)
- [oracle doc: Enum Types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
- [A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
- [Persisting Enums in JPA](https://www.baeldung.com/jpa-persisting-enums-in-jpa)
- [JPA and Enums via @Enumerated](https://tomee.apache.org/examples-trunk/jpa-enumerated/)
- [The best way to map an Enum Type with JPA and Hibernate](https://vladmihalcea.com/the-best-way-to-map-an-enum-type-with-jpa-and-hibernate/)
- [How to map a PostgreSQL Enum ARRAY to a JPA entity property using Hibernate](https://vladmihalcea.com/map-postgresql-enum-array-jpa-entity-property-hibernate/)
- [JPA enumerated types mapping. Best approach](https://stackoverflow.com/questions/16140282/jpa-enumerated-types-mapping-best-approach)