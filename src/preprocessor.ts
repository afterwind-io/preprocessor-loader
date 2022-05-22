import { DEFAULT_OPTIONS } from "./global";
import { print } from "./printer";
import { IPreprocessorOption } from "./type";

interface IWebpackLoaderContext {
  query: IPreprocessorOption;
}

/**
 * The preprocessor
 *
 * @export
 * @param {IWebpackLoaderContext} this webpack loader context
 * @param {string} content raw text file
 * @returns {string}
 */
export function preprocessor(
  this: IWebpackLoaderContext,
  content: string
): string {
  const { directives, params, verbose } = getOptions(this.query);
  return print(content, directives, params, verbose);
}

function getOptions(query: Partial<IPreprocessorOption>): IPreprocessorOption {
  const options: IPreprocessorOption = Object.assign(
    {},
    DEFAULT_OPTIONS,
    query
  );
  options.directives.debug = options.debug;
  return options;
}
