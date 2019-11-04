---
title: Flex Box Basic
search: true
tags: 
  - CSS
  - Flex
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

Get out of nightmare that positioning elements with CSS.

## What is Flexbox Layout

// todo


## Terminology

The box, we call it **flex container**. All children are **flex items**.

X-axis of the container called **main axis**, Y-axis is named **cross axis**. 

Start of main axis is **main start**, end of the main axis is **main end**.


## Attributes for container:

- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

1. The direction of rows is controlled by **flex-direction**
2. Keep the row won't break, using `flex-wrap: nowrap;`
3. `flex-flow` is a shorthand of **flex-direction** and **flex-wrap**.

    ```html
    flex-flow: <‘flex-direction’> || <‘flex-wrap’>
    ```

4. `justify-content` defines the alignment along the main axis
5. `align-items` is for cross-axis alignment
6. Similar to how `justify-content` aligns individual items within the main-axis, `align-content` aligns space in the cross-axis


## Attributes for items

- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self

1. `order` with a smaller number would be in the front. By default is 0, however, -1 is ahead of 0
2. `flex-grow` enables the item to grow
3. `flex-shrink` enables the item to shink
4. `flex-basis` defines the **default size** of an element before the remaining space is distributed
5. `flex` is the shorthand for `flex-grow`, `flex-shrink` and `flex-basis` combined. Default is `0 1 auto`
6. `align-self` allows the default alignment to be overridden for individual flex items


## Conclusion

> Flexbox layout is most appropriate to the components of an application, and small-scale layouts, while the Grid layout is intended for larger scale layouts.

As per 
https://css-tricks.com/snippets/css/a-guide-to-flexbox/


## References

[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)