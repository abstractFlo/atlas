import { container, instanceCachingFactory } from 'tsyringe';
import { EventService } from './services/event.service';
import { EventServiceInterface } from '@abstractflo/atlas-shared';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
import alt from 'alt-server';

registerAltLib(alt);

container.register<EventServiceInterface>(
    'EventService',
    { useFactory: instanceCachingFactory(c => c.resolve(EventService)) }
);

