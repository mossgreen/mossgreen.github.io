---
title: Thinking in jQuery
tags: 
  - jQuery
  - Web Development
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---

jQuery, live long and prosper!

## 1. How to select DOM elements

the basic design concept of JQ is that it selects an element from DOM and manipulate it directly.

the select expression can be CSS selectors

```javascript
$(document) // to select whole document object
$('#myId') // to select the element whose ID is myId
$('div.myClass') // to select the element whose class is myclass
$('input[name=first]') // the input element whose name attribute is 'first'
```

the select expression can also be JQ expression

```javascript
$('a:first')        // to select the first element in the page
$('tr:odd')         // to select odd rows
$('#myform :input') // to select input element in the form
$('div:visible')    // to select visible elements
$('div:gt(2)')      //to select all div elements except the first three (index starts from 0)
$('div:animated')   // to select those elements that is currently animating
```

## 2. Manipulate the result sets

jQ provides various of filter so that you can filter the result set to get your data.

```javascript
$('div').has('p');          // select div elements have p
$('div').not('.myClass');   // select classes the don't have myClass
$('div').filter('.myClass'); //select class = myClass
$('div').fist();            //fist div
$('div').eq(5);             //select 6th div element
```

Sometimes, we need to start from the result set and move to our target data. jQ also provides methods to move on the DOM tree.

```javascript
$('div').next('p');     //select first p after div
$('div').parent();      //select div's parent element
$('div').closet('form');//select the form parent element nearest div
$('div').children();    //select all child elements of div
$('div').siblings();    //select all div elements with same level
```

## 3. Chainning

After selecting your target element from DOM, you can also manipulate it. Like `$('div').find('h3').eq(2).html('hello');`, to be specific:

```javascript
$('div')        //find div elements
    .find('h3') //select the h3 elements
    .eq(2)      //the 3rd h3 element
    .html('hello'); //change its content to hello
```

Note that, each jQuery returns a jQuery object so that we can do the chainning.

In jQuery, there is a `.end()` method. It basically goes back to the parent set.

```javascript
$('div')
    .find('h3')
        .eq(2)
        .html('hello')
        .end() //go back one step, to -> .find('h3')
        .eq(0) //select first h2
        .html('world');
```

## 4. DOM manipulating: get and set values

Parameters will decide whether it is to set or get value.

```javascript
$('h1').html();         //no parameters, it will get value of h1
$('h1').html('Hello');  //It will set value "Hello" to h1
```

```javascript
.html()     //set or get html values
.text()     //set or get text contents
.attr()     //set or get an attribute's value
.width()    //set or get width of an element
.height()   //set or get height of an element
.val()      //get, only get, the value of an element from a form
```

** if there are multipul elements in the result set, setting values will set to everty element.
** However, we only the first element's value. Exception is `.text()` it gets all elements text content

## 5. DOM manipulating: position

Two ways to update element's position, first is to move this element directly and second is to move other elements.
If we want to move a div, make it in the end of p element:

```javascript
//first way, just move div after p. Returns div element
$('div').insertAfter($('p'));

//second way, move p in front of div. Returns p element
$('p').after($('div'));
```

```javascript
.insertAfter()  vs. .after()
.insertBefore() vs. .before()
.appendTo()     vs. .append()
.prependTo()    vs. .prepend()
```

## 6. DOM manipulating: copy and create  elements

- Clone element: `.clone`
- Delete element:
    `.remove()` will delete element  
    `.detach()` will retain element, can insert to other places
- Empty element: `.empty()`
- Create element

  ```javascript
  $('<p>Hello</p>');
  $('<li class="new">new list item</li>');
  $('ul').append('<li>list item</li>');
  ```

## 7. Tools //todo

## 8. Event //todo

## 9. Special effect //todo
