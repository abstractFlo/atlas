import { Cast, castToString, JsonEntityModel } from '../json-entity';

export class EventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  type: string;

  @Cast({ from: castToString() })
  eventName: string;

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToString() })
  targetName: string;

}
