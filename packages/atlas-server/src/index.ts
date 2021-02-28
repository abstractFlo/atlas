import './setup';
import { container } from 'tsyringe';
import { ConfigService } from './services/config.service';
import './extends/colshape/alt-colshape.prototype';
import './extends/player/alt-player.prototype';


container.resolve(ConfigService);

export {
  OnClient,
  OnceClient,
  EntityEnterColShape,
  EntityLeaveColShape,
  SyncedMetaChange
} from './decorators/event.decorator';

export { ConfigService } from './services/config.service';
export { DatabaseService } from './services/database.service';
export { EventService } from './services/event.service';



