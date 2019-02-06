---
title: Return Early and Give up Single Exit Point
search: true
tags: 
  - 
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

return early and give up single exit point

## TL;DR

I'd like to return early and give up single exit point in my code.

## Demo goes first
```java
public bool singleExitPoint(bool someCondition)
{
    if (someCondition)
    {
        // Do Something
    } else {
        // Do Something
    }
    
    return false;
}


public void returnEarly(bool someCondition)
{
    if (!someCondition)
        return false

    // Do Something
    
    return true;
}
```

## My reasons

I do respect the "single exit point rule", especially when debugging because you don't know when and where the code breaks if there are so many exits.

However, it's also a pain, especially when:
1. handling exceptions
2. handling special conditions
3. one exit force you indent code blocks

### Conclusion

In the beginning, I don't think this topic could bother me. However, in the code review, the peer told me not to break this rule. If it's written in the team's code standard, I definitely will follow. However, if not, I don't think it's necessary.



## References

[Why should a function have only one exit-point](https://stackoverflow.com/questions/4838828/why-should-a-function-have-only-one-exit-point)