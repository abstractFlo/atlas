import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';

export class ValidateOptionsModel extends JsonEntityModel {
  @Cast({ from: castToNumber() })
  public entity: number;

  @Cast({ from: castToString() })
  public metaKey: string;

  @Cast({ from: castToNumber() })
  public keyboardKey: number;

  @Cast({ from: castToNumber() })
  public colShapeType: number;

  @Cast({ from: castToString() })
  public name: string;
}
