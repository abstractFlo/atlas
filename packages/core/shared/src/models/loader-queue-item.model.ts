import { Cast, JsonEntityModel } from '../libs/json-entity';

export class LoaderQueueItemModel extends JsonEntityModel {

	@Cast()
	type: symbol;

	@Cast()
	target: string;

	@Cast()
	targetHash: Object;

	@Cast()
	methodName: string;

	@Cast()
	order: number = 0;

}
