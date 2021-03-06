import './setup';

import './extends/colshape/alt-colshape.prototype';
import './extends/player/alt-player.prototype';

export {
  OnClient,
  OnceClient,
  EntityEnterColShape,
  EntityLeaveColShape,
  SyncedMetaChange
} from './decorators/event.decorator';

export { AutoAdd } from './decorators/database.decorator';

export { DatabaseService } from './services/database.service';
export { EventService } from './services/event.service';
export { LoaderService } from './services/loader.service';

export { OnDiscord, DiscordApiService, DiscordBotService, DiscordUserModel } from './modules/discord';


