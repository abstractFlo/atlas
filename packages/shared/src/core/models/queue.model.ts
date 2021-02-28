import { Cast, JsonEntityModel } from '../json-entity';
import { Subject } from 'rxjs';
import { QueueItemModel } from './queue-item.model';

export class QueueModel extends JsonEntityModel {

  @Cast()
  before: Map<string, QueueItemModel> = new Map();

  @Cast()
  beforeCount: Subject<number> = new Subject<number>();

  @Cast()
  after: Map<string, QueueItemModel> = new Map();

  @Cast()
  afterCount: Subject<number> = new Subject<number>();

  @Cast()
  afterBootstrap: Map<string, QueueItemModel> = new Map();

  @Cast()
  afterBootstrapCount: Subject<number> = new Subject<number>();
}
