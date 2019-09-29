import { Nullable } from './type';

export interface IReaderResult {
    is_comment: boolean;
    raw: string;
    block: string;
    c_open: Nullable<string>;
    c_close: Nullable<string>;
}

interface ICommentHeadIndex {
    [head: string]: {
        [len: number]: string[];
        max_length: number;
    };
}

interface ICommentOpenClosePair {
    [open: string]: string;
}

const head_index: ICommentHeadIndex = {
    '/': {
        2: ['/*', '//'],
        max_length: 2,
    },
    '{': {
        3: ['{/*'],
        max_length: 3,
    },
    '<': {
        4: ['<!--'],
        max_length: 4,
    },
};

const open_close_pair: ICommentOpenClosePair = {
    '/*': '*/',
    '//': '\n',
    '{/*': '*/}',
    '<!--': '-->',
};

export function* reader(content: string): IterableIterator<IReaderResult> {
    const len = content.length;

    if (len === 0) {
        return null;
    }

    let is_eof = false;
    let ptr = -1;
    let char = '';
    let block = '';
    let raw = '';
    let current_open = '';
    let current_close = '';
    let in_new_comment = false;
    let skip_to_next_line = false;

    while (++ptr < len) {
        is_eof = ptr === len - 1;
        char = content[ptr];
        raw = raw.concat(char);

        if (skip_to_next_line) {
            /**
             * NOTE:
             * If file ends without a new-line char,
             * the last line will be directly omitted.
             *
             * See Issue: https://github.com/afterwind-io/preprocessor-loader/issues/4
             */
            if (isNewLine(char) || is_eof) {
                yield {
                    is_comment: false,
                    raw,
                    block: '',
                    c_open: null,
                    c_close: null,
                };

                raw = '';
                skip_to_next_line = false;
            }
            continue;
        }

        if (!in_new_comment) {
            if (isWhitespace(char)) {
                continue;
            }

            if (isNewLine(char)) {
                yield {
                    is_comment: false,
                    raw,
                    block: '',
                    c_open: null,
                    c_close: null,
                };

                raw = '';
                continue;
            }

            const open = getCommentOpen(char, ptr, content);
            if (!open) {
                skip_to_next_line = true;
                continue;
            } else {
                current_open = open;
                current_close = open_close_pair[open];

                in_new_comment = true;
                raw = raw.slice(0, -1).concat(current_open);
                block = '';
                ptr += open.length - 1;
            }
        } else {
            const look_ahead = content.slice(ptr, ptr + current_close.length);

            if (look_ahead === current_close) {
                let tail = '';
                let offset = 0;

                if (!isNewLine(current_close)) {
                    [tail, offset] = getContentTillNextNewline(content, ptr + current_close.length);
                }

                yield {
                    is_comment: true,
                    raw: raw.slice(0, -1).concat(look_ahead, tail),
                    block,
                    c_open: current_open,
                    c_close: current_close,
                };

                raw = '';
                in_new_comment = false;
                ptr += look_ahead.length + offset - 1;
            } else {
                block = block.concat(char);
            }
        }
    }

    return null;
}

function isWhitespace(char: string) {
    return char === ' ' || char === '\t';
}

function isNewLine(char: string) {
    return char === '\n';
}

function getCommentOpen(char: string, ptr: number, content: string): Nullable<string> {
    const index = head_index[char];
    if (!index) {
        return null;
    }

    let len = 0;
    while (len++ < index.max_length) {
        if (!index[len]) {
            continue;
        }

        const matches = index[len];
        const open = content.slice(ptr, ptr + len);
        if (matches.includes(open)) {
            return open;
        }

        continue;
    }

    return null;
}

function getContentTillNextNewline(content: string, ptr: number): [string, number] {
    const index = content.slice(ptr).indexOf('\n') + 1;
    return [content.slice(ptr, ptr + index), index];
}
