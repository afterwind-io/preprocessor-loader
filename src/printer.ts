import { PlainTextFilter } from "./filter";
import { parse } from "./parser";
import { reader } from "./reader";
import { IDirectivesMap, IParamsMap } from "./type";

/**
 * The main entrance to dealt with code processing.
 *
 * @param code raw text input
 * @param directives the collection of user-defined directives
 * @param params the collection of user-defined params
 * @param verbose should output omitted lines
 * @returns the processed code
 */
export function print(
  code: string,
  directives: IDirectivesMap,
  params: IParamsMap,
  verbose: boolean
): string {
  let result: string = "";
  let lastCommentOpen = "";
  let lastCommentClose = "";
  let filter = new PlainTextFilter();

  for (const block of reader(code)) {
    const blockInfo = parse(block);

    const { preserve, filter: nextFilter } = filter.next(
      blockInfo,
      directives,
      params
    );
    filter = nextFilter;

    const { raw, isComment, isDirective } = blockInfo;
    let segment = "";
    if (preserve) {
      segment = raw;
    } else if (verbose) {
      if (isDirective) {
        const { c_open, c_close } = block;
        lastCommentOpen = c_open || lastCommentOpen;
        lastCommentClose = c_close || lastCommentClose;

        segment = raw;
      } else {
        segment = verbosePrint(lastCommentOpen, lastCommentClose, raw);
      }
    }
    result += segment;
  }

  return result;
}

function verbosePrint(open: string, close: string, block: string): string {
  return `${open} ${block.trim()}${close.trim()}\n`;
}
