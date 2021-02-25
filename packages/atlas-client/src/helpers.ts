import { container } from 'tsyringe';

/**
 * Register webview url and routeToEventName
 * @param {string} url
 * @param {string} routeToEventName
 */
export function registerWebview(url: string, routeToEventName: string): void {
  container.register<string>('alt.webview.url', { useValue: url });
  container.register<string>('alt.webview.routeTo.eventName', { useValue: routeToEventName });
}
