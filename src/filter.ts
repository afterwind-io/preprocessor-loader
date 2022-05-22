import { IBlock } from "./parser";
import { IDirectivesMap, IParamsMap } from "./type";

interface IFilterResult {
  /**
   * Should preserve the current block
   */
  preserve: boolean;
  /**
   * The next filter to proceed
   */
  filter: IFilter;
}

interface IFilter {
  /**
   * Process the text block and decides if it should be omitted or not.
   *
   * @param block a block of pre-processed text
   * @param directives the collection of user-defined directives
   * @param params the collection of user-defined params
   */
  next(
    block: IBlock,
    directives: IDirectivesMap,
    params: IParamsMap
  ): IFilterResult;
}

/**
 * The filter for top-level, non-directive-related code.
 *
 * Mainly for top-level directive detecting and branching.
 */
export class PlainTextFilter implements IFilter {
  public next(
    block: IBlock,
    directives: IDirectivesMap,
    params: IParamsMap
  ): IFilterResult {
    const { isDirective, directive, condition } = block;

    if (!isDirective) {
      return { preserve: true, filter: this };
    }

    if ("if" === directive) {
      return {
        preserve: false,
        filter: new ConditionFilter(
          ifComparator(params, condition),
          false,
          this
        ),
      };
    }

    if (
      "else" === directive ||
      "elseif" === directive ||
      "endif" === directive
    ) {
      // TODO Better warning info
      const message =
        "[webpack-preprocessor-loader] " +
        `Found a top-level "#!${directive}" but missing a leading "#!if".` +
        "```" +
        `${block.raw}` +
        "```";
      throw new Error(message);
    }

    return {
      preserve: false,
      filter: new DirectiveFilter(!!directives[directive], this),
    };
  }
}

/**
 * A quick filter for user-defined directives.
 *
 * Only care about the very next line under the directive declaration,
 * and output only if the directive for the current line is true.
 */
class DirectiveFilter implements IFilter {
  public constructor(
    /**
     * Is the directive of the current block true
     */
    private isTrue: boolean = false,
    /**
     * Reference to the previous filter
     */
    private parent: IFilter
  ) {}

  public next(): IFilterResult {
    return { preserve: this.isTrue, filter: this.parent };
  }
}

/**
 * The filter for if-conditions.
 */
class ConditionFilter implements IFilter {
  public constructor(
    /**
     * Has the current block met its condition.
     */
    private isTrue: boolean,
    /**
     * Has any previous if-block already met its condition
     *
     * There may be multiple branches in an if-clause, so we need a flag
     * to indicate if one of them has met its condition. If one is *fulfilled*,
     * then following if-blocks and their nested blocks should be skipped
     */
    private isFulFilled: boolean,
    /**
     * Reference to the previous filter
     */
    private parent: IFilter
  ) {}

  public next(
    block: IBlock,
    directives: IDirectivesMap,
    params: IParamsMap
  ): IFilterResult {
    const { isDirective, directive, condition } = block;
    const { isFulFilled, isTrue } = this;

    if ("endif" === directive) {
      return { preserve: false, filter: this.parent };
    }

    if ("else" === directive) {
      this.isTrue = !isTrue;
      this.isFulFilled = isFulFilled || isTrue;

      return {
        preserve: false,
        filter: this,
      };
    }

    if ("elseif" === directive) {
      this.isTrue = isFulFilled ? false : ifComparator(params, condition);
      this.isFulFilled = isFulFilled || isTrue;

      return {
        preserve: false,
        filter: this,
      };
    }

    if ("if" === directive) {
      return {
        preserve: false,
        filter: new ConditionFilter(
          isFulFilled ? false : ifComparator(params, condition),
          isFulFilled || !isTrue,
          this
        ),
      };
    }

    if (isDirective) {
      return {
        preserve: false,
        filter: new DirectiveFilter(
          !isFulFilled && isTrue && !!directives[directive],
          this
        ),
      };
    }

    return { preserve: !isFulFilled && isTrue, filter: this };
  }
}

/**
 * Get the result of the condition defined by "#!if" / "#!elseif" directive
 *
 * @param {IParamsMap} params values needed
 * @param {string} rawCondition the origin condition string
 * @returns {boolean} result
 */
export function ifComparator(
  params: IParamsMap,
  rawCondition: string
): boolean {
  const keys = Object.keys(params);
  const values = keys.map((key) => params[key]);
  const comparator = new Function(...keys, `return ${rawCondition};`);
  return !!comparator(...values);
}
