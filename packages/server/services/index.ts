import { EventServiceInterface } from '@abstractFlo/shared';
import { container, InjectionToken } from 'tsyringe';
import { EventService } from './event.service';
import { DatabaseService } from './database.service';

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });
container.afterResolution(DatabaseService, (_: InjectionToken<DatabaseService>, service: DatabaseService) => {
  service.isConnected().subscribe();
}, { frequency: 'Once' });


export * from './event.service';
export * from './config.service';
export * from './encryption.service';
export * from './database.service';
