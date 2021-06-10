import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';
import { AutoloaderEnums } from '../constants/autoloader.constant';
import { LoaderServiceQueueTypeEnum } from '../constants/loader-service.constant';
import { constructor } from '../types/constructor';

export class LoaderServiceQueueItemModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public type: LoaderServiceQueueTypeEnum | AutoloaderEnums;

  @Cast()
  public target: string | constructor<any>;

  @Cast({ from: castToString() })
  public methodName: string;

  @Cast({ from: castToNumber() })
  public doneCheckTimeout = 5000;
}
