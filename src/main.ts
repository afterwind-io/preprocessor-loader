interface IParamsMap {
  [key: string]: any;
}

interface IPreprocessorOption {
  params: IParamsMap;
  debug?: boolean;
  raw?: boolean;
  verbose?: boolean;
}

const REGEX_DIRECTIVE = /\s*\/\/\s*#!(\w*)\s?\s*(.*)?/;

const defaultOptions: IPreprocessorOption = {
  // DEBUG模式
  debug: false,
  // 预编译指令集
  params: {},
  // 是否保留预编译信息
  raw: false,
  // 是否输出完整预编译信息
  verbose: false,
};

/**
 * Get the result of the condition defined by "#!if" directive
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
 * The Preprocessor
 *
 * @param {string} content the raw file loaded as string
 */
function preprocessor(content: string) {
  // @ts-ignore
  const params = this.query.params;
  const lines = content.split('\n');

  let ifFlag = true;
  return lines.reduce((result, line, index) => {
    const matchGroup = REGEX_DIRECTIVE.exec(line);
    if (matchGroup !== null) {
      const [, directive, condition] = matchGroup;

      if (directive === 'if') {
        ifFlag = ifComparator(params, condition);
      } else if (directive === 'else') {
        ifFlag = !ifFlag;
      } else if (directive === 'endif') {
        ifFlag = true;
      }

      return result;
    }

    if (ifFlag) {
      const eol = index !== lines.length - 1 ? '\n' : '';
      return result.concat(line + eol);
    } else {
      return result;
    }
  }, '');
}

module.exports.REGEX_DIRECTIVE = REGEX_DIRECTIVE;
module.exports.ifComparator = ifComparator;
module.exports.preprocessor = preprocessor;
