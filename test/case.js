module.exports.C_DEBUG = `
// #!debug
console.log('doge');
`;

module.exports.R_DEBUG = `
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
const b = 2;
// #!endif
`;

module.exports.R_IF_ENDIF_TURE = `
const a = 1;
const b = 2;
`;

module.exports.R_IF_ENDIF_FALSE = `
`;

module.exports.C_IF_ELSE_ENDIF = `
// #!if foo === 1
const a = 1;
const b = 1;
// #!else
const a = 2;
const b = 2;
// #!endif
`;

module.exports.R_IF_ELSE_ENDIF_1 = `
const a = 1;
const b = 1;
`;

module.exports.R_IF_ELSE_ENDIF_2 = `
const a = 2;
const b = 2;
`;

module.exports.C_IF_ELSEIF_ENDIF = `
// #!if foo === 1
const a = 1;
const b = 1;
// #!elseif bar === 2
const a = 2;
const b = 2;
// #!endif
`;

module.exports.R_IF_ELSEIF_ENDIF_1 = `
const a = 1;
const b = 1;
`;

module.exports.R_IF_ELSEIF_ENDIF_2 = `
const a = 2;
const b = 2;
`;

module.exports.C_IF_ELSEIF_ELSE_ENDIF = `
// #!if foo === 1
const a = 1;
const b = 1;
// #!elseif bar === 1
const a = 2;
const b = 2;
// #!elseif bar === 2
const a = 3;
const b = 3;
// #!else
const a = 4;
const b = 4;
// #!endif
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_1 = `
const a = 1;
const b = 1;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_2 = `
const a = 2;
const b = 2;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_3 = `
const a = 3;
const b = 3;
`;

module.exports.R_IF_ELSEIF_ELSE_ENDIF_4 = `
const a = 4;
const b = 4;
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

module.exports.C_VERBOSE_SINGLE = `
// #!debug
const a = 1;
`;

module.exports.R_VERBOSE_SINGLE = `
// #!debug
// const a = 1;
`;

module.exports.C_VERBOSE_MULTI = `
// #!if foo === 1
const a = 1;
const b = 2;
// #!endif
`;

module.exports.R_VERBOSE_MULTI = `
// #!if foo === 1
// const a = 1;
// const b = 2;
// #!endif
`;

module.exports.C_VERBOSE_MIXED = `
// #!debug
const a = 1;
/* #!debug */
const b = 2;
`;

module.exports.R_VERBOSE_MIXED = `
// #!debug
// const a = 1;
/* #!debug */
/* const b = 2;*/
`;

module.exports.C_CASE_INLINE_COMMENT_SINGLE = `
/* I'm a inline comment directive #!debug */
const a = 1;
`;

module.exports.R_CASE_INLINE_COMMENT_SINGLE = `
`;

module.exports.C_CASE_INLINE_COMMENT_MULTI = `
/*
  I am a multiline commented directive
  #!debug
*/
const a = 1;
`;

module.exports.R_CASE_INLINE_COMMENT_MULTI = `
`;

module.exports.C_CASE_NORMAL_COMMENT = `
/* I'm a comment */

// #!debug
const a = 1;

// Me too
`;

module.exports.R_CASE_NORMAL_COMMENT = `
/* I'm a comment */


// Me too
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

      Doge!

  </div>
`;

module.exports.C_HTML_SINGLE = `
<div>
  <h1>Hello</h1>

  <!-- #!if SAY_HELLO_WORLD -->
    World!
  <!-- #!else -->
    Doge!
  <!-- #!endif -->
</div>
`;

module.exports.R_HTML_SINGLE = `
<div>
  <h1>Hello</h1>

    World!
</div>
`;

module.exports.C_HTML_MULTI = `
<div>
  <h1>Hello</h1>

  <!--
    #!if SAY_HELLO_WORLD
    Some other comments
  -->
    World!
  <!-- #!else -->
    Doge!
  <!-- #!endif -->
</div>
`;

module.exports.R_HTML_MULTI = `
<div>
  <h1>Hello</h1>

    Doge!
</div>
`;

module.exports.C_HTML_MIXED = `
<body>
  <!-- #!if SAY_HELLO_WORLD -->
    <script>
      // #!if foo === 1
      const a = 1;
      // #!elseif bar === 1
      const a = 2;
      // #!elseif bar === 2
      const a = 3;
      // #!else
      const a = 4;
      // #!endif
    </script>
  <!-- #!else -->
    <script>
      const a = 5;
    </script>
  <!-- #!endif -->
</body>
`;

module.exports.R_HTML_MIXED = `
<script>
  const a = 4;
</script>
`;

module.exports.C_EGDE_CODE_BEFORE_DIRECTIVE = `
const a = 1;/* #!debug */
const b = 2;
`;

module.exports.R_EGDE_CODE_BEFORE_DIRECTIVE = `
const a = 1;/* #!debug */
const b = 2;
`;

module.exports.C_EDGE_CODE_AFTER_DIRECTIVE = `
/* #!debug */const a = 1;
const b = 2;
`;

module.exports.R_EDGE_CODE_AFTER_DIRECTIVE = `
`;

module.exports.C_EDGE_COMMENT_AFTER_DIRECTIVE = `
/* #!debug */
/*
 * oops
 */
// not me
`;

module.exports.R_EDGE_COMMENT_AFTER_DIRECTIVE = `
// not me
`;

module.exports.C_EDGE_NO_EOF_SINGLE_CHAR = `
.poi {
  // oops
}`;

module.exports.R_EDGE_NO_EOF_SINGLE_CHAR = `
.poi {
  // oops
}`;

module.exports.C_EDGE_NO_EOF_MULTI_CHARS = `
// oops
'wow';`;

module.exports.R_EDGE_NO_EOF_MULTI_CHARS = `
// oops
'wow';`;

module.exports.C_EDGE_NO_EOF_COMMENT = `
/* oops
// wow`;

module.exports.R_EDGE_NO_EOF_COMMENT = `
/* oops
// wow`;
