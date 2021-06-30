import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';

export class ValidateOptionsModel extends JsonEntityModel {
  @Cast({ from: castToNumber() })
  entity: number;

  @Cast({ from: castToString() })
  metaKey: string;

  @Cast({ from: castToNumber() })
  keyboardKey: number;

  @Cast({ from: castToNumber() })
  colShapeType: number;

  @Cast({ from: castToString() })
  name: string;
}
