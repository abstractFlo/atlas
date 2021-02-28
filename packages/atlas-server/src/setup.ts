import alt from 'alt-server';
import { container, instanceCachingFactory } from 'tsyringe';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
import { EventService } from './services/event.service';
import { EventServiceInterface } from '@abstractflo/atlas-shared';

registerAltLib(alt);

container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);

