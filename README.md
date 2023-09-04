# Exercises in web programming

## JavaScript

```js
// check whether an object `obj` is of type `object`
if (
  typeof obj === 'object' && // it is of type `object`
  !Array.isArray(obj) &&     // it is not an array
  obj !== null               // it is not null
) {
  // do something
}
```