import { Cast, castToNumber, castToString, JsonEntityModel } from '../json-entity';

export class QueueItemModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  target: string;

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToNumber() })
  doneCheckIntervalTime: number = 5000;
}
