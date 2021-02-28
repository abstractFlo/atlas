import './setup';
import { container } from 'tsyringe';
import { ConfigService } from './services/config.service';
container.resolve(ConfigService);


// All exports
export * from './decorators/event.decorator';

export * from './services/config.service';
export * from './services/database.service';
export * from './services/event.service';

export * from './extends/colshape/alt-colshape.prototype';
export * from './extends/player/alt-player.prototype';



