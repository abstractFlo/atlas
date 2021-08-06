import { Singleton } from '@abstractflo/atlas-shared';
import { WebView } from 'alt-client';

@Singleton
export class WebviewService {

  /**
   * Url for webview
   *
   * @type {string}
   */
  public url: string;

  /**
   * Route name event if the webview is an spa
   * @type {string}
   * @protected
   */
  protected routeToEventName: string = 'routeTo';

  /**
   * Contains the webview instance
   *
   * @type {WebView}
   * @private
   */
  private webView: WebView;

  /**
   * Return the webview instance
   *
   * @return {WebView}
   */
  public getInstance(): WebView {
    return this.webView;
  }

  /**
   * Start the webview instance
   *
   * @return {Promise<WebView | Error>}
   */
  public start(): Promise<WebView | Error> {
    return new Promise((resolve, reject) => {
      if (!this.url) {
        reject(new Error('No route defined'));
      }

      this.webView = new WebView(this.url, false);

      this.webView.on('load', () => {
        resolve(this.webView);
      });
    });
  }
}
