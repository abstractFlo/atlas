import { Cast, castToString, JsonEntityModel } from '../libs/json-entity';

export class CommandModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public name: string;

  @Cast({ from: castToString() })
  public target: string;

  @Cast({ from: castToString() })
  public methodName: string;
}
