const expect = require('chai').expect;
const {
  preprocessor: p,
  REGEX_DIRECTIVE: regex,
  ifComparator,
} = require('../dist/main');
const {
  C_IF_ENDIF,
  R_IF_ENDIF,
  C_IF_ELSE_ENDIF,
  R_IF_ELSE_ENDIF,
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
    it('Test Case - Standard');

    it('Test Case - Only the line exactly below "#!debug" should be processed');
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
        foo: 2,
      },
    };

    it('Test Case - Standard', () => {
      expect(p.call({ query: option }, C_IF_ELSE_ENDIF)).equals(R_IF_ELSE_ENDIF);
    });
  });

  describe('Case Test - #!if | #!elseif | #!endif', () => {
    it('Test Case - Standard');
  });

  describe('Case Test - #!if | #!elseif | #!else | #!endif', () => {
    it('Test Case - Standard');
  });

  describe('Case Test - User Defined Directives', () => {
    it('Test Case - Standard');
  });

  describe('Edge Test', () => {

  });
});
