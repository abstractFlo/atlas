import { Cast, castToString, HasOne, JsonEntityModel } from '../libs/json-entity';
import { ValidateOptionsModel } from './validate-options.model';

export class EventModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public type:
    | 'on'
    | 'once'
    | 'onClient'
    | 'onceClient'
    | 'onServer'
    | 'onceServer'
    | 'onGui'
    | 'syncedMetaChange'
    | 'streamSyncedMetaChange'
    | 'gameEntityCreate'
    | 'gameEntityDestroy'
    | 'entityEnterColshape'
    | 'entityLeaveColshape'
    | 'consoleCommand'
    | 'keyup'
    | 'keydown';

  @Cast({ from: castToString() })
  public eventName: string;

  @Cast({ from: castToString() })
  public methodName: string;

  @Cast({ from: castToString() })
  public targetName: string;

  @HasOne(ValidateOptionsModel)
  @Cast()
  public validateOptions: Partial<ValidateOptionsModel>;
}
