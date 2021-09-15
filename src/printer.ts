import { IFilterResult } from './filter';
import { IReaderResult } from './reader';
import { ExtendedIterableIterator } from './type';

export type IPrinterOption = IReaderResult & IFilterResult;

export function* printer(verbose: boolean): ExtendedIterableIterator<
    string,
    string | undefined,
    IPrinterOption
> {
    let result: string = '';
    let last_c_open = '';
    let last_c_close = '';

    while (true) {
        const {
            eval_result,
            raw,
            c_open,
            c_close,
            is_keep,
            is_directive,
            is_comment,
        } = (yield result)!;

        if (raw === undefined) {
            return result;
        }

        last_c_open = c_open || last_c_open;
        last_c_close = c_close || last_c_close;

        let segment = '';

        if (is_keep) {
            segment = raw;
        } else if (verbose) {
            segment = is_comment || is_directive
                ? raw
                : verbosePrint(last_c_open, last_c_close, raw);
        }

        result = result.concat(segment);
        if (eval_result.length > 0){
            result = result.concat(eval_result.join('\n') + '\n');
        }
    }
}

function verbosePrint(open: string, close: string, block: string): string {
    return `${open} ${block.trim()}${close.trim()}\n`;
}
