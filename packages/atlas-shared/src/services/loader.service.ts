import { InjectionToken, singleton } from 'tsyringe';
import { LoaderServiceQueueItemModel, LoaderServiceQueueModel } from '../models';
import { KEYS } from '../constants';

@singleton()
export class LoaderService {

  /**
   * Contains the complete loading queue
   *
   * @type {LoaderServiceQueueModel}
   * @private
   */
  private readonly: LoaderServiceQueueModel = new LoaderServiceQueueModel();

  public bootstrap(target: InjectionToken): LoaderService {
    this.resolveMetaData();


    return this;
  }

  public getReflect(): LoaderServiceQueueItemModel[] {
    return Reflect.getMetadata(KEYS.LOADER_QUEUE_ITEM, this) || [];
  }

  /**
   * Add new Item to queue
   *
   * @param {LoaderServiceQueueItemModel} queueItem
   */
  private add(queueItem: LoaderServiceQueueItemModel): void {

  }

  private resolveMetaData(): void {

  }
}
