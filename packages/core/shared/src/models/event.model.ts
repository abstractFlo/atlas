import { Cast, JsonEntityModel } from '../libs/json-entity';
import { ValidateOptionsModel } from './validate-options.model';

export class EventModel extends JsonEntityModel {
  @Cast()
  public type:
      | 'on'
      | 'once'
      | 'onClient'
      | 'onceClient'
      | 'onServer'
      | 'onceServer'
      | 'onGui'
      | 'off'
      | 'offServer'
      | 'offClient'
      | 'syncedMetaChange'
      | 'streamSyncedMetaChange'
      | 'gameEntityCreate'
      | 'gameEntityDestroy'
      | 'entityEnterColshape'
      | 'entityLeaveColshape'
      | 'consoleCommand'
      | 'keyup'
      | 'keydown';

  @Cast()
  public eventName: string;

  @Cast()
  public methodName: string;

  @Cast()
  public targetName: string;

  @Cast()
  public validateOptions: Partial<ValidateOptionsModel>;

  @Cast()
  public resetable: boolean = false;
}
