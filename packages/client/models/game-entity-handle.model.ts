import { Cast, EventModel } from '@abstractFlo/shared';
import { BaseObjectType } from 'alt-client';

export class GameEntityHandleModel extends EventModel {

  @Cast()
  entityType: BaseObjectType;

}
