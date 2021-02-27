import { Cast, castToString, HasOne, JsonEntityModel } from '../libs/json-entity';
import { ValidateOptionsModel } from './validate-options.model';

export class EventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  type:
      'on' |
      'once' |
      'onClient' |
      'onceClient' |
      'onServer' |
      'onceServer' |
      'onGui' |
      'syncedMetaChange' |
      'streamSyncedMetaChange' |
      'gameEntityCreate' |
      'gameEntityDestroy' |
      'entityEnterColShape' |
      'entityLeaveColShape' |
      'consoleCommand';

  @Cast({ from: castToString() })
  eventName: string;

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToString() })
  targetName: string;

  @HasOne(ValidateOptionsModel)
  @Cast()
  validateOptions: Partial<ValidateOptionsModel>;

}
