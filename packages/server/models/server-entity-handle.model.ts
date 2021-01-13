import { Cast, EventModel } from '@abstractFlo/shared';
import { BaseObjectType } from 'alt-server';

export class ServerEntityHandleModel extends EventModel {

  @Cast()
  entityType: BaseObjectType;

  @Cast({})
  metaKey: string;

}
