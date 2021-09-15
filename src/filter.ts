import { IReaderResult } from './reader';
import {
    ExtendedIterableIterator,
    IDirectivesMap,
    IParamsMap,
    EvalResult,
} from './type';

type IFilterOption = IReaderResult;

export interface IFilterResult {
    eval_result: EvalResult;
    is_directive: boolean;
    is_keep: boolean;
}

const REGEX_DIRECTIVE = /#!(\w+)\s*(.*)?/;
const REGEX_DIRECTIVE_EVAL = /#!(\w+)\s*(\S[\s\S]*)?/;

/**
 * State machine for if-else and other directives,
 * to determine whether to keep the given block or not
 *
 * @example
 * const s = state();
 * const block: string = '';
 * const flag = s.next(block).value;
 *
 * @export
 * @param {IDirectivesMap} directives custom directive map
 * @param {IParamsMap} params values for custom directives
 * @returns {IterableIterator<IFilterResult>} the flag indicates the inner state of filter
 */
export function* filter(
    directives: IDirectivesMap,
    params: IParamsMap
): ExtendedIterableIterator<
    IFilterResult,
    IFilterResult | undefined,
    IFilterOption
> {
    let eval_result: EvalResult = [];
    let is_keep = true;
    let last_is_keep = false;
    let last_is_directive = false;
    let scope: 'single' | 'multi' | 'skip' = 'single';

    while (true) {
        const { block, is_comment } = (yield {
            eval_result,
            is_directive: last_is_directive,
            is_keep: last_is_directive ? false : is_keep,
        })!;

        eval_result = [];

        let is_directive = false;
        let directive = '';
        let condition = '';
        if (is_comment) {
            [directive, condition] = getDirective(block);
            is_directive = directive !== '';
        } else {
            is_directive = false;
        }

        if (is_directive) {
            if (directive === 'if') {
                is_keep = ifComparator(params, condition);
                scope = is_keep ? 'skip' : 'multi';
            } else if (directive === 'elseif') {
                if (scope !== 'skip') {
                    is_keep = ifComparator(params, condition);
                    scope = is_keep ? 'skip' : 'multi';
                } else {
                    is_keep = false;
                }
            } else if (directive === 'else') {
                if (scope !== 'skip') {
                    is_keep = !is_keep;
                    scope = is_keep ? 'skip' : 'multi';
                } else {
                    is_keep = false;
                }
            } else if (directive === 'endif') {
                is_keep = true;
                scope = 'single';
            } else if (directive === 'eval') {
                is_keep = true;
                scope = 'single';

                eval_result = doEval(params, condition);
            } else {
                is_keep = !!directives[directive as string];
                scope = 'single';
            }

            last_is_keep = is_keep;
        } else {
            if (last_is_directive) {
                is_keep = last_is_keep;
            } else
                if (!is_keep) {
                    is_keep = scope === 'single';
                }
        }

        last_is_directive = is_directive;
    }
}

/**
 * Get the result of the condition defined by "#!if" / "#!elseif" directive
 *
 * @param {IParamsMap} params values needed
 * @param {string} rawCondition the origin condition string
 * @returns {boolean} result
 */
export function ifComparator(params: IParamsMap, rawCondition: string): boolean {
    const keys = Object.keys(params);
    const values = keys.map((key) => params[key]);
    const comparator = new Function(...keys, `return ${rawCondition};`);
    return comparator(...values);
}

/**
 * Get the result of the code defined by "#!eval" directive
 *
 * @param {IParamsMap} params values needed
 * @param {string} code the origin code string
 * @returns {EvalResult} result
 */
export function doEval(params: IParamsMap, code: string): EvalResult {
    const keys = Object.keys(params);
    const values = keys.map((key) => params[key]);
    const fun = new Function(...keys, code.indexOf('return ') == -1 ? `return ${code};` : code);
    let ret = fun(...values);
    if (!ret) {
        return [];
    }
    return typeof ret === 'string' ? [ret] : ret;
}

/**
 * Extract directive and condition from the given content
 *
 * @export
 * @param {string} content
 * @returns {[string, string]} [directive, condition]
 */
export function getDirective(content: string): [string, string] {
    let matchGroup = REGEX_DIRECTIVE.exec(content);
    if (matchGroup !== null) {
        if (matchGroup[1] == 'eval') {
            matchGroup = REGEX_DIRECTIVE_EVAL.exec(content);
        }
    }
    if (matchGroup !== null) {
        return [matchGroup[1], matchGroup[2] || ''];
    }

    return ['', ''];
}
