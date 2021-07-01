import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';
import { AutoloaderEnums } from '../constants/autoloader.constant';
import { LoaderServiceQueueTypeEnum } from '../constants/loader-service.constant';
import { constructor } from '../types/constructor';

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
