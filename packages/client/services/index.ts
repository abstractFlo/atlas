import { container } from 'tsyringe';
import { EventServiceInterface } from '@abstractFlo/shared';
import { EventService } from './event.service';
import { WebView } from 'alt-client';
import { WebviewService } from './webview.service';

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });
container.register<WebView>('Webview', {useValue: container.resolve(WebviewService).webview})

export * from './event.service';
export * from './webview.service';
