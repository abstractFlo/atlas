import './setup';
import './extends/colshape/alt-colshape.prototype';

export { EventService } from './services/event.service';

export {
  OnceClient,
  OnClient,
  SyncedMetaChange,
  EntityLeaveColShape,
  EntityEnterColShape,
  OffClient,
  OnGui
} from './decorators/event.decorator';

export { ColShapeInterface } from './extends/colshape/colshape.interface';
export { defaultErrorHandling } from './helpers';
