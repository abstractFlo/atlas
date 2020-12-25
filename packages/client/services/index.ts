import { container } from 'tsyringe';
import { EventServiceInterface } from '@abstractFlo/shared';
import { EventService } from './event.service';

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });
export * from './event.service';
export * from './webview.service';
