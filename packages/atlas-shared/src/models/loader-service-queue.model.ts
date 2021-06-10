import { Cast, JsonEntityModel } from '../libs/json-entity';
import { LoaderServiceQueueItemModel } from './loader-service-queue-item.model';
import { Subject } from 'rxjs';

export class LoaderServiceQueueModel extends JsonEntityModel {
  @Cast()
  public before: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  public beforeCount: Subject<number> = new Subject<number>();

  @Cast()
  public after: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  public afterCount: Subject<number> = new Subject<number>();

  @Cast()
  public frameworkBeforeBoot: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  public frameworkBeforeBootCount: Subject<number> = new Subject<number>();

  @Cast()
  public frameworkAfterBoot: Map<string, LoaderServiceQueueItemModel> = new Map<string, LoaderServiceQueueItemModel>();

  @Cast()
  public frameworkAfterBootCount: Subject<number> = new Subject<number>();
}
