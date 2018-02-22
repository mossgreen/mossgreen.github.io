---
title: Thinking in jQuery
author: Moss GU
tags: 
  - jQuery
  - Web Development
toc: true
---

> Live long and prosper!

How to select DOM elements
---

the basic design concept of JQ is that it selects an element from DOM and manipulate it directly.

### 1. the select expression can be CSS selectors

```
$(document) // to select whole document object
$('#myId') // to select the element whose ID is myId
$('div.myClass') // to select the element whose class is myclass
$('input[name=first]') // the input element whose name attribute is 'first'
```

### 2. the select expression can also be JQ expression
	
```
$('a:first') // to select the first element in the page
$('tr:odd') // to select odd rows
$('#myform :input') // to select input element in the form
$('div:visible') // to select visible elements
$('div:gt(2)') //to select all div elements except the first three (index starts from 0)   
$('div:animated') // to select those elements that is currently animating
```

Manipulate the result sets
---

jQ provides various of filter so that you can filter the result set to get your data.

```
$('div').has('p'); // select div elements have p 
$('div').not('.myClass'); // select classes the don't have myClass
$('div').filter('.myClass'); //select class = myClass
$('div').fist(); //fist div
$('div').eq(5); //select 6th div element
```

Sometimes, we need to start from the result set and move to our target data. jQ also provides methods to move on the DOM tree.

```
$('div').next('p'); //select first p after div
$('div').parent(); //select div's parent element
$('div').closet('form');//select the form parent element nearest div
$('div').children(); //select all child elements of div
$('div').siblings(); //select all div elements with same level
```

Chainning 
---

After selecting your target element from DOM, you can also manipulate it. Like `$('div').find('h3').eq(2).html('hello');`, to be specific:

```
$('div') //find div elements
    .find('h3')//select the h3 elements
    .eq(2) //the 3rd h3 element
    .html('hello'); //change its content to hello
```

Note that, each jQuery returns a jQuery object so that we can do the chainning.

In jQuery, there is a `.end()` method. It basically goes back to the parent set.

```
$('div') 
    .find('h3')
        .eq(2) 
        .html('hello')
        .end() //go back one step, to -> .find('h3')
        .eq(0) //select first h2
        .html('world');
```

4. DOM manipulating: get and set values
5. DOM manipulating: movement
6. DOM manipulating: copy and create  elements
7. Tools
8. Event
9. Special effect

