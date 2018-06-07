interface IParamsMap {
  [key: string]: any;
}

interface IDirectivesMap {
  [key: string]: boolean;
}

interface IPreprocessorOption {
  /**
   * debug mode
   */
  debug: boolean;
  /**
   * Custom Directives
   */
  directives: IDirectivesMap;
  /**
   * values for buildin directives
   */
  params: IParamsMap;
  /**
   * is keep all lines (deleted code as comment)
   */
  verbose: boolean;
}

const REGEX_DIRECTIVE = /\s*#!(\w+)\s*(.*)?/;

const DEFAULT_OPTIONS: IPreprocessorOption = {
  debug: false,
  directives: {},
  params: {},
  verbose: false,
};

function getOptions(query: any): IPreprocessorOption {
  return Object.assign({}, DEFAULT_OPTIONS, query);
}

/**
 * Get the result of the condition defined by "#!if" / "#!elseif" directive
 *
 * @param {IParamsMap} params values needed
 * @param {string} rawCondition the origin condition string
 * @returns {boolean} result
 */
function ifComparator(params: IParamsMap, rawCondition: string): boolean {
  const keys = Object.keys(params);
  const values = keys.reduce((v, key) => v.concat(params[key]), []);
  const comparator = new Function(...keys, `return ${rawCondition};`);
  return comparator(...values);
}

/**
 * Strip comment from the line
 *
 * @param {string} line raw ling string
 * @returns {string} result
 */
function stripComment(line: string): string {
  return line.replace(/({?\/\*)|(\*\/}?)|(\/\/)/g, '');
}

/**
 * The Preprocessor
 *
 * @param {string} content the raw file loaded as string
 */
function preprocessor(content: string) {
  // @ts-ignore
  const { debug, params, directives, verbose } = getOptions(this.query);
  const lines = content.split('\n');

  let isKeep = true;
  let scope: 'single' | 'multi' | 'skip' = 'single';
  return lines.reduce((result, line, index) => {
    const eol = index !== lines.length - 1 ? '\n' : '';

    const matchGroup = REGEX_DIRECTIVE.exec(stripComment(line));
    if (matchGroup !== null) {
      const [, directive, condition] = matchGroup;

      if (directive === 'if') {
        isKeep = ifComparator(params, condition);
        scope = isKeep ? 'skip' : 'multi';
      } else if (directive === 'elseif') {
        if (scope !== 'skip') {
          isKeep = ifComparator(params, condition);
          scope = isKeep ? 'skip' : 'multi';
        } else {
          isKeep = false;
        }
      } else if (directive === 'else') {
        if (scope !== 'skip') {
          isKeep = !isKeep;
          scope = isKeep ? 'skip' : 'multi';
        } else {
          isKeep = false;
        }
      } else if (directive === 'endif') {
        isKeep = true;
        scope = 'single';
      } else if (directive === 'debug') {
        isKeep = debug;
        scope = 'single';
      } else {
        isKeep = !!directives[directive];
        scope = 'single';
      }

      return verbose ? result.concat(line + eol) : result;
    }

    if (isKeep) {
      return result.concat(line + eol);
    } else {
      isKeep = scope === 'single';

      return verbose ? result.concat(`/* ${line} */${eol}`) : result;
    }
  }, '');
}

module.exports = {
  REGEX_DIRECTIVE,
  ifComparator,
  preprocessor,
  stripComment,
};
