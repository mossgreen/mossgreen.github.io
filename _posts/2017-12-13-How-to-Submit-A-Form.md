---
title: How to Submit a Form
search: true
tags: 
  - HTML
  - FORM
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

 Submits user's data and sends data to a server.


 //todo new structure

 /*
 
 1. What is a form

 2. form elements and possible options
    - autocomplete
 3. Input   
 3. A traditional form
 4. Submit out of the <form>
 5. How does it work for get and post
 6. safty
    - how it encrypt data
    - other safty issues
 */

## 0. Quick form demo

In this demo, the form will send 2 pieces of data named `user_name` and `user_email`. Data will be sent to the URL `/my-handling-form-page` using the `HTTP POST` method.

```html
<form action="/my-handling-form-page" method="post">
    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="user_name">
    </div>
    <div>
        <label for="mail">E-mail:</label>
        <input type="email" id="mail" name="user_mail">
    </div>
    <div>
      <button type="submit">Send your message</button>
    </div>
</form>
```

Users interact application using forms, user can enter data and submit to server.


## 1. Elements in a HTML form

### 1.1 `<form>`
- `action` 
  - is the ocation that the data should be sent to
  - Must be a valid URL. Can be absolute or relative URL
  - If not provided, the data will be sent to the URL of the page containing the form
  - `<form action="#">`: before `HTML5`, `action` is required. It indicates data send to current page

- `method`
    - `method="GET"`
        - `method` by default is "GET"
        - Data is appended to the URL 
        - Url is like: `www.foo.com/?user_name=moss&user_mail=haha@haha.com`
        - `enctype` attribute will be ignored
  
    - `method="POST"`
        - Data provided in the body of the HTTP request 
        - No data appened to URL
        - `enctype` attribute by default is `application/x-www-form-urlencoded`
  
    ```yaml
    POST / HTTP/1.1
    Host: foo.com
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 38
    
    user_name=moss&user_mail=haha@haha.com
    ```    

### 1.2 `<label>`  Attributee

```html
<!-- probably a better one -->
<div>
  <label for="user_name">Name: <abbr title="required">*</abbr></label>
  <input id="user_name" type="text" name="username">
</div>
```
When user click on the label, the input with `id="user_name"` shall be activated.
It is especially useful for radio buttons and checkboxes.

### 1.3 `<input>`Attribute

  - ~~datetime: `HTML5` will be removed, don't use~~
  - `button`: A push button with no default behavior
  - `date`: `HTML5` year, month, and day, with no time
  - `email`: `HTML5` A field for editing an e-mail address.
  - `hidden`: not displayed, but value is submitted to the server
  - `password`: Use the `maxlength` and `minlength` attributes to specify
  - `range`: `HTML5` number range
  - `autocomplete`: 
      - lets web developers specify what if any permission the user agent has to provide automated assistance in filling out form field values, 
      - guidance to the browser as to the type of information expected in the field.
      - available on <input> elements that take a text or numeric value as input, <textarea> elements, <select> elements, and <form> elements.
      - "off": The browser is not permitted to automatically enter or select a value for this field.
      - "on": The browser is allowed to automatically complete the input. No guidance is provided.
      - "new-password": prevent autofilling of password fields

### 1.4 `<button>`

- `type="submit"`: A click will submit data
- `type="reset"` : A click will reset data in form
- `type="button"` : A click does nothing! It's useful when customizing buttons with JavaScript

`<button>` VS `<input>`
- `type` attribute specifies what kind of button is displayed
- `<input type="submit" />` produces a button, however it only allows plain text as its label

```html
<!-- full html support-->
<button type="submit">
    This a <br><strong>submit button</strong>
</button>

<!-- only allows plain text -->
<input type="submit" value="This is a submit button">
```

## 2. Submit a form

### AJAX

```html
<button type="button" onclick="sendData({test:'ok'})">Click Me!</button>
```

```javascript
function sendData(data) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];
  var name;

  // Turn the data object into an array of URL-encoded key/value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // Combine the pairs into a single string and replace all %-encoded spaces to 
  // the '+' character; matches the behaviour of browser form submissions.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // Define what happens on successful data submission
  XHR.addEventListener('load', function(event) {
    alert('Yeah! Data sent and response loaded.');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
  });

  // Set up our request
  XHR.open('POST', 'https://example.com/cors.php');

  // Add the required HTTP header for form data POST requests
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Finally, send our data.
  XHR.send(urlEncodedData);
}
```

### form not submitting in Microsoft Edge

In HTML5, a `<button>` has a form attribute. 
```html
<form id="form1" method="get" action="/">
     <input type="text" name="firstname" />
</form>
 
<button type="submit" form="form1" value="Submit">Submit</button>
```
However, **it doesn't work on IE and Edge**. Since submit button is a type of control, the submit must appear inside a `<form>`.

You can use JavaScript onclick event.
```html
<form id="form1">
	<input type="text" name="firstname" />
</form>
 
<button id="submit-button">Submit</button>
 
<script type="text/javascript">
	document.getElementById("submit-button").onclick = function() {
		document.getElementById("form1").submit();
	}
</script>
```


## FormData Object

`FormData` sends a set of key/value pairs using `XMLHttpRequest`

```javascript
var formElement = document.querySelector("form");
var formData = new FormData(formElement);
var request = new XMLHttpRequest();
request.open("POST", "submitform.php");
formData.append("serialnumber", serialNumber++);
request.send(formData);
```


## Form Validation 

When user enter data, form checks if it's correct. It won't allow invalid data to be submited, using `HTML5` validation, Javascript and 3rd party library.

### `<input>` HTML5 Valid

A quick demo with email validation.
Show red dashed border when input is invalid. 

```html
<form>
  <label for="user_mail">What is your name?</label>
  <input id="user_mail" type="email" name="user_name" required>
  <button type="submit">Submit</button>
</form>
```

```css
input:invalid { border: 2px dashed red; }

input:valid { border: 2px solid black; }
```

### `<input>` Regex Valid

`<input>` has a `pattern` attribute, using regex to match text strings.

In this demo, it only accepts "man" or "woman".

```html
<form>
  <label for="gender">What is your phycical gender?</label>
  <input id="gender" name="gender" required pattern="man|woman">
  <button>Submit</button>
</form>
```

### Javascript Validation

- Use `novalidate` to provent the default form validation and let your JS validation take control

```html
<form novalidate>
  <label for="mail">
    <span>Please enter an email address:</span>
    <input type="email" id="mail" name="mail">
    <span class="error" aria-live="polite"></span>
  </label>
  <button>Submit</button>
</form>
```

```javascript
// There are many ways to pick a DOM node; here we get the form itself and the email
// input box, as well as the span element into which we will place the error message.

var form  = document.getElementsByTagName('form')[0];
var email = document.getElementById('mail');
var error = document.querySelector('.error');

email.addEventListener("input", function (event) {
  // Each time the user types something, we check if the
  // email field is valid.
  if (email.validity.valid) {
    // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    error.innerHTML = ""; // Reset the content of the message
    error.className = "error"; // Reset the visual state of the message
  }
}, false);
form.addEventListener("submit", function (event) {
  // Each time the user tries to send the data, we check
  // if the email field is valid.
  if (!email.validity.valid) {
    
    // If the field is not valid, we display a custom
    // error message.
    error.innerHTML = "I expect an e-mail, darling!";
    error.className = "error active";
    // And we prevent the form from being sent by canceling the event
    event.preventDefault();
  }
}, false);
```

### 3rd party library validation

- [Validate.js](http://rickharrison.github.io/validate.js/)
- [jQuery plug-in](https://jqueryvalidation.org/)

Find more: [MDN Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)


## References
- [MDN HTML forms](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms)
- [How do I make submit button without form?](https://www.quora.com/How-do-I-make-submit-button-without-form)
- [Sensible Forms: A Form Usability Checklist](http://alistapart.com/article/sensibleforms)
- [How to turn off form autocompletion](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#The_autocomplete_attribute_and_login_fields)