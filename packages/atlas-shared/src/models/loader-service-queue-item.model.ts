import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';
import { InjectionToken } from 'tsyringe';
import { LoaderServiceQueueType } from '../constants';

export class LoaderServiceQueueItemModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  type: LoaderServiceQueueType;

  @Cast()
  target: string | InjectionToken;

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToNumber() })
  doneCheckTimeout: number = 5000;

}
