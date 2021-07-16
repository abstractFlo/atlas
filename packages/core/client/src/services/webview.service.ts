import { Singleton } from '@abstractflo/atlas-shared';
import { WebView } from 'alt-client';

@Singleton
export class WebviewService {

	public url: string;

	protected routeToEventName: string = 'routeTo';
	private webView: WebView;

	public getInstance(): WebView {
		return this.webView;
	}

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
