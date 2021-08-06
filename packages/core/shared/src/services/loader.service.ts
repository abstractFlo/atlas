import { InjectionToken } from 'tsyringe';
import { BehaviorSubject, delay, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoaderQueueItemModel } from '../models/loader-queue-item.model';
import { Singleton } from '../decorators/framework-di.decorator';
import { app } from '../di-container';
import { LoaderConstant } from '../constants/loader.constant';
import { getFrameworkMetaData } from '../decorators/helpers';
import { UtilsService } from './utils.service';

@Singleton
export class LoaderService {

  /**
   * Subscription for finish booting
   *
   * @type {Subject<boolean>}
   * @private
   */
  private finishSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Contains all queued items sorted by loadingOrder
   *
   * @type {LoaderQueueItemModel[]}
   * @private
   */
  private queueItems: LoaderQueueItemModel[];

  /**
   * Define the loading order for queue
   *
   * @type {symbol[]}
   * @private
   */
  private loadingOrder: symbol[] = [
    LoaderConstant.QUEUE_INIT,
    LoaderConstant.QUEUE_BEFORE,
    LoaderConstant.QUEUE_AFTER,
    LoaderConstant.QUEUE_LAST
  ];

  /**
   * BehaviorSubject for delay the bootstrap
   *
   * @type {BehaviorSubject<boolean>}
   * @private
   */
  private waitBeforeStart: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Contains the current queue count
   *
   * @type {Subject<number>}
   * @private
   */
  private queueCount: Subject<number> = new Subject<number>();

  /**
   * Await event before start loader
   *
   * @param {string} eventName
   * @return LoaderService
   */
  public waitFor(eventName: string): LoaderService {
    this.waitBeforeStart.next(true);
    UtilsService.eventOnce(eventName, () => {
      this.waitBeforeStart.next(false);
      this.waitBeforeStart.complete();
    });

    return this;
  }

  /**
   * Start loader and process queue before resolve the given token
   *
   * @param {InjectionToken} token
   * @return {LoaderService}
   */
  public bootstrap(token: InjectionToken): LoaderService {
    this.waitBeforeStart
        .asObservable()
        .pipe(filter((value: boolean) => !value), delay(125))
        .subscribe(() => {
          this.resolveMetaData();

          this.queueCount
              .asObservable()
              .pipe(
                  filter((value) => value === this.queueItems.length)
              )
              .subscribe(() => {
                app.afterResolution(token, () => {
                  this.finishSubject.next(true);
                  this.finishSubject.complete();
                });

                app.resolve(token);
              });

          this.startLoading();
        });

    return this;
  }

  /**
   * Can be used after booting is finished
   *
   * @param {(...args: any[]) => void} callback
   */
  public done(callback: (...args: any[]) => void): void {
    this.finishSubject.asObservable().subscribe(callback);
  }

  /**
   * Process the queue step by step
   *
   * @param {number} index
   * @return {Promise<void>}
   * @private
   */
  private async startLoading(index: number = 0): Promise<void> {
    const nextIndex = index + 1;
    const item = this.queueItems[index];
    const instance = app.resolveAll(item.target).find((instance) => instance.constructor === item.targetHash);

    const method = instance[item.methodName];
    await method.bind(instance)();

    this.queueCount.next(nextIndex);

    // Complete subscription if last item done
    if (nextIndex === this.queueItems.length) this.queueCount.complete();

    // Recursive if queueItems contains more
    if (nextIndex < this.queueItems.length) await this.startLoading(nextIndex);

  }

  /**
   * Prepare queue items from reflection api
   *
   * @private
   */
  private resolveMetaData(): void {
    const queueItems = getFrameworkMetaData<LoaderQueueItemModel[]>(
        LoaderConstant.QUEUE_ITEM,
        app.resolve(LoaderService)
    );
    this.queueItems = this.sortItems(queueItems);

    this.queueCount.next(this.queueItems.length);
  }

  /**
   * Sort items by defined load order
   *
   * @param {LoaderQueueItemModel[]} items
   * @return {LoaderQueueItemModel[]}
   * @private
   */
  private sortItems(items: LoaderQueueItemModel[]): LoaderQueueItemModel[] {
    return items.sort(
        (a: LoaderQueueItemModel, b: LoaderQueueItemModel) =>
            (this.loadingOrder.indexOf(a.type) - this.loadingOrder.indexOf(b.type)) + (a.order - b.order)
    );
  }
}
