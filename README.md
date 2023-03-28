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
  - [Single-line control](#single-line-control)
  - [Multi-line control](#multi-line-control)
  - [Branching](#branching)
  - [Comment Syntax](#comment-syntax)
- [Options](#options)
  - [`debug`](#debug)
  - [`directives`](#directives)
  - [`params`](#params)
  - [`verbose`](#verbose)
- [Built-in Directives](#built-in-directives)
  - [`#!if` / `#!else` / `#!elseif` / `#!endif`](#if--else--elseif--endif)
  - [`#!debug`](#debug-1)
- [Caveats](#caveats)
  - [Javascript](#javascript)
- [Changelog](#changelog)
- [License](#license)

## Why <!-- omit in toc -->

`webpack-preprocessor-loader` leverages the concept of `Conditional Compilation` to output specific code based on conditional directives. By which you can:

- Hide specific contents from the final result;
- Import different packages by specified environment (eg: development/production);
- Remove debugs in production;
- Split codes in production, while bundle them in development;
- Many other scenarios...

For a quick review, given:

```
ENV === "product", debug === false, secret === false
```

In code:

```javascript
// #!if ENV === 'develop'
import someModule from "module-name";
// #!else
const anotherModule = import("another-module-name");
// #!endif

// #!debug
console.log(someModule);

/*
 * My precious code!
 * #!secret
 */
const the_answer_to_everything = "42";
```

Yields:

```javascript
const anotherModule = import("another-module-name");
```

**Pros**:

- It is "Conditional Compilation";
- Say goodbye to those "process.env.NODE_ENV"s messing around the code;
- Deals directly with raw text, so it just works on any text-based file;
- Create custom directives if needed;

**Cons**:

- Maybe a little verbose in some cases;
  > If so, consider using webpack.DefinePlugin backwards.

## Compatibility

- webpack: >=4.0.0
- node: 6.11.5 minimum (aligned with webpack 4)

## Installation

```bash
yarn add webpack-preprocessor-loader -D
```

or

```bash
npm install webpack-preprocessor-loader -D
```

## Configuration

Since it deals directly with the raw text, `webpack-preprocessor-loader` should be the **last** loader in `use` definition. A full example config is as follows:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          "babel-loader",
          // ... other loaders
          {
            loader: "webpack-preprocessor-loader",
            options: {
              debug: process.env.NODE_ENV !== "product",
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

More details see [`Options`](#options).

## Usage

> Note that **any** text-based file can be compiled, not only codes, for example:
>
> - HTML/Pug/...
> - Sass/Less/...
> - Json5/Xml/Yaml/...

### Basics

`Conditional Compilation` relies on special comments, aka `directive`, which start with `#!`, followed by the directive name, e.g.,

```javascript
// #!directive
```

Directives can be used to tag a certain line, or wrap a whole block of code.

```javascript
// #!debug
const foo = 1;

// #!if env === "development"
const bar = 2;
const baz = 3;
// #!endif
```

Unlike normal comments, the directive must not appear in-line. For example:

```javascript
// Won't work
const bar = 2; // #!debug // <-- Directive will be ignored.
/* #!debug */ const baz = 3; // <-- The code will always be omitted with the directive.
```

Multiple variants of comment are supported. Details see [Comment Syntax](#comment-syntax).

### Single-line control

One common case is that we want to omit one specified line of code under certain condition(s).

For example, we want to log some messages to the console, but only during development. To drop the code based on environment, we can define a custom directive.

First, declare a property in [`options.directives`](#directives), e.g. `dev`.

In config:

```javascript
{
  loader: 'webpack-preprocessor-loader',
  options: {
    directives: {
      dev: process.env.NODE_ENV === "development",
    },
  },
},
```

In code:

```javascript
// #!dev
console.log("DEBUG ONLY");
```

During the compilation, if the value of `dev` is `false`, the exact line of code under the directive will be omitted, and vice versa.

For the `development/production` scenario, the loader provides a handy built-in directive called `#!debug`. Details see [`Options - debug`](#debug) and [`Built-in Directives`](#debug-1).

### Multi-line control

The other common case is that we want to omit multiple lines of code at once depends on certain condition(s). Since custom directives can only tag one line of code, we need another group of built-in directives: `#!if`/`#!endif`.

Like real-world `if`s, it needs a condition. We can also provide variables to form an expression.

Declare a property in [`options.params`](#params), e.g. `env`.

In config:

```javascript
{
  loader: 'webpack-preprocessor-loader',
  options: {
    params: {
      env: process.env.NODE_ENV,
    },
  },
},
```

In code:

```javascript
// #!if env === "development"
console.log("DEBUG ONLY");
doSomethingForTheDev();
// #!endif
```

Once compiled, the codes between `#!if` and `#!endif` will be omitted, if the condition expression provided evaluates to falsy value in javascript.

More details see [`Built-in Directives`](#if--else--elseif--endif).

### Branching

Sometimes, we may need a little bit more complex control flow. For example, the project runs different code between multiple stages. Like conditional branching in standard language, the loader provides `#!else`/`#!elseif` directives to stimulate the behavior of `if` statement.

Suppose there is a parameter called "`env`" defined in `options.params`, statement branching can easily be expressed like:

```javascript
// #!if env === "development"
doSomethingA();
doSomethingA2();
// #!elseif env === "canary"
doSomethingB();
doSomethingB2();
// #!else
doSomethingC();
doSomethingC2();
// #!endif

doSomethingCommon();
```

In addition, nested `#!if` is also supported. More details see [`Built-in Directives`](#if--else--elseif--endif).

### Comment Syntax

The loader supports the following comment variants:

- Line comment

  ```javascript
  // #!if foo === 1
  ```

- Block comment:

  ```javascript
  /* #!if foo === 1 */

  /*
   * #!if stage === 'product'
   */
  ```

- HTML comment:

  ```html
  <!-- #!if foo === 1 -->
  ```

- JSX comment:

  ```jsx
  <div>{/* #!if foo === 1 */}</div>
  ```

And for better maintenance, embedded comments in directive are also supported. For example:

```javascript
/*
 * Look mom I have a comment!
 * #!if stage === 'product'
 */

// I have a comment too. #!if stage === 'product'
```

## Options

### `debug`

> type: `boolean`
>
> default: `false`

Provides constant value for built-in `#!debug` directive. See [**Directives - #!debug**](#debug-1).

### `directives`

> type: `{[key: string]: boolean}`
>
> default: `{}`

Define custom directives. For example, to create a directive called "secret":

In config:

```javascript
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

```javascript
// #!secret
console.log("wow"); // This line will be omitted
```

Note that the custom directive only affects its **next** line, which means:

```javascript
// #!secret
console.log("Removed"); // This line will be omitted
console.log("Preserved"); // This line will not be affected by "#!secret", hence it will be preserved anyway
```

If an undefined directive is referenced, say "foo", the next line marked by `#!foo` will always be omitted, because the value of `foo` is `undefined`, identical as `false`.

### `params`

> type: `{[key: string]: any}`
>
> default: `{}`

Provide constant values for built-in `#!if` / `#!elseif` / `#!else` / `#!endif` directives. See [**Directives - #!if / #!else / #!elseif / #!endif**](#if--else--elseif--endif)

### `verbose`

> type: `boolean` | `{ escapeComments?: boolean; }`
>
> default: `false`

Preserve all directive comments and omitted lines as comments. Basically for debugging purpose. Note that the normal comments remain as-is(except padding).

Given:

```javascript
// options.params.ENV === 'product'

// #!if ENV === 'develop'
/** some comment */
console.log("many doge");
// #!else
console.log("much wow");
// #!endif
```

If set to `true`, yields:

<!-- prettier-ignore -->
```javascript
// #!if ENV === 'develop'
   /** some comment */
// console.log('many doge');
// #!else
console.log("much wow");
// #!endif
```

#### `escapeComments`

> default: `false`

There are rare cases where multiple kinds of comment notations live within the same control block. For example:

```html
<body>
  <!-- #!if foo === 1-->
  <style>
    .div {
      /* comment because of reasons */
      color: tomato;
    }
  </style>
  <script>
    /**
     * another multiline comment
     
     */
    const bar = 1;
  </script>
  <!-- #!endif -->
</body>
```

If `foo === 2`, the comments in `style` and `script` tag will stay as-is and "leak" into outside code. To prevent unwanted results, set `escapeComments` to `true`. All _non-directive_ comment notations will be replaced by `@@`, and re-wrapped by those used in the previous directive:

<!-- prettier-ignore -->
```html
<body>
<!-- #!if foo === 1-->
<!--   <style>-->
<!--     .div {-->
<!--       @@ comment because of reasons @@-->
<!--       color: tomato;-->
<!--     }-->
<!--   </style>-->
<!--   <script>-->
<!--     @@*-->
<!--      * another multiline comment-->
<!-- -->
<!--      @@-->
<!--     const bar = 1;-->
<!--   </script>-->
<!-- #!endif -->
</body>
```

## Built-in Directives

### `#!if` / `#!else` / `#!elseif` / `#!endif`

#### Basic Usage

As name suggests, these directives work similarly like real `if` logic.

In config:

```javascript
{
  loader: 'webpack-preprocessor-loader',
  options: {
    params: {
      foo: 1,
      bar: 1,
    },
  },
},
```

Demo in `Javascript`:

```javascript
// #!if foo === 1
const foo = 1;

// Even nested...
// #!if bar === 1
const bar = 1;
// Or even nested custom directive!
// Suppose "options.directives.test === true"
// #!test
const baz = 0;
// #!else
const bar = 2;
// #!test
const baz = 1; // <-- omitted, because bar !== 1, even though test === true
// #!endif

// #!else
const foo = 2;

// #!endif
```

Yields

```javascript
const foo = 1;
const bar = 1;
const baz = 0;
```

Any valid `#!if` / `#!else` / `#!elseif` / `#!endif` combination is accepted, only remember **always** close branching statements by `#!endif`.

#### Complex Condition

The condition can also be some more complex expressions. For example:

```javascript
// #!if foo === 1 && bar === 2

// #!if foo + bar === 3

// Seriously?
// #!if (function(a){ return a === 1; })(foo)
```

Behind the scenes, the expression is wrapped in a `return` clause, and dynamically evaluated during compilation, thus its context is **irrelevant** to the code. So all variables in the expression should be pre-defined in the `params` and treated as constants. Finally ensure the expression returns a boolean value.

### `#!debug`

A semantic and handy directive to mark specific line only to be preserved when needed. For example:

```javascript
// options.debug === false

// #!debug
console.log("test"); // This line will be omitted
```

Note that the `#!debug` directive only affects its **next** line, which means:

```javascript
// options.debug === false

// #!debug
console.log("Removed"); // This line will be omitted
console.log("Preserved"); // This line will not be affected by "#!debug", hence it will be preserved anyway
```

## Caveats

### Javascript

The following code yields errors during linting:

```javascript
// #!if env === 'develop'
const foo = 1;
// #!else
const foo = -1;
// #!endif

// "[ts] Cannot redeclare block-scoped variable 'foo'."
// "[eslint] Parsing error: Identifier 'foo' has already been declared"
```

#### Typescript

To suppress the error, a tricky way is simply adding `// @ts-ignore` before all declarations:

```javascript
// @ts-ignore #!if env === 'develop'
const foo = 1;
// @ts-ignore #!else
const foo = -1;
// #!endif

// Errors gone.
```

#### ESlint

It is hard to get around this problem while linting through editor plugin, because ESLint parses the file into AST first, which caused a parsing error. So the only solution is to temporarily comment one or more declarations out during code editing.

Otherwise, if `eslint-loader` is used, simply put it **before** `webpack-preprocessor-loader`:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          "babel-loader",
          "eslint-loader",
          {
            loader: "webpack-preprocessor-loader",
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

## Changelog

See [Github Release Page](https://github.com/afterwind-io/preprocessor-loader/releases).

## License

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
