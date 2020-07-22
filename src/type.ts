export type Nullable<T> = T | null;

export interface IParamsMap {
    [key: string]: any;
}

export interface IDirectivesMap {
    [key: string]: boolean;
}

export interface IPreprocessorOption {
    /**
     * debug mode
     */
    debug: boolean;
    /**
     * Custom Directives
     */
    directives: IDirectivesMap;
    /**
     * values for buildin directives
     */
    params: IParamsMap;
    /**
     * whether keep all lines (deleted code as comment)
     */
    verbose: boolean;
}

export interface ExtendedIterableIterator<T, TReturn, TNext>
    extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): ExtendedIterableIterator<T, TReturn, TNext>;
}
