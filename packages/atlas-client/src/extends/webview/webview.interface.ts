export interface WebviewInterface {
  /**
   * Simple method for webview routing
   *
   * @param {string} route
   * @param args
   */
  routeTo(route: string, ...args: any[]): void;
}
