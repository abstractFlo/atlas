import { Cast, EventModel } from '@abstractFlo/shared';
import { BaseObjectType } from 'alt-client';

export class ClientEntityHandleModel extends EventModel {

  @Cast()
  entityType: BaseObjectType;

  @Cast()
  metaKey: string;
}
