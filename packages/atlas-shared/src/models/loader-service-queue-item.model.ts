import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';
import { AutoloaderEnums, LoaderServiceQueueTypeEnum } from '../constants';
import { constructor } from '../types';

export class LoaderServiceQueueItemModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  type: LoaderServiceQueueTypeEnum | AutoloaderEnums;

  @Cast()
  target: string | constructor<any>;

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToNumber() })
  doneCheckTimeout: number = 5000;

}
