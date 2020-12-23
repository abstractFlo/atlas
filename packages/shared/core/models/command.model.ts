import { Cast, castToString, JsonEntityModel } from '../json-entity';

export class CommandModel extends JsonEntityModel {

  @Cast({from: castToString()})
  target: string;

  @Cast({from: castToString()})
  methodName: string;

}
