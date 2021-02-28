import { container } from 'tsyringe';
import { PlayerWorker } from './worker/player.worker';
import { EventServiceInterface, LoaderService } from '@abstractflo/atlas-shared';
import { EventService, KeyEventService, WebviewService } from './services';


container.resolve(PlayerWorker);
const loaderService = container.resolve(LoaderService);

container.register<EventServiceInterface>('EventService', { useValue: container.resolve(EventService) });

container.afterResolution(KeyEventService, () => {
  loaderService.add('afterBootstrap', 'autoStart', 'KeyEventService');
}, { frequency: 'Once' });

container.afterResolution(WebviewService, () => {
  loaderService.add('before', 'autoStart', 'WebviewService');
}, { frequency: 'Once' });

