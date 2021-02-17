import { Cast, EventModel, HasOne } from '../core';
import { ValidateOptionsModel } from './validate-options.model';

export class EntityHandleModel extends EventModel {

  @HasOne(ValidateOptionsModel)
  @Cast()
  options: ValidateOptionsModel;
}
