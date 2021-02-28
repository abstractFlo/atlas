import alt from 'alt-client';
import { container, instanceCachingFactory } from 'tsyringe';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
import { EventServiceInterface } from '@abstractflo/atlas-shared';
import { EventService } from './services/event.service';

registerAltLib(alt);

// Register needed classes inside di-container
container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);
