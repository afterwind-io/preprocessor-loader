import { IReaderResult } from "./reader";

/**
 * A struct describes the content and other attributes of a chunk of text
 * for conditional filtering.
 * 
 * **May** contains multiple lines.
 */
export interface IBlock {
  /**
   * The whole text without comment mark.
   */
  block: string;
  /**
   * Indicates whether the block is a comment.
   */
  isComment: boolean;
  /**
   * Indicates whether the block contains a directive.
   */
  isDirective: boolean;
  /**
   * The directive in the block. If none, presents as empty string.
   */
  directive: string;
  /**
   * The condition expression for the directive. If none, presents as empty string.
   */
  condition: string;
  /**
   * The raw text of the block.
   */
  raw: string;
}

/**
 * Convert raw result from basic reader to `IBlock` presentation.
 * 
 * @param info Result object from reader
 * @returns
 */
export function parse(info: IReaderResult): IBlock {
  const { is_comment, raw, block } = info;

  let isDirective = false;
  let directive = "";
  let condition = "";
  if (is_comment) {
    [directive, condition] = getDirective(block);
    isDirective = directive !== "";
  } else {
    isDirective = false;
  }

  return {
    block,
    condition,
    directive,
    isComment: is_comment,
    isDirective,
    raw,
  };
}

const REGEX_DIRECTIVE = /#!(\w+)\s*(.*)?/;
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
    return [matchGroup[1], matchGroup[2] || ""];
  }

  return ["", ""];
}
