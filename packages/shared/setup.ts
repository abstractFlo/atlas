import { container } from 'tsyringe';
import { CommandService, LoaderService } from './services';

const loaderService = container.resolve(LoaderService);

container.afterResolution('EventService', () => {
  loaderService.add('afterBootstrap', 'autoStart', 'EventService');
}, { frequency: 'Once' });

container.afterResolution(CommandService, () => {
  loaderService.add('afterBootstrap', 'autoStart', 'CommandService');
}, { frequency: 'Once' });
