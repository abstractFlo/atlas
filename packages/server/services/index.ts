import { EventServiceInterface } from '@abstractFlo/shared';
import { container } from 'tsyringe';
import { EventService } from './event.service';

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });

export * from './event.service';
export * from './config.service';
export * from './encryption.service';
export * from './database.service';
