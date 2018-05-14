# webpack-preprocessor-loader

[![Version][version-badge]][npm]
[![Node][node-badge]][node]
![Downloads][download-badge]
[![License][license-badge]][license]
[![Build Status][travis-badge]][travis]

Bring the awesome "Conditional Compilation" to the Webpack, and more.

## Why

Make life easy with the power of `webpack-preprocessor-loader`:

- Output different codes based on environment (eg: development/production);
- Split codes in production, while bundle them in development;
- Auto remove debugs in production;
- Other similar scenarios;

Simply write:

``` javascript
// #!if ENV === 'develop'
import someModule from 'module-name';
// #!else
const someModule = import('module-name');
// #!endif

// #!debug
console.log(someModule);
```

...which yields:

> ```ENV === 'product', debug === false```

``` javascript
const someModule = import('module-name');
```

Pros:

- It is "Conditional Compilation";
- Say goodbye to those "process.env.NODE_ENV"s messing around the code;
- Hide specific contents from the final result;
- Create custom directives if needed;

Cons:

- Maybe a little verbose in some cases; 
  > If so, consider using webpack.DefinePlugin backwards.

## Compatibility

- webpack: 4.x+
- node: 6.11.5 minimum (aligned with webpack 4)

## Installation

``` bash
yarn add webpack-preprocessor-loader -D
```

or

``` bash
npm install webpack-preprocessor-loader -D
```

## Configuration

Since it deals directly with the raw text, `webpack-preprocessor-loader` should be the **last** loader in `use` definition:

``` javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              debug: process.env.NODE_ENV !== 'product',
              directives: {
                foo: false,
              },
              params: {
                ENV: process.env.NODE_ENV,
              },
              verbose: false,
            },
          },
        ],
      },
    ],
  },
};
```

Note that **any** text-based file can be compiled, not only codes, but also html documents, styles, and more.

## Options

### `debug`

> type: `boolean`
>
> default: `false`

Provide constant value for buildin `#!debug` directive. See **Directives - #!debug**.

### `directives`

> type: `{[key: string]: boolean}`
>
> default: `{}`

Define custom directives. For example, to create a directive called "foo":

``` javascript
// In webpack config...

{
  loader: 'webpack-preprocessor-loader',
  options: {
    directives: {
      foo: false,
    },
  },
},
```

In code:

``` javascript
// #!foo
console.log('wow'); // This line will be omitted
```

Note that the custom directive only marks its **next** line, which means:

``` javascript
// #!foo
console.log('Removed'); // This line will be omitted
console.log('Kept'); // This line will not be affected by "#!foo", hence it will be kept anyway
```

If an undefined directive is referenced, say "bar", the next line marked by `#!bar` will always be omitted, because the value of `bar` is `undefined`, identical as `false`.

### `params`

> type: `{[key: string]: any}`
>
> default: `{}`

Provide constant values for buildin `#!if` / `#!elseif` / `#!else` / `#!endif` directives. See **Directives - #!if / #!else / #!elseif / #!endif**

### `verbose`

> type: `boolean`
>
> default: `false`

Whether to keep raw info or not. Basically for debugging purpose.

``` javascript
// options.params.ENV === 'product'

// #!if ENV === 'develop'
console.log('many doge');
// #!else
console.log('much wow');
// #!endif
```

If set to `true`, yields:

``` javascript
// #!if ENV === 'develop'
/** console.log('many doge'); */
// #!else
console.log('much wow');
// #!endif
```

## Directives

### `#!if` / `#!else` / `#!elseif` / `#!endif`

#### Basic Usage

As name suggests, these directives work similarly like real `if` logic:

``` javascript
// In webpack config...

{
  loader: 'webpack-preprocessor-loader',
  options: {
    params: {
      foo: 2,
      bar: 1,
    },
  },
},
```

The following code...

``` javascript
// #!if foo === 1
const a = 1;
// #!elseif bar === 1
const a = 2;
// #!elseif bar === 2
const a = 3;
// #!else
const a = 4;
// #!endif
```

...yields

``` javascript
const a = 2;
```

Any valid `#!if` / `#!else` / `#!elseif` / `#!endif` combination is accepted, only remember **always** close selection statements by `#!endif`.

#### Advanced Condition 

The condition can also be some more complex expressions. For example:

``` javascript
// #!if foo === 1 && bar === 2

// #!if foo + bar === 3

// Seriously?
// #!if (function(a){ return a === 1; })(foo)
```

Behind the scenes, the expression is wrapped in a `return` clause, and dynamically evaluated during compilation, thus its context is **irrelevant** to the code. So all variables in the expression should be pre-defined in the `params` and treated as constants. Ensure the expression returns a boolean value. 

### `#!debug`

A semantic and handy directive to mark specific line only to be kept when needed. For example:

``` javascript
// options.debug === false

// #!debug
console.log('test'); // This line will be omitted
```

Note that the `#!debug` directive only marks its **next** line, which means:

``` javascript
// options.debug === false

// #!debug
console.log('Removed'); // This line will be omitted
console.log('Kept'); // This line will not be affected by "#!debug", hence it will be kept anyway
```

## Trivia (Maybe not)

### When combined with Typescript/ESlint

The following code yields errors during linting:

``` javascript
// #!if ENV = 'develop'
const foo = 1; 
// #!else
const foo = -1; 
// #!endif

// "[ts] Cannot redeclare block-scoped variable 'foo'."
// "[eslint] Parsing error: Identifier 'foo' has already been declared"
```

#### Typescript

To suppress the error, a tricky way is simply adding `// @ts-ignore` before all declarations:

``` javascript
// #!if ENV = 'develop'
// @ts-ignore
const foo = 1;
// #!else
// @ts-ignore
const foo = -1;
// #!endif

// Errors gone.
```

#### ESlint

It is hard to get around this problem while linting through editor plugin, because ESLint parses the file into AST first, which caused a parsing error. So the only solution is to temporarily comment one or more declarations out during code editing.

Otherwise, if `eslint-loader` is used, simply put it **before** `webpack-preprocessor-loader`:

``` javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              // ...
            },
          },
        ],
      },
    ],
  },
};
```

## Lisense

MIT License

[version-badge]: https://img.shields.io/npm/v/webpack-preprocessor-loader.svg
[npm]: https://www.npmjs.com/package/webpack-preprocessor-loader
[node-badge]: https://img.shields.io/node/v/webpack-preprocessor-loader.svg
[node]: https://nodejs.org
[download-badge]: https://img.shields.io/npm/dw/webpack-preprocessor-loader.svg
[license]: LICENSE
[license-badge]: https://img.shields.io/npm/l/webpack-preprocessor-loader.svg
[travis-badge]: https://travis-ci.org/afterwind-io/preprocessor-loader.svg?branch=master
[travis]: https://travis-ci.org/afterwind-io/preprocessor-loader
