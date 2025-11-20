declare global {
  interface URLPatternInit {
    protocol?: string;
    username?: string;
    password?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
    hash?: string;
    baseURL?: string;
  }

  interface URLPatternResult {
    inputs: Array<string | URL | URLPatternInit>;
    protocol: URLPatternComponentResult;
    username: URLPatternComponentResult;
    password: URLPatternComponentResult;
    hostname: URLPatternComponentResult;
    port: URLPatternComponentResult;
    pathname: URLPatternComponentResult;
    search: URLPatternComponentResult;
    hash: URLPatternComponentResult;
  }

  /**
   * В тайпскрипт нет поддержки недавно вышедшего класса URLPattern.
   * По этому типизация взять из {@link  https://developer.mozilla.org/en-US/docs/Web/API/URLPattern|документации MDN}
   */
  class URLPattern {
    constructor(init: URLPatternInit, base?: string);
    /**
     * A string containing a pattern to match the hash part of a URL.
     */
    readonly hash: string;
    /**
     * A boolean indicating whether or not any of the URLPattern components contain regular expression capturing groups.
     */
    readonly hasRegExpGroups: boolean;

    /**
     * A string containing a pattern to match the hostname part of a URL.
     */
    readonly hostname: string;

    /**
     * A string containing a pattern to match the password part of a URL.
     */
    readonly password: string;

    /**
     * A string containing a pattern to match the pathname part of a URL.
     */
    readonly pathname: string;

    /**
     * A string containing a pattern to match the port part of a URL.
     */
    readonly port: string;

    /**
     * A string containing a pattern to match the protocol part of a URL.
     */
    readonly protocol: string;

    /**
     * A string containing a pattern to match the search part of a URL.
     */
    readonly search: string;

    /**
     * A string containing a pattern to match the username part of a URL.
     */
    readonly username: string;

    /**
     * Returns true if the URL matches the given pattern, false otherwise.
     */
    test(input: string | URL): boolean;

    /**
     * Returns an object with the matched parts of the URL or null if the URL does not match.
     */
    exec(input: string | URL | URLPatternInit): URLPatternResult | null;
  }
}
export {};
