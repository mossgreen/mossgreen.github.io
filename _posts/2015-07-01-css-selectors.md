---
title: CSS Selectors
tags:
  - CSS
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

Select the element(s)

## CSS selectors

We can divide CSS selectors into five categories:

1. Simple selectors (select elements based on name, id, class)
2. Combinator selectors (select elements based on a specific relationship between them)
3. Pseudo-class selectors (select elements based on a certain state)
4. Pseudo-elements selectors (select and style a part of an element)
5. Attribute selectors (select elements based on an attribute or attribute value)

## Combinator selectors

- `.class`  select all elements with the class name
- `.class1.class2` Selects all elements with both class1 and class2
- `.class1 .class2` Selects all elements with class2 that is a descendant of an element with class1
- `p.intro` Selects all `<p>` elements with class="intro"
- `div, p` Selects all `<div>` elements and all `<p>` elements
- `div p` Selects all `<p>` elements inside `<div>` elements
- `div > p` Selects all `<p>` elements where the parent is a `<div>` element
- `div + p` Selects the first `<p>` element that is placed immediately after `<div>` elements

## Attribute Selectors

- [title~=flower] Selects all elements with a title attribute containing the word "flower"
- `a[href^="https"]` Selects every `<a>` element whose href attribute value begins with "https"
- `a[href$=".pdf"]` Selects every `<a>` element whose href attribute value ends with ".pdf"

## References

- [CSS Selectors](https://www.w3schools.com/css/css_selectors.asp)
- [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)
