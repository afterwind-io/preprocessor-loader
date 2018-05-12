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
declare const REGEX_DIRECTIVE: RegExp;
declare const DEFAULT_OPTIONS: IPreprocessorOption;
declare function getOptions(query: any): IPreprocessorOption;
/**
 * Get the result of the condition defined by "#!if" directive
 *
 * @param {IParamsMap} params values needed
 * @param {string} rawCondition the origin condition string
 * @returns {boolean} result
 */
declare function ifComparator(params: IParamsMap, rawCondition: string): boolean;
/**
 * The Preprocessor
 *
 * @param {string} content the raw file loaded as string
 */
declare function preprocessor(content: string): string;
