const expect = require('chai').expect;
const { ifComparator, getDirective } = require('../dist/filter');
const { preprocessor: p } = require('../dist/preprocessor');
const {
  C_DEBUG,
  R_DEBUG,
  C_DEBUG_SINGLE,
  R_DEBUG_SINGLE,
  C_IF_ENDIF,
  R_IF_ENDIF_TURE,
  R_IF_ENDIF_FALSE,
  C_IF_ELSE_ENDIF,
  R_IF_ELSE_ENDIF_1,
  R_IF_ELSE_ENDIF_2,
  C_IF_ELSEIF_ENDIF,
  R_IF_ELSEIF_ENDIF_1,
  R_IF_ELSEIF_ENDIF_2,
  C_IF_ELSEIF_ELSE_ENDIF,
  R_IF_ELSEIF_ELSE_ENDIF_1,
  R_IF_ELSEIF_ELSE_ENDIF_2,
  R_IF_ELSEIF_ELSE_ENDIF_3,
  R_IF_ELSEIF_ELSE_ENDIF_4,
  C_CUSTOM_DIRECTIVES,
  R_CUSTOM_DIRECTIVES,
  C_CUSTOM_DIRECTIVES_SINGLE,
  R_CUSTOM_DIRECTIVES_SINGLE,
  C_CUSTOM_DIRECTIVES_MULTI,
  R_CUSTOM_DIRECTIVES_MULTI,
  C_VERBOSE_SINGLE,
  R_VERBOSE_SINGLE,
  C_VERBOSE_MULTI,
  R_VERBOSE_MULTI,
  C_VERBOSE_MIXED,
  R_VERBOSE_MIXED,
  C_CASE_INLINE_COMMENT_SINGLE,
  R_CASE_INLINE_COMMENT_SINGLE,
  C_CASE_INLINE_COMMENT_MULTI,
  R_CASE_INLINE_COMMENT_MULTI,
  C_CASE_NORMAL_COMMENT,
  R_CASE_NORMAL_COMMENT,
  C_JSX_SINGLE,
  R_JSX_SINGLE,
  C_JSX_MULTI,
  R_JSX_MULTI,
  C_HTML_SINGLE,
  R_HTML_SINGLE,
  C_HTML_MULTI,
  R_HTML_MULTI,
  C_EGDE_CODE_BEFORE_DIRECTIVE,
  R_EGDE_CODE_BEFORE_DIRECTIVE,
  C_EDGE_CODE_AFTER_DIRECTIVE,
  R_EDGE_CODE_AFTER_DIRECTIVE,
  C_EDGE_COMMENT_AFTER_DIRECTIVE,
  R_EDGE_COMMENT_AFTER_DIRECTIVE,
  C_EDGE_NO_EOF_SINGLE_CHAR,
  R_EDGE_NO_EOF_SINGLE_CHAR,
  C_EDGE_NO_EOF_MULTI_CHARS,
  R_EDGE_NO_EOF_MULTI_CHARS,
  C_EDGE_NO_EOF_COMMENT,
  R_EDGE_NO_EOF_COMMENT,
} = require('./case');
const {
  C_JS,
  R_JS,
} = require('./case_javascript');
const {
  C_JSX,
  R_JSX,
} = require('./case_jsx');
const {
  C_HTML,
  R_HTML,
} = require('./case_html');

describe('Preprocessor-Loader Test', () => {

  describe('Unit Test - Directive Extraction Function', () => {
    it('Directive Only', () => {
      const line = '#!debug';
      const [directive, condition] = getDirective(line);

      expect(directive).equals('debug');
      expect(condition).equals('');
    });

    it('Directive with condition', () => {
      const line = '#!if foo === 1';
      const [directive, condition] = getDirective(line);

      expect(directive).equals('if');
      expect(condition).equals('foo === 1');
    });

    it('Directive with condition, spaces included', () => {
      const line = '   #!if   foo === 1';
      const [directive, condition] = getDirective(line);

      expect(directive).equals('if');
      expect(condition).equals('foo === 1');
    });
  });

  describe('Unit Test - ifComparator', () => {
    const params = {
      foo: 1,
      bar: 2,
    };

    it('Single Condition', () => {
      expect(ifComparator(params, 'foo === 1')).equals(true);
    });

    it('Compound Condition', () => {
      expect(ifComparator(params, 'foo === 1 && bar === 1')).equals(false);
    });

    it('WTF Condition', () => {
      expect(ifComparator(params, '(function(a, b){ return a + b === 3; })(foo, bar)')).equals(true);
    });
  });

  describe('Directive Test - #!debug', () => {
    const option = {
      debug: false,
    };

    it('Standard', () => {
      expect(p.call({ query: option }, C_DEBUG)).equals(R_DEBUG);
    });

    it('Only the line exactly below "#!debug" should be processed', () => {
      expect(p.call({ query: option }, C_DEBUG_SINGLE)).equals(R_DEBUG_SINGLE);
    });
  });

  describe('Directive Test - #!if | #!endif', () => {
    const option = {
      params: {
        foo: 1,
      },
    };

    it('Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ENDIF)).equals(R_IF_ENDIF_TURE);
    });

    it('Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ENDIF)).equals(R_IF_ENDIF_FALSE);
    });
  });

  describe('Directive Test - #!if | #!else | #!endif', () => {
    const option = {
      params: {
        foo: 1,
      },
    };

    it('Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSE_ENDIF)).equals(R_IF_ELSE_ENDIF_1);
    });

    it('Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSE_ENDIF)).equals(R_IF_ELSE_ENDIF_2);
    });
  });

  describe('Directive Test - #!if | #!elseif | #!endif', () => {
    const option = {
      params: {
        foo: 1,
        bar: 2,
      },
    };

    it('Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSEIF_ENDIF)).equals(R_IF_ELSEIF_ENDIF_1);
    });

    it('Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ENDIF)).equals(R_IF_ELSEIF_ENDIF_2);
    });
  });

  describe('Directive Test - #!if | #!elseif | #!else | #!endif', () => {
    const option = {
      params: {
        foo: 1,
        bar: 1,
      },
    };

    it('Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_1);
    });

    it('Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_2);
    });

    it('Standard - 3', () => {
      option.params.bar = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_3);
    });

    it('Standard - 4', () => {
      option.params.bar = 3;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_4);
    });
  });

  describe('Directive Test - Custom Directives', () => {
    const option = {
      directives: {
        doge: false,
        kitty: true,
      },
    };

    it('Standard', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES)).equals(R_CUSTOM_DIRECTIVES);
    });

    it('Only the line exactly below the directive should be processed', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES_SINGLE)).equals(R_CUSTOM_DIRECTIVES_SINGLE);
    });

    it('Multiple Custom Directives', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES_MULTI)).equals(R_CUSTOM_DIRECTIVES_MULTI);
    });
  });

  describe('Option Test - Verbose', () => {
    const option = {
      params: {
        foo: 2,
      },
      debug: false,
      verbose: true,
    };

    it('Single Line', () => {
      expect(p.call({ query: option }, C_VERBOSE_SINGLE)).equals(R_VERBOSE_SINGLE);
    });

    it('Multiple Lines', () => {
      expect(p.call({ query: option }, C_VERBOSE_MULTI)).equals(R_VERBOSE_MULTI);
    });

    it('Verbose lines should be commented with previous symbols', () => {
      expect(p.call({ query: option }, C_VERBOSE_MIXED)).equals(R_VERBOSE_MIXED);
    });
  });

  describe('Case Test', () => {
    const option = {
      debug: false,
    };

    it('Single-line Directive with inline comment', () => {
      expect(p.call({ query: option }, C_CASE_INLINE_COMMENT_SINGLE)).equals(R_CASE_INLINE_COMMENT_SINGLE);
    });

    it('Multi-line Directive with inline comment', () => {
      expect(p.call({ query: option }, C_CASE_INLINE_COMMENT_MULTI)).equals(R_CASE_INLINE_COMMENT_MULTI);
    });

    it('Normal comment should not be affected', () => {
      expect(p.call({ query: option }, C_CASE_NORMAL_COMMENT)).equals(R_CASE_NORMAL_COMMENT);
    });
  });

  describe('Syntax Test - JSX', () => {
    it('Single Line Comment', () => {
      const option = {
        params: {
          SAY_HELLO_WORLD: true,
        },
      };

      expect(p.call({ query: option }, C_JSX_SINGLE)).equals(R_JSX_SINGLE);
    });

    it('Multiple Line Comment', () => {
      const option = {
        params: {
          SAY_HELLO_WORLD: false,
        },
      };

      expect(p.call({ query: option }, C_JSX_MULTI)).equals(R_JSX_MULTI);
    });
  });

  describe('Syntax Test - HTML', () => {
    it('Single Line Comment', () => {
      const option = {
        params: {
          SAY_HELLO_WORLD: true,
        },
      };

      expect(p.call({ query: option }, C_HTML_SINGLE)).equals(R_HTML_SINGLE);
    });

    it('Multiple Line Comment', () => {
      const option = {
        params: {
          SAY_HELLO_WORLD: false,
        },
      };

      expect(p.call({ query: option }, C_HTML_MULTI)).equals(R_HTML_MULTI);
    });

    // it.skip('Mixed with Script Tag', () => {

    // });
  });

  describe('Full test', () => {
    const option = {
      debug: false,
      params: {
        stage: 'develop',
      },
    };

    it('Javascript', () => {
      expect(p.call({ query: option }, C_JS)).equals(R_JS);
    });

    it('JSX', () => {
      expect(p.call({ query: option }, C_JSX)).equals(R_JSX);
    });

    it('HTML', () => {
      expect(p.call({ query: option }, C_HTML)).equals(R_HTML);
    });
  });

  describe('Edge Test', () => {
    const option = {
      debug: false,
    };

    it('Directive after the same-line code should be ignored', () => {
      expect(p.call(option, C_EGDE_CODE_BEFORE_DIRECTIVE)).equals(R_EGDE_CODE_BEFORE_DIRECTIVE);
    });

    it('Code after the same-line directive should be ignored', () => {
      expect(p.call(option, C_EDGE_CODE_AFTER_DIRECTIVE)).equals(R_EDGE_CODE_AFTER_DIRECTIVE);
    });

    it('Normal comment after directive should be proceeded correctly', () => {
      expect(p.call(option, C_EDGE_COMMENT_AFTER_DIRECTIVE)).equals(R_EDGE_COMMENT_AFTER_DIRECTIVE);
    });

    describe(`Last line should not be omitted if no new-line char presents as EOF`, () => {
      it(`Single char on the last line`, () => {
        expect(p.call(option, C_EDGE_NO_EOF_SINGLE_CHAR)).equals(R_EDGE_NO_EOF_SINGLE_CHAR);
      });

      it(`Multiple chars on the last line`, () => {
        expect(p.call(option, C_EDGE_NO_EOF_MULTI_CHARS)).equals(R_EDGE_NO_EOF_MULTI_CHARS);
      });

      it(`Comment on the last line`, () => {
        expect(p.call(option, C_EDGE_NO_EOF_COMMENT)).equals(R_EDGE_NO_EOF_COMMENT);
      });
    });
  });
});
