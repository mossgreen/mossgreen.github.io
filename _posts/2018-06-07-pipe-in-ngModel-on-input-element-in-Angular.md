---
title: Using Pipes Within ngModel on Input Elements in Angular
search: true
tags: 
  - Angular
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Got an error: Cannot have a pipe in an action expression.

## The issue

My model has a property "startDate", which stores Unix timestamp. When I display, I'd like to show only the full year, like 2018.
In Angular, we could achieve this easily using pipe. I did it this way:

```html
<input [(ngModel)]="model.startYear | date: 'yyyy'" >
```

However, I got an error: Cannot have a pipe in an action expression.

## The Reasons

1. In Angular, `[()]` is two-way binding. 
2. `[] ` is one-way attribute binding, which binds data from component to the view. The real-time date transform, which how **pipe** works, happens here.
3. `()` is one-way event binding, which passes data from view to component. **Pipe** function doesn't work here.
4. Therefore, I have to split `[()]` into `[]` and `()`, and only use **pipe** in `[]`. 

## A Stackoverflow solution:

```html
<input [ngModel]="item.value | somePipeMethod" (ngModelChange)="item.value=$event" />
```

This solution works well. But it has some drawbacks.

1. I don't like `(ngModelChange)`. Imagine a user type in "1234" in the input, four times the model got changed.
2. Like I said at the beginning, my model's property "startDate" is Unix timestamp, I need to transfer user input, which is a string, to Unix timestamp. The logic here is simple, however, I fell into a big trouble. Because of the `(ngModelChange)`, user's input converts to Unix timestamp into real time. If a user types in "201", model's startDate is a negative number due to the nature of Unix timestamp. In the input, it shows something like 021, which is a disaster. 


## My workaround

```html
<input value="{\\{node.startDate | date: 'yyyy' }\\}" 
      (blur)="saveProjectYear(node, startYear.value)" >
```


1. In order to show current format, we only use value attribute so that we could pipe it with the right format
2. Onblur, we save this object using a method. It's almost the same as the one 


## References

[Using Pipes within ngModel on INPUT Elements in Angular](https://stackoverflow.com/questions/39642882/using-pipes-within-ngmodel-on-input-elements-in-angular)