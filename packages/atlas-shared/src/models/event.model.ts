import { Cast, castToString, HasOne, JsonEntityModel } from '../libs/json-entity';
import { ValidateOptionsModel } from './validate-options.model';

export class EventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  type: string;

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
