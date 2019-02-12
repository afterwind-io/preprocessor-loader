module.exports.C_DEBUG = `
// #!debug
console.log('doge');
`;

module.exports.R_DEBUG = `
`;

module.exports.HTML_DEBUG = `
<!-- #!debug -->
console.log('dodge');
`;

module.exports.C_DEBUG_SINGLE = `
// #!debug
console.log('doge');
console.log('wow');
`;

module.exports.R_DEBUG_SINGLE = `
console.log('wow');
`;

module.exports.C_IF_ENDIF = `
// #!if foo === 1
const a = 1;
// #!endif
`;

module.exports.R_IF_ENDIF = `
const a = 1;
`;

module.exports.HTML_IF_ENDIF = `
<!-- #!if foo === 1 -->
const a = 1;
<!-- #!endif -->
`;

module.exports.C_IF_ELSE_ENDIF = `
// #!if foo === 1
const a = 1;
// #!else
const a = 2;
// #!endif
`;

module.exports.R_IF_ELSE_ENDIF_1 = `
const a = 1;
`;

module.exports.R_IF_ELSE_ENDIF_2 = `
const a = 2;
`;

module.exports.C_IF_ELSEIF_ENDIF = `
// #!if foo === 1
const a = 1;
// #!elseif bar === 2
const a = 2;
// #!endif
`;

module.exports.R_IF_ELSEIF_ENDIF_1 = `
const a = 1;
`;

module.exports.R_IF_ELSEIF_ENDIF_2 = `
const a = 2;
`;

module.exports.C_IF_ELSEIF_ELSE_ENDIF = `
// #!if foo === 1
const a = 1;
// #!elseif bar === 1
const a = 2;
// #!elseif bar === 2
const a = 3;
// #!else
const a = 4;
// #!endif
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_1 = `
const a = 1;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_2 = `
const a = 2;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_3 = `
const a = 3;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_4 = `
const a = 4;
`;

module.exports.C_CUSTOM_DIRECTIVES = `
// #!doge
console.log('wow');
`;

module.exports.R_CUSTOM_DIRECTIVES = `
`;

module.exports.C_CUSTOM_DIRECTIVES_SINGLE = `
// #!doge
console.log('wow');
console.log('woof');
`;

module.exports.R_CUSTOM_DIRECTIVES_SINGLE = `
console.log('woof');
`;

module.exports.C_CUSTOM_DIRECTIVES_MULTI = `
// #!doge
console.log('woof');
// #!kitty
console.log('meow');
`;

module.exports.R_CUSTOM_DIRECTIVES_MULTI = `
console.log('meow');
`;

module.exports.C_VERBOSE = `
// #!if foo === 1
const a = 1;
// #!endif
`;

module.exports.R_VERBOSE = `
// #!if foo === 1
/* const a = 1; */
// #!endif
`;

module.exports.C_JSX_SINGLE = `
const Component = () =>
  <div>
    <h1>Hello</h1>

    {/* #!if SAY_HELLO_WORLD */}
      World!
    {/* #!else */}
      Doge!
    {/* #!endif */}

  </div>
`;

module.exports.R_JSX_SINGLE = `
const Component = () =>
  <div>
    <h1>Hello</h1>

      World!

  </div>
`;

module.exports.C_JSX_MULTI = `
const Component = () =>
  <div>
    <h1>Hello</h1>

    {/*
      #!if SAY_HELLO_WORLD
      Some other comments
    */}
      World!
    {/*
      /* #!else */
    */}
      Doge!
    {/*
    // #!endif
    */}

  </div>
`;

module.exports.R_JSX_MULTI = `
const Component = () =>
  <div>
    <h1>Hello</h1>

    {/*
    */}
      Doge!
    {/*
    */}

  </div>
`;
