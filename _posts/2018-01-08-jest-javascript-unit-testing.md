---
title: Jest, Javascript unit testing
search: true
tags: 
  - Unit Testing
  - Javascript
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: single
---
Unit Testing in JavaScript

## Overview
> Use Jest for unit and integration tests and TestCafe for UI tests.

- **[Jest](https://facebook.github.io/jest/)** is a testing framework by **Facebook**.
- Set up is easy
- Jest finds your tests automatically
- Jest runs in parallel
- Jest looks simple, like plain English
- Jest can be debugged just like any other Node.JS module
- Jest is watching


## Set up 

- `npm init -y`

- `npm i -D jest`  
  `-d` will save it as dependency
- in **package.json**, scripts, add `"test":"jest"`
- `"testwatch":"jest --watchAll"`, `npm run testwatch`

## Write a simple unit test

1. Add a file _function.js_ with following:  
    ```javascript
    const functions = {
      add: (num1, num2)=> num1+num2
    };    
    
    module.exports = functions;
    ```
2. Add a test file: _functions.test.js_  
    ```javascript  
    const functions = require('./functions');
    
    test('Adds 2 + 2 to equal 4', () => {
      expect(functions.add(2,3)).toBe(4); // will fail
    });
    ```

3. run test: `npm test` will trigger jest

## Write other unit tests

### Not

1. Declare it in test name
2. use `not.toBe()`  
_functions.test.js_    
    ```javascript
      const functions = require('./functions');
      
      test('Adds 2 + 2 to NOT equal 5', () => {
        expect(functions.add(2,2)).not.toBe(5);
      });
    ```

### Asset null

```javascript
const functions = {
  add: (num1, num2)=> num1+num2,
  isNull:()=> null
};    

module.exports = functions;
```
```javascript
const functions = require('./functions');

test('Should be null', () => {
  expect(functions.isNull()).toBeNull();
});
```

### Check value

- `toBeFalsy()` equals to `not.toBeTruesy()`
- `toBeTruesy`

```javascript
const functions = {
  add: (num1, num2)=> num1+num2,
  isNull:()=> null,
  checkValue:(x)=>x
};    

module.exports = functions;
```
```javascript
const functions = require('./functions');

test('Should be falsy', () => {
  expect(functions.checkValue(null)).toBeFalsy(); // will pass
});

test('Should be falsy', () => {
  expect(functions.checkValue(0)).toBeFalsy(); // will pass
});

test('Should be falsy', () => {
  expect(functions.checkValue(undefined)).toBeFalsy(); // will pass
});

test('Should be falsy', () => {
  expect(functions.checkValue(2)).toBeFalsy(); // will fail
});
```

### Objects

- `toBe()` is for primitive type
- should use `toEqual()` for object

```javascript
const functions = {
  add: (num1, num2)=> num1+num2,
  isNull:()=> null,
  checkValue:(x)=>x,
  createUser:() => {
    const user = {firstName: 'Moss';
    user['lastName'] = 'Gu';
    return user;
  }
};    

module.exports = functions;
```

```javascript
test('User should be Moss Gu object', () => {

  expect(functions.createUser(undefined))
    .toEqual({firstName:'Moss',lastname:'Gu'}); // will do
    
  expect(functions.createUser(undefined))
    .toBe({firstName:'Moss',lastname:'Gu'}); // will pass
});
```

### Less than and greater than

- `toBeLessThan()`
- `toBeLessThanOrEqual()`

```javascript
test('Should be under 1600', ()=> {
  const load1 = 800;
  const load2 = 700;
  expect(load1 + load2).toBeLessThan(1600); // will pass
});

test('Should be under 1600', ()=> {
  const load1 = 800;
  const load2 = 800;
  expect(load1 + load2).toBeLessThan(1600); // will fail

  expect(load1 + load2).toBeLessThanOrEqual(1600); // will pass
});
```

### Regex
- `toMatch()`
```javascript
test('There is no I in team', ()=> {
  expect('team').not.toMatch(/I/); // will pass
});
```

### Array
- `toContain()`
- `toMatch()`
```javascript
test('Admin should be in username', ()=> {
  usernames = ['moss','feifei','haha'];
  expect(users).toContain('admin'); //will fail
  expect(users).toContain('haha'); //will pass
});
```

### Async, Promise

- Install  axios: `npm i axios`
- For demo purpose, we use [JSONP_PLACEHOLDER](https://jsonplaceholder.typicode.com/)

```javascript
const axios = require('axios');

const functions = {
  fetchUser: () => axios.get('https://jsonplaceholder.typicode.com/users/1')
    .then(res => res.data)
    .catch(err => 'error)
};    

module.exports = functions;
```

```javascript
test('User fetched name should be Leanne Graham', () => {

  expect.assetions(1); 
  return functions.fetchUser()
    .then(data => {
      expect(data.name).toEqual('Leanne Graham);
    });
});
```

### Async, Await

```javascript
test('User fetched name should be Leanne Graham', () => {

  expect.assetions(1); 
  const data =  functions.fetchUser();
  expect(data.name).toEqual('Leanne Graham);
});
```

### Function

- `toBeDefined()`
- `toEqual()`

_reversestring.js_
```javascript
const reverseString = str => 
  str
    .toUpperCase()
    .split('')
    .reverse()
    .join('');
    
module.exports = reverseString;
```

_reversestring.test.js_
```javascript
const reverseString = require('/reversestring');

test('reverseString function exists', () => {
  expect(reverseString).toBeDefined();
});

test('String reverses', () => {
  expect(reverseString('hello')).toEqual('Olleh');
});

test('String reverse with UPPERCASE', () => {
  expect(reverseString('Hello')).toEqual('olleh');
});
```

### Chunks

_chunk.js_
```javascript
const chunkArray = (arr, len) => {

  //int chunked arr
  const chunkedArr = [];
  
  //loop through arr
  arr.forEach(val => {
  
    //get last element
    const last = chunkedArr[chunkedArr.length - 1];
    
    //check if last and if last length is equal to the chunk len
    if(!last || last.length === len){
      chunkArr.push([val]);
    } else {
      last.push(value);
    }
  });
return chunkArr;
}

module.exports = chunkArray;
```

_chunk.test.js_
```javascript
const chunkArray = require('./chunk);

test('chunkArray function exists', () => {
  expect(chunkArray).toBeDefined();
});

test('Chunk an array of 10 values with length of 2', () => {
  const numbers = [1,2,3,4,5,6,7,8,9,10];
  const len = 2;
  const chunkedArr = chunkArray(numbers, len);
  
  expect(chunkedArr).toEqual([1,2],[3,4],[5,6],[7,8],[9,10]); //shall pass
});
```

## Lifecycle thingees

1. run fucntions before and after each test  
    ```javascript
    const initDB = () => console.log('db initialized');
    const closeDB = () => console.log('db closed');
    
    beforeEach(() => initDB());
    afterEach(() => close());
    ````

2. run fucntions before all and after all tests  
    ```javascript
    const initDB = () => console.log('db initialized');
    const closeDB = () => console.log('db closed');
    
    beforeAll(() => initDB());
    afterAll(() => close());
    ```

3. Run beforeEach inside of a functon    
    ```javascript
    const nameCheck = () => console.log('checking names...');
    
    describ('Checking names', () => {
      beforeEach(() => nameCheck());
      
      test('user is jeff', () => {
        const user = 'jeff';
        expect(user).toBe('Jeff');
      });
      
      test('user is moss', () => {
        const user = 'moss';
        expect(user).toBe('moss');
      });
    });
    ```
    
## Notes
This blog is my note from: [Jest Crash Course - Unit Testing in JavaScript](https://www.youtube.com/watch?v=7r4xVDI2vho){:target="_blank"}.

## References
- [An Overview of JavaScript Testing in 2018](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2018-f68950900bc3)
- [Facebook Jest, the JS testing tool for people who hate writing tests](https://blog.cloudboost.io/first-run-facebook-jest-the-js-testing-tool-for-people-who-hate-writing-tests-30b5bc4b9dd2)