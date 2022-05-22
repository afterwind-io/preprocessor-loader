export type Nullable<T> = T | null;

/**
 * A collection of user-defined params.
 */
export interface IParamsMap {
  [key: string]: any;
}

/**
 * A collection of user-defined directives.
 */
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
   * Values for built-in directives
   */
  params: IParamsMap;
  /**
   * Should keep all lines (omitted code as comment)
   */
  verbose: boolean;
}
