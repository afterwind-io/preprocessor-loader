# webpack-preprocessor-loader

[![Version][version-badge]][npm]
[![Node][node-badge]][node]
![Downloads][download-badge]
[![License][license-badge]][license]
[![Build Status][travis-badge]][travis]

Bring the awesome "Conditional Compilation" to the Webpack, and more.

- [Compatibility](#compatibility)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Basics](#basics)
  - [JSX comment syntax (^1.04)](#jsx-comment-syntax-104)
  - [HTML comment syntax (^1.10)](#html-comment-syntax-110)
  - [Inline directive within comment (^1.10)](#inline-directive-within-comment-110)
  - [Multiline directive syntax (^1.10)](#multiline-directive-syntax-110)
  - [Multiline directive syntax with comment (^1.10)](#multiline-directive-syntax-with-comment-110)
- [Options](#options)
  - [`debug` _](#debug-_)
  - [`directives`](#directives)
  - [`params`](#params)
  - [`verbose`](#verbose)
- [Build-in Directives](#build-in-directives)
  - [`#!if` / `#!else` / `#!elseif` / `#!endif`](#if--else--elseif--endif)
  - [`#!debug`](#debug)
- [Caveats](#caveats)
  - [Inline directive with code](#inline-directive-with-code)
  - [Linting](#linting)
- [Lisense](#lisense)

## Why <!-- omit in toc -->

Make life easy with the help of `webpack-preprocessor-loader` !

Now leverage the full power of `Conditional Compilation` in `Webpack` to output specific codes based on conditional directives. By which you could:

- Hide specific contents from the final result;
- Import different packages by environment (eg: development/production);
- Remove debugs in production; 
- Split codes in production, while bundle them in development;
- Many other scenarios...

Simply write:

``` javascript
// #!if ENV === 'develop'
import someModule from 'module-name';
// #!else
const anotherModule = import('another-module-name');
// #!endif

// #!debug
console.log(someModule);

/*
 * My precious code!
 * #!secret
 */
const the_answer_to_everything = '42';
```

...which yields:

> ```ENV === 'product', debug === false, secret === false```

``` javascript
const anotherModule = import('another-module-name');
```

Also with build-in JSX/HTML comment syntax support. See [Usage](#Usage).

**Pros**:

- It is "Conditional Compilation";
- Say goodbye to those "process.env.NODE_ENV"s messing around the code;
- Deals directly with raw text, so it just works on any text-based file;
- Create custom directives if needed;

**Cons**:

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
                secret: false,
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

## Usage

> Note that **any** text-based file can be compiled, not only codes, for example:
>  - HTML/Pug/...
>  - Sass/Less/...
>  - Json5/Xml/Yaml/...

### Basics

`Conditional Compilation` relys on a series of specified directives to decide code emitting strategy. The directive must be wrapped in a comment, followed with "`#!`".

Demo in `Javascript`:

``` javascript
// Nope. Wrap it in a comment.
'#!debug';

// Depends on the value provided in options.debug...
// #!debug
const a = 1; // ...this line may be omitted.

// What about a custom directive? 
// Add a property on options.directives, say "secret", and set it to `false`
// #!secret
const b = 1; // ...this line will be omitted.

// Works like real "if-else"!
// But first set a value on options.params, say "options.params.foo = 1"
// #!if foo === 1
const c = 1; //
/* #!else */ // <-- Also legal.
const c = 2;
// And always remember to close it by...
// #!endif

// Now try to find your own usage!
```

More detailed explainations see examples provided in [Options](#options) and [Build-in Directives](#build-in-directives).

### JSX comment syntax (^1.04)

``` jsx
import React from 'react';

/* #!debug */
console.log('wow');

function Hello() {
  return <div>
    {/* #!debug */}
    <p>oops</p>

    {/* #!if stage === 'product' */}
    <p>Ready to go</p>
    {/* #!endif */}
  </div>;
}
```

### HTML comment syntax (^1.10)

``` html
<body>
  <!-- #!debug -->
  <p>oops</p>

  <!-- #!if stage === 'product' -->
  <p>Ready to go</p>
  <!-- #!endif -->
</body>
```

### Inline directive within comment (^1.10)

See below.

### Multiline directive syntax (^1.10)

See below.

### Multiline directive syntax with comment (^1.10)

The following syntax are equivalent and legal:

``` javascript
// #!if stage === 'product'
/* #!if stage === 'product' */

/*
  #!if stage === 'product'
*/

/*
 * Look mom I have a comment!
 * #!if stage === 'product'
 */

// I have a comment too. #!if stage === 'product'
```

## Options

### `debug` _

> type: `boolean`
>
> default: `false`

Provide constant value for build-in `#!debug` directive. See [**Directives - #!debug**](#debug).

### `directives`

> type: `{[key: string]: boolean}`
>
> default: `{}`

Define custom directives. For example, to create a directive called "secret":

``` javascript
// In webpack config...

{
  loader: 'webpack-preprocessor-loader',
  options: {
    directives: {
      secret: false,
    },
  },
},
```

In code:

``` javascript
// #!secret
console.log('wow'); // This line will be omitted
```

Note that the custom directive only affects its **next** line, which means:

``` javascript
// #!secret
console.log('Removed'); // This line will be omitted
console.log('Kept'); // This line will not be affected by "#!foo", hence it will be kept anyway
```

If an undefined directive is referenced, say "foo", the next line marked by `#!foo` will always be omitted, because the value of `foo` is `undefined`, identical as `false`.

### `params`

> type: `{[key: string]: any}`
>
> default: `{}`

Provide constant values for build-in `#!if` / `#!elseif` / `#!else` / `#!endif` directives. See [**Directives - #!if / #!else / #!elseif / #!endif**](#if--else--elseif--endif)

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
// console.log('many doge');
// #!else
console.log('much wow');
// #!endif
```

## Build-in Directives

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

Note that the `#!debug` directive only affects its **next** line, which means:

``` javascript
// options.debug === false

// #!debug
console.log('Removed'); // This line will be omitted
console.log('Kept'); // This line will not be affected by "#!debug", hence it will be kept anyway
```

## Caveats

### Inline directive with code

The following code may not work as expected:

``` javascript
// debug === false
const foo = 1; /* #!debug */    // <-- the directive will be ignored and this line will be kept
const bar = 2;                  // <-- this line will be kept anyway

// or

// debug === true
/* #!debug */ const foo = 1;    // <-- this line will be omitted anyway
const bar = 2;
```

So please make sure **not** mix directive and code on the same line.

### Linting

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
[download-badge]: https://img.shields.io/npm/dt/webpack-preprocessor-loader.svg
[license]: LICENSE
[license-badge]: https://img.shields.io/npm/l/webpack-preprocessor-loader.svg
[travis-badge]: https://travis-ci.org/afterwind-io/preprocessor-loader.svg?branch=master
[travis]: https://travis-ci.org/afterwind-io/preprocessor-loader
