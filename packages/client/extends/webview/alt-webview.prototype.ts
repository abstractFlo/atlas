import { WebviewInterface } from './webview.interface';
import { WebView } from 'alt-client';
import { container } from 'tsyringe';

declare module 'alt-client' {
  export interface WebView extends WebviewInterface {}
}

WebView.prototype.routeTo = (route: string, ...args: any[]) => {
  const webview = container.resolve<WebView>('alt.Webview');
  const routeToEventName = container.resolve<string>('alt.webview.routeTo.eventName');
  webview.emit(routeToEventName, route, ...args);
};


