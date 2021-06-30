import { Cast, JsonEntityModel } from '../libs/json-entity';
import { LoaderServiceQueueItemModel } from './loader-service-queue-item.model';
import { Subject } from 'rxjs';

export class LoaderServiceQueueModel extends JsonEntityModel {
  @Cast()
  before: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  beforeCount: Subject<number> = new Subject<number>();

  @Cast()
  after: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  afterCount: Subject<number> = new Subject<number>();

  @Cast()
  frameworkBeforeBoot: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  frameworkBeforeBootCount: Subject<number> = new Subject<number>();

  @Cast()
  frameworkAfterBoot: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  frameworkAfterBootCount: Subject<number> = new Subject<number>();
}
