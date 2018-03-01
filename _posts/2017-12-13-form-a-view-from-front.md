---
title: Form (1), a Simple View from Front
search: true
tags: 
  - HTML
  - FORM
toc: true
classes: wide
---

 Ask user for data and to send it to a web server.

### 1. Quick demo

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

In this demo, the form will send 2 pieces of data named `user_name` and `user_email`. Data will be sent to the URL `/my-handling-form-page` using the `HTTP POST` method.

### 2. Attributes for `<form>`

1. `action` 
  - is the ocation that the data should be sent to
  - Must be a valid URL. Can be absolute or relative URL
  - If not provided, the data will be sent to the URL of the page containing the form
  - `<form action="#">`: before `HTML5`, `action` is required. It indicates data send to current page

2. `method="GET"` 
    1. `method` by default is "GET"
    2. Data is appended to the URL 
    3. Url is like: `www.foo.com/?user_name=moss&user_mail=haha@haha.com`
  
3. `method="POST"` 
    1. Data provided in the body of the HTTP request 
    2. No data appened to URL, following the above demo, data should be like:
  
```yaml
POST / HTTP/1.1
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 38

user_name=moss&user_mail=haha@haha.com
```

### 3. Attributes for `<label>` 

```html
<!-- probably a better one -->
<div>
  <label for="username">Name: <abbr title="required">*</abbr></label>
  <input id="username" type="text" name="username">
</div>
```
When user click on the label, the input with `id="name"` shall be activated.

It is especially useful for radio buttons and checkboxes.

### 4. Attributes for `<input>`

- button: A push button with no default behavior
- date: `HTML5` year, month, and day, with no time
- email: `HTML5` A field for editing an e-mail address.
- hidden: not displayed, but value is submitted to the server
- password: Use the `maxlength` and `minlength` attributes to specify
- range: `HTML5` number range

**NOTE**
- datetime: `HTML5` will be removed, don't use

See more: [MDN Web Docs for Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

### 5. Attributes for `<button>`

- `type="submit"`: A click will submit data
- `type="reset"` : A click will reset data in form
- `type="button"` : A click does nothing! It's useful when customizing buttons with JavaScript

`<input type="submit" />` will also produce a button, however it only allows plain text as its label



### References
- [MDN HTML forms](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms)
- [Sensible Forms: A Form Usability Checklist](http://alistapart.com/article/sensibleforms)