import './setup';
import './extends/colshape/alt-colshape.prototype';

export { EventService } from './services/event.service';

export {
	OnceClient,
	OnClient,
	SyncedMetaChange,
	EntityLeaveColShape,
	EntityEnterColShape
} from './decorators/event.decorator';

export type { ColShapeInterface } from './extends/colshape/colshape.interface';
export { defaultErrorHandling } from './helpers';
