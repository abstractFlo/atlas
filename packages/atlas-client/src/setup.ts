import { container, instanceCachingFactory } from 'tsyringe';
import { EventService } from './services';
import { EventServiceInterface } from '@abstractflo/atlas-shared';

// Register needed classes inside di-container
container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);
