---
title: Java Long Value Cacheing
search: true
tags: 
  - Java
toc: false
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

The cache size may be controlled by `-XX:AutoBoxCacheMax=<size>` option.

1. `==` compares references, `equals` compares value. Comparing Long values should use latter.

2. Another way is to use `longA.compareTo(longB) == 0`

3. LongCache[-128,127], which means Long value between -128 to 127 would return same object, because it run `Long.valueOf(String)` internally.

  ```java
  public static Long  valueOf(long l) {
      final int offset = 128;
      if (l >= -128 && l <= 127) { // will cache
          return LongCache.cache[(int)l + offset];
      }
      return new Long(l);
  }
  ```

4. Same reason, it has IntegerCache

  ```java
  public static Integer valueOf(int i) {
      if(i >= -128 && i <= IntegerCache.high)
          return IntegerCache.cache[i + 128];
      else
          return new Integer(i);
  }
  ```

Conclusion:  
use `.equals()` as much as possible for Objects comparing; leave `>=<` to primitive types.

## References

1. [what-are-not-2-long-variables-equal-with-operator-to-compare-in-java](https://stackoverflow.com/questions/19485818/what-are-not-2-long-variables-equal-with-operator-to-compare-in-java)

2. [Integer wrapper class and == operator - where is behavior specified?](https://stackoverflow.com/questions/5581913/integer-wrapper-class-and-operator-where-is-behavior-specified)

3. [Compare two long values](http://java2s.com/Tutorials/Java/Data_Types/How_to_compare_two_long_values.htm)

4. [Why Integer class caching values in the range -128 to 127?](https://stackoverflow.com/questions/20897020/why-integer-class-caching-values-in-the-range-128-to-127)