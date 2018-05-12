const expect = require('chai').expect;
const {
  preprocessor: p,
  REGEX_DIRECTIVE: regex,
  ifComparator,
} = require('../dist/main');
const {
  C_DEBUG,
  R_DEBUG,
  C_DEBUG_SINGLE,
  R_DEBUG_SINGLE,
  C_IF_ENDIF,
  R_IF_ENDIF,
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
  C_VERBOSE,
  R_VERBOSE,
} = require('./case');

describe('Preprocessor-Loader Test', () => {

  describe('Unit Test - Directive Extraction Regex', () => {
    it('Test case - Directive Only', () => {
      const line = '// #!debug';
      const [, directive, condition] = regex.exec(line);

      expect(directive).equals('debug');
      expect(condition).equals(undefined);
    });

    it('Test case - No Space between Directive and Comment Slashs', () => {
      const line = '//#!debug';
      const [, directive, condition] = regex.exec(line);

      expect(directive).equals('debug');
      expect(condition).equals(undefined);
    });

    it('Test case - Several Spaces between Directive and Comment Slashs', () => {
      const line = '//   #!debug';
      const [, directive, condition] = regex.exec(line);

      expect(directive).equals('debug');
      expect(condition).equals(undefined);
    });

    it('Test case - Directive with condition', () => {
      const line = '// #!if foo === 1';
      const [, directive, condition] = regex.exec(line);

      expect(directive).equals('if');
      expect(condition).equals('foo === 1');
    });

    it('Test case - Directive with condition, Several Spaces between Directive and Condition', () => {
      const line = '// #!if   foo === 1';
      const [, directive, condition] = regex.exec(line);

      expect(directive).equals('if');
      expect(condition).equals('foo === 1');
    });
  });

  describe('Unit Test - ifComparator', () => {
    const simpleParams = {
      foo: 1,
    };
    const complexParams = {
      foo: 1,
      bar: 2,
    };

    it('Test Case - Single Condition', () => {
      expect(ifComparator(simpleParams, 'foo === 1')).equals(true);
    });

    it('Test Case - Compound Condition', () => {
      expect(ifComparator(complexParams, 'foo === 1 && bar === 1')).equals(false);
    });
  });

  describe('Case Test - #!debug', () => {
    const option = {
      debug: false,
    };

    it('Test Case - Standard', () => {
      expect(p.call({ query: option }, C_DEBUG)).equals(R_DEBUG);
    });

    it('Test Case - Only the line exactly below "#!debug" should be processed', () => {
      expect(p.call({ query: option }, C_DEBUG_SINGLE)).equals(R_DEBUG_SINGLE);
    });
  });

  describe('Case Test - #!if | #!endif', () => {
    const option = {
      params: {
        foo: 1,
      },
    };

    it('Test Case - Standard', () => {
      expect(p.call({ query: option }, C_IF_ENDIF)).equals(R_IF_ENDIF);
    });
  });

  describe('Case Test - #!if | #!else | #!endif', () => {
    const option = {
      params: {
        foo: 1,
      },
    };

    it('Test Case - Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSE_ENDIF)).equals(R_IF_ELSE_ENDIF_1);
    });

    it('Test Case - Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSE_ENDIF)).equals(R_IF_ELSE_ENDIF_2);
    });
  });

  describe('Case Test - #!if | #!elseif | #!endif', () => {
    const option = {
      params: {
        foo: 1,
        bar: 2,
      },
    };

    it('Test Case - Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSEIF_ENDIF)).equals(R_IF_ELSEIF_ENDIF_1);
    });

    it('Test Case - Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ENDIF)).equals(R_IF_ELSEIF_ENDIF_2);
    });
  });

  describe('Case Test - #!if | #!elseif | #!else | #!endif', () => {
    const option = {
      params: {
        foo: 1,
        bar: 1,
      },
    };

    it('Test Case - Standard - 1', () => {
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_1);
    });

    it('Test Case - Standard - 2', () => {
      option.params.foo = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_2);
    });

    it('Test Case - Standard - 3', () => {
      option.params.bar = 2;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_3);
    });

    it('Test Case - Standard - 4', () => {
      option.params.bar = 3;
      expect(p.call({ query: option }, C_IF_ELSEIF_ELSE_ENDIF)).equals(R_IF_ELSEIF_ELSE_ENDIF_4);
    });
  });

  describe('Case Test - Custom Directives', () => {
    const option = {
      directives: {
        doge: false,
        kitty: true,
      },
    };

    it('Test Case - Standard', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES)).equals(R_CUSTOM_DIRECTIVES);
    });

    it('Test Case - Only the line exactly below the directive should be processed', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES_SINGLE)).equals(R_CUSTOM_DIRECTIVES_SINGLE);
    });

    it('Test Case - Multiple Custom Directives', () => {
      expect(p.call({ query: option }, C_CUSTOM_DIRECTIVES_MULTI)).equals(R_CUSTOM_DIRECTIVES_MULTI);
    });
  });

  describe('Case Test - Options', () => {
    it('Test Case - "verbose"', () => {
      const option = {
        params: {
          foo: 2,
        },
        verbose: true,
      };

      expect(p.call({ query: option }, C_VERBOSE)).equals(R_VERBOSE);
    });
  });

  describe('Edge Test', () => {

  });
});
