import { WebviewInterface } from './webview.interface';
import { WebView } from 'alt-client';
import { container } from 'tsyringe';
import { WebviewService } from '../../services/webview.service';

declare module 'alt-client' {
  export interface WebView extends WebviewInterface {}
}

WebView.prototype.routeTo = (route: string, ...args: any[]) => {
  const webviewService = container.resolve(WebviewService);
  webviewService.routeTo(route, ...args);
};
