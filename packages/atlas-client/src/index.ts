import '@abraham/reflection';
import './setup';
import './worker/player.worker';
import './extends/webview/alt-webview.prototype';
import './services/key-event.service';

export {
  OnServer,
  OnceServer,
  OnGui,
  GameEntityCreate,
  GameEntityDestroy,
  StreamSyncedMetaChange,
  SyncedMetaChange
} from './decorators/event.decorator';

export { KeyUp, KeyDown } from './decorators/key-event.decorator';

export { EventService } from './services/event.service';
export { WebviewService } from './services/webview.service';
