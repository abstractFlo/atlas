import { container, instanceCachingFactory } from 'tsyringe';
import { EventService } from './services';
import { EventServiceInterface } from '@abstractflo/atlas-shared';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
import alt from 'alt-client';

registerAltLib(alt);

// Register needed classes inside di-container
container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);
