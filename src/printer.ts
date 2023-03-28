import { PlainTextFilter } from "./filter";
import { parse } from "./parser";
import { reader } from "./reader";
import { IDirectivesMap, IParamsMap, IVerboseOption } from "./type";

export const COMMENT_TAG_PLACEHOLDER = "@@";

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
  verbose: boolean | IVerboseOption
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
      const { c_open, c_close } = block;

      if (isDirective) {
        lastCommentOpen = c_open || lastCommentOpen;
        lastCommentClose = c_close || lastCommentClose;

        segment = raw;
      } else if (isComment) {
        const escapeComments = !!(verbose as IVerboseOption).escapeComments;
        if (escapeComments) {
          const comment = raw
            .replace(c_open!, COMMENT_TAG_PLACEHOLDER)
            .replace(c_close!, COMMENT_TAG_PLACEHOLDER);

          segment = transformComment(comment, (line) =>
            verbosePrint(lastCommentOpen, lastCommentClose, line)
          );
        } else {
          const padding = Array.from({ length: lastCommentOpen.length + 1 })
            .fill(" ")
            .join("");
          segment = transformComment(raw, (line) => padding + line + "\n");
        }
      } else {
        segment = verbosePrint(lastCommentOpen, lastCommentClose, raw);
      }
    }
    result += segment;
  }

  return result;
}

function transformComment(
  comment: string,
  lineTransformer: (line: string) => string
): string {
  // Comment may contain multiple lines
  const lines = comment.trimRight().split("\n");
  return lines.map(lineTransformer).join("");
}

function verbosePrint(open: string, close: string, content: string): string {
  return `${open} ${content.trimRight()}${close.trim()}\n`;
}
