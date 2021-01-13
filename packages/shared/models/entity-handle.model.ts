import { Cast, EventModel } from '../core';

export class EntityHandleModel extends EventModel {

  @Cast()
  entityType: number;

  @Cast()
  metaKey: string;

}
