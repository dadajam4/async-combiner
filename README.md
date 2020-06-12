# async-combiner
Service that combines multiple asynchronous requests into one

## Docs
- [Decorator](https://dadajam4.github.io/async-combiner/modules/_decorator_.html)
- [Class](https://dadajam4.github.io/async-combiner/classes/_async_combiner_.asynccombiner.html)

## Motivation
It was troublesome to implement each project individually to solve the following problems when creating the front-end screen, so I wanted to solve it (I want to make a method that can be used in common).

- I have continuous requests for asynchronous processes that require the same result, and I want to solve those requests in one execution
- For a heavy load asynchronous process, when the user's change request is continuously received, I want to delay the execution until the user's change request is not performed.
- I want to reuse these mechanisms universally in NodeJS & browser
- I want to use both TypeScript and non-raw JavaScript
- I want to use a decorator to do simple coding in a syntax environment that supports decorators

## Usage

### Install package
```
npm install @dadajam4/async-combiner --save
```

### In your code

#### Pure JavaScript
```JavaScript
//
// Class base syntax
//
import { AsyncCombiner } from '@dadajam4/async-combiner';

class SomeClass extends AsyncCombiner {
  constructor(someValue1, someValue2) {
    super();
    this.someValue1 = someValue1;
    this.someValue2 = someValue2;
  }

  someHeavyAsyncFunc(url, query) {
    const condition = [url, query];
    return this.$asyncCombine(condition, () => this._func(url, query));
  }
  
  _someHeavyAsyncFuncExecutor(url, query) {

    /**
     * @see: https://github.com/axios/axios
     */
    return axios.get(url, { params: query });
  }
}
```

#### TypeScript
```TypeScript
import { Combine } from '@dadajam4/async-combiner';

class SomeClass {
  
  // Of course you can also use `class extends`
  @Combine()
  someHeavyAsyncFunc(url, query) {
    /**
     * @see: https://github.com/axios/axios
     */
    return axios.get(url, { params: query });
  }
}
```

### Mechanism and restrictions
Logic that uses the mechanism of this library should always match the response to the input parameters.  
**Do not use it for things like get requests that change frequently over time.**  
Inside the library, the parameters passed to the method are stored as a "condition object", and all requests of the same condition that are triggered before the processing is completed are combined into one execution.  
When using the decorator, the parameters passed to the method are automatically converted into a condition object for convenience, but you may want to customize this depending on the condition of the parameter.  
You can delay the execution of asynchronous processing if necessary. This feature can significantly reduce the backend service load, depending on the system load.  
See the documentation for individual parameter settings.

## Issues
- I think there are scenes where I want the cancel function, but I have not implemented it yet. I also considered the approach using `AbortController`, but I think it is important that it can work with NodeJS as it is, so I would like to think of a way to solve this well.