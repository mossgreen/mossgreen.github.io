---
title: Convert unit between metric and imperial in Java
tags:
  - 
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Unit convertion, e.g., Metric to imperial

## JSRs

JSRs (Java Specification Requests)

1. JSR-275 Units Specification
2. JSR-363 Units of Measurement API 1.0
3. JSR-385 Units of Measurement API 2.0 (CURRENT)

## Maven packages

```xml
<dependency>
    <groupId>tech.units</groupId>
    <artifactId>indriya</artifactId>
    <version>2.1.2</version>
</dependency>
```

## Quantities

- What is Quantities
- Initialise it
- From Kilogram to gram
- From Metric to imperial
- CLDR: The Unicode CLDR provides key building blocks for software to support the world's languages, with the largest and most extensive standard repository of locale data available. see: <http://cldr.unicode.org/index>

```java
Quantity<Mass> kilogram = Quantities.getQuantity(1, Units.KILOGRAM);
Quantity<Mass> gram = Quantities.getQuantity(1, CLDR.GRAM);
Quantity<Mass> pound = Quantities.getQuantity(1, USCustomary.POUND);
Quantity<Mass> ounce = Quantities.getQuantity(1, CLDR.OUNCE);
Quantity<Mass> weight5 = Quantities.getQuantity(1, CLDR.OUNCE_TROY);

Quantity<Mass> kilogramToGram = kilogram.to(Units.GRAM);
Quantity<Mass> kilogramToPound = kilogram.to(USCustomary.POUND);

Quantity<Length> centimetre = Quantities.getQuantity(214, MetricPrefix.CENTI(METRE));
```

## References

- [Unicode CLDR Project](http://cldr.unicode.org/index)
- [Rapid table convertion](https://www.rapidtables.com/convert/temperature/fahrenheit-to-celsius.html)
- [Migrating from JScience quantities to Unit API 2.0](https://schneide.blog/tag/unit-api-2-0/)
