# preprocessor-loader [WIP]

Bring the awesome "Conditional Compilation" to the Webpack, and more.

## Why

TODO

## Compatibility
> FYI: Copy-Paste from ts-loader

- webpack: 4.x+
- node: 6.11.5 minimum (aligned with webpack 4)

## Installation

``` bash
yarn add preprocessor-loader -D
```

or

``` bash
npm install preprocessor-loader -D
```

## Usage

Since it deals with **raw code**, the `preprocessor-loader` should always be the last loader in `use` array:

``` javascript
// process.env.NODE_ENV === 'product'

module.exports = {
  mode: 'production',
  entry: 'index.js',
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'babel-loader',
          'ts-loader',
          {
            loader: 'preprocessor-loader'
            options: {
              params: {
                ENV: process.env.NODE_ENV,
              },
            },
          },
        ],
      },
    ],
  },
};
```

In code:

``` javascript
// <example.js>

// process.env.NODE_ENV === 'product'
// The result of #!if is *false*, because the value of ENV is 'product'

// #!if ENV === 'develop'
// The following lines will never present in the final code, including this line:
const foo = 1;
const bar = 2;
// #!endif
```

## Options

TODO

## Directives

### `#!if` / `#!else` / `#!endif`

``` javascript
// javascript

// #!if ENV = 'develop'
const foo = 1; // This line will be compiled (presented in the code)
// #!else
const foo = -1; // You shall not pass (removed from the code)
// #!endif

```

### `#!debug`

A handy directive to mark specific line only be kept when needed, for example:

``` javascript
// options.debug === false

// #!debug
console.log('test'); // This line will be omited
```

Note that the `#!debug` directive only marks its **next** line, which means:

``` javascript
// options.debug === false

// #!debug
console.log('Removed'); // This line will be omited
console.log('Keeped'); // This line will not be affected by "#!debug", hence it will never be removed
```

## Trivia (Maybe not)

### When combined with Typescript...

the following code yields errors during compilation/linting:

``` javascript
// #!if ENV = 'develop'
const foo = 1; // "[ts] Cannot redeclare block-scoped variable 'foo'."
// #!else
const foo = -1; // "[ts] Cannot redeclare block-scoped variable 'foo'."
// #!endif
```

To suppress the error, a tricky way is simply add `// @ts-ignore` before any of the declaration:

``` javascript
// #!if ENV = 'develop'
// @ts-ignore
const foo = 1;
// #!else
const foo = -1;
// #!endif

// Errors gone.
```

## Lisence

MIT License
