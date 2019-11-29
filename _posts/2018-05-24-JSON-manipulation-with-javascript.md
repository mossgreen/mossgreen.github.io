---
title: JSON Manipulation with Javascript
search: true
tags: 
  - Javascript
  - JSON
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

> {"quote":"You miss 100% of the shots you don’t take.","author":"Wayne Gretzky"}

## Basic

JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on JavaScript object syntax. Extension is `.json`, and MIME type is `application/json`.

It's broadly used in data transaction between application and servers.

JS only has one data type which is **Object**.  **Array** is a special form of **Object**.

- Plain object: `{key0:value, key1:value, ...}`
- Array: `[value,value, ...]`

Both objects and arrays expose a `key -> value` structure. In objects, it's obvious. In Arrays, the keys are numeric index. Values in Objects can be reached by its keys. Similarly, values in Arrays can be gotten by its index.

## Object and string conversion

In JS, JSON is an object, however, in a transaction, JSON is a string. JS provides methods in JSON object to convert between these two.

- From String to JSON object

  ```javascript
  ..
  }).done(function(data){
      person = JSON.parse(data);
      alert(person.name);
  });

  const jsonObject = JSON.parse(jsonString);
  const str = JSON.stringify(arr);
  ```

## Loop through JSON Objects

- First option is to loop through all `key -> value` pages,
  ```javascript
  for (const prop in data) { }
  ```

- The second option is to get all keys and loop through these keys to reach each `key -> value` pair
  ```javascript
  Object.keys(data).forEach(function(prop) {
    // `prop` is the property name
    // `data[prop]` is the property value
  }); 
  ```

## Loop through JSON Arrays

- First, here is how we use `for ( ; ; )`loop
  ```javascript
    for(let i = 0, l = data.persons.length; i < l; i++) {
        // var person = data.persons[i];
        // `person.id` and `person.name`. 
        // We could also use `data.persons[i].id`.
    }
  ```
- Second way to loop is to use `for... in`. It's not a good practice because: 
  - First, the order of the loop is undefined for a `for...in` loop, so there's no guarantee the properties will be iterated in the order you want.
  - Second, for...in iterates over all enumerable properties of an object, including those inherited from its prototype.You can use `Object.prototype.hasOwnProperty()` to check that the property is owned directly by the object rather than being inherited.
  - If you really need to use this way, you need to remove additional augment in the prototype of Array.
  
  ```javascript
  Array.prototype.remove = function(val) {
      // Irrelevant implementation details
  };
  
  var a = ["a", "b", "c"];
  
  for (var i in a) {
      console.log(i);
  }
  //0,1,2, which are index of elements  
  ```
- Thirdly, in ES5, we can use `forEach` method
  ```javascript
  data.items.forEach(function(value, index, array) {
      // The callback is executed for each element in the array.
      // `value` is the element itself (equivalent to `array[index]`)
      // `index` will be the index of the element in the array
      // `array` is a reference to the array itself (i.e. `data.items` in this case)
  });   
  ```
- Fourthly, using `for...of` method. 

  ```javascript
  let iterable = [10, 20, 30];
  
  for (let value of iterable) {
    value += 1;
    console.log(value);
  }
  // 11
  // 21
  // 31
  ```

## Read a JSON tree recursively

```javascript
// This function handles arrays and objects
function eachRecursive(obj)
{
    for (var k in obj)
    {
        if (typeof obj[k] == "object" && obj[k] !== null)
            eachRecursive(obj[k]);
        else
            // do something... 
    }
}
```

## Get keys, values of an object

- `Object.keys()` returns an array of object's keys, 
- `Object.values()` returns an array of object's values,
- `Object.entries()` returns an array of object's keys and corresponding values in a format `[key, value]`.

```javascript
const obj = { a: 1 ,b: 2 ,c: 3 }

console.log(Object.keys(obj)) // ['a', 'b', 'c']
console.log(Object.values(obj)) // [1, 2, 3]
console.log(Object.entries(obj)) // [['a', 1], ['b', 2], ['c', 3]]

//for-of loop to loop through enties
for (const [key, value] of Object.entries(obj)) {
console.log(`key: ${key}, value: ${value}`)
}

//since it's an Array inside of the entiry
for (const element of Object.entries(obj)) {
  const key   = element[0]
  const value = element[1]
}
```

## Convert a http response to object

```javascript
this.restService.post('/projects', true, JSON.stringify(project))
    .subscribe((response: Project) => {
            const newProject: Project = new Project();
            newProject.deserialize(response);
  });
```

## Merge two jsons, or say values overwriting

`Object.assign(target, ...sources)`

```javascript
var o1 = { a: 1, b: 1, c: 1 };
var o2 = { b: 2, c: 2 };
var o3 = { c: 3 };

var obj = Object.assign({}, o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
```

## References

- [looping through an object (tree) recursively](https://stackoverflow.com/questions/2549320/looping-through-an-object-tree-recursively)
- [Access / process (nested) objects, arrays or JSON](https://stackoverflow.com/questions/11922383/access-process-nested-objects-arrays-or-json)
- [MDN: Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

