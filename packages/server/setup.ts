import { container } from 'tsyringe';
import { EventServiceInterface, LoaderService } from '@abstractFlo/shared';
import { DiscordApiService, DiscordBotService } from './modules';
import { EventService } from './services';
import { ExpressServer } from './modules/discord/express.server';

const loader = container.resolve(LoaderService);

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });
container.register('ExpressServer', { useValue: container.resolve(ExpressServer) });

container.afterResolution(DiscordBotService, () => {
  loader.add('before', 'autoStart', 'DiscordBotService');
}, { frequency: 'Once' });

container.afterResolution(DiscordApiService, () => {
  loader.add('after', 'autoStart', 'ExpressServer');
}, { frequency: 'Once' });
