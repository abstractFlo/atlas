import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';

export class ValidateOptionsModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  eventAddTo: 'base' | 'gameEntity' | 'metaChange' | 'colShape' = 'base';

  @Cast({ from: castToNumber() })
  entity: number;

  @Cast({ from: castToString() })
  metaKey: string;

  @Cast({ from: castToNumber() })
  colShapeType: number;

  @Cast({ from: castToString() })
  name: string;

}
