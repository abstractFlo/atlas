import { Cast, castToString, JsonEntityModel } from '../json-entity';

export class QueueItemModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  target: string;

  @Cast({ from: castToString() })
  methodName: string;
}
