import { container, instanceCachingFactory } from 'tsyringe';
import { EventServiceInterface } from '@abstractflo/atlas-shared';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
import alt from 'alt-client';
import { EventService } from './services/event.service';

registerAltLib(alt);

// Register needed classes inside di-container
container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);
