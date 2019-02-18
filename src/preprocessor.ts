import { filter } from './filter';
import { DEFAULT_OPTIONS } from './global';
import { IPrinterOption, printer } from './printer';
import { reader } from './reader';
import { IPreprocessorOption } from './type';

export interface IWebpackLoaderContext {
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
export function preprocessor(this: IWebpackLoaderContext, content: string): string {
    const { directives, params, verbose } = getOptions(this.query);

    const r = reader(content);
    const f = filter(directives, params);
    const p = printer(verbose);

    f.next();
    p.next();

    const o: IPrinterOption = {
        block: '',
        raw: '',
        c_open: '',
        c_close: '',
        is_comment: false,
        is_directive: false,
        is_keep: true,
    };
    for (const reader_state of r) {
        const filter_state = f.next(reader_state).value;
        p.next(Object.assign(o, reader_state, filter_state));
    }

    return p.next({}).value;
}

function getOptions(query: Partial<IPreprocessorOption>): IPreprocessorOption {
    const options: IPreprocessorOption = Object.assign({}, DEFAULT_OPTIONS, query);
    options.directives.debug = options.debug;
    return options;
}
