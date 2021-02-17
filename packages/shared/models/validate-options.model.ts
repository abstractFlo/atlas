import { Cast, castToNumber, castToString, JsonEntityModel } from '../core';

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
