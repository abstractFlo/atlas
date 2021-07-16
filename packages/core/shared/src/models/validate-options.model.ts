import { Cast, JsonEntityModel } from '../libs/json-entity';

export class ValidateOptionsModel extends JsonEntityModel {
	@Cast()
	public entity: number;

	@Cast()
	public metaKey: string;

	@Cast()
	public keyboardKey: number;

	@Cast()
	public colShapeType: number;

	@Cast()
	public name: string;
}
