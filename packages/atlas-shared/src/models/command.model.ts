import { Cast, castToString, JsonEntityModel } from '../libs/json-entity';

export class CommandModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  name: string;

  @Cast({ from: castToString() })
  target: string;

  @Cast({ from: castToString() })
  methodName: string;
}
