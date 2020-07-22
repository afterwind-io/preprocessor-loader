import { IReaderResult } from './reader';
import {
    ExtendedIterableIterator,
    IDirectivesMap,
    IParamsMap,
} from './type';

type IFilterOption = IReaderResult;

export interface IFilterResult {
    is_directive: boolean;
    is_keep: boolean;
}

const REGEX_DIRECTIVE = /#!(\w+)\s*(.*)?/;

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
    let is_keep = true;
    let last_is_keep = false;
    let last_is_directive = false;
    let scope: 'single' | 'multi' | 'skip' = 'single';

    while (true) {
        const { block, is_comment } = (yield {
            is_directive: last_is_directive,
            is_keep: last_is_directive ? false : is_keep,
        })!;

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
    const values = keys.reduce((v, key) => v.concat(params[key]), []);
    const comparator = new Function(...keys, `return ${rawCondition};`);
    return comparator(...values);
}

/**
 * Extract directive and condition from the given content
 *
 * @export
 * @param {string} content
 * @returns {[string, string]} [directive, condition]
 */
export function getDirective(content: string): [string, string] {
    const matchGroup = REGEX_DIRECTIVE.exec(content);
    if (matchGroup !== null) {
        return [matchGroup[1], matchGroup[2] || ''];
    }

    return ['', ''];
}
