import { container, InjectionToken, singleton } from 'tsyringe';
import { Observable, Subject } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';
import { UtilsService } from './utils.service';
import { getAtlasMetaData } from '../decorators/helpers';
import { LoaderServiceQueueModel } from '../models/loader-service-queue.model';
import { LoaderServiceEnum } from '../constants/loader-service.constant';
import { LoaderServiceQueueItemModel } from '../models/loader-service-queue-item.model';

@singleton()
export class BaseLoaderService {
  /**
   * The subject for starting the loading system and queue
   *
   * @type {Subject<boolean>}
   * @private
   */
  protected startingSubject$: Subject<boolean> = new Subject<boolean>();

  /**
   * Contains the complete queue
   *
   * @type {LoaderServiceQueueModel}
   * @private
   */
  private queue: LoaderServiceQueueModel = new LoaderServiceQueueModel();

  /**
   * Contains the count for frameworkBeforeBoot
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly frameworkBeforeBootCount$: Observable<number> = this.queue.frameworkBeforeBootCount.asObservable();

  /**
   * Contains the count for frameworkAfterBoot
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly frameworkAfterBootCount$: Observable<number> = this.queue.frameworkAfterBootCount.asObservable();

  /**
   * Contains the count for before
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly beforeCount$: Observable<number> = this.queue.beforeCount.asObservable();

  /**
   * Contains the count for after
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly afterCount$: Observable<number> = this.queue.afterCount.asObservable();

  /**
   * The subject if the loading finished and queue is empty
   *
   * @type {Subject<boolean>}
   * @private
   */
  private readonly finishSubject$: Subject<boolean> = new Subject<boolean>();

  /**
   * Contains if the loader is already bootstrapped
   *
   * @type {boolean}
   * @private
   */
  private isBootstrapped: boolean = false;

  /**
   * Contains the queue item next tick id
   * @type {number | null}
   * @private
   */
  private currentNextTick: number | null = null;

  /**
   * Bootstrap the framework
   *
   * @param {InjectionToken} target
   * @return {BaseLoaderService}
   */
  public bootstrap(target: InjectionToken): BaseLoaderService {
    if (this.isBootstrapped) return this;

    this.resolveMetaDataAndAdd();

    this.frameworkBeforeBootCount$.pipe(takeLast(1)).subscribe(() => this.processQueue(this.queue.before, this.queue.beforeCount));

    this.beforeCount$.pipe(takeLast(1)).subscribe(() => this.processQueue(this.queue.after, this.queue.afterCount));

    this.afterCount$
      .pipe(takeLast(1))
      .subscribe(() => this.processQueue(this.queue.frameworkAfterBoot, this.queue.frameworkAfterBootCount));

    this.frameworkAfterBootCount$.pipe(takeLast(1)).subscribe(() =>
      UtilsService.nextTick(() => {
        this.finishUpBooting(target);
        container.resolve(target);
      }),
    );

    this.startingSubject$
      .asObservable()
      .pipe(
        takeLast(1),
        filter((value: boolean) => value),
      )
      .subscribe(() => this.processQueue(this.queue.frameworkBeforeBoot, this.queue.frameworkBeforeBootCount));

    this.setupQueueCounts();
    this.startLoading();

    this.isBootstrapped = true;

    return this;
  }

  /**
   * Can be run after booting is finished
   *
   * @param {(...args: any[]) => void} callback
   */
  public done(callback: (...args: any[]) => void): void {
    this.finishSubject$
      .asObservable()
      .pipe(filter((isFinished: boolean) => isFinished))
      .subscribe(callback);
  }

  /**
   * Start the loading service
   *
   * @private
   */
  protected startLoading(): void {}

  /**
   * Done callback handler for all queue decorated methods
   *
   * @param {Map<string, LoaderServiceQueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @param {string|null} key
   * @param {number} doneCheckIntervalId
   * @private
   */
  private doneCallback(
    property: Map<string, LoaderServiceQueueItemModel>,
    propertyCount: Subject<number>,
    key: string | null = null,
    doneCheckIntervalId?: number,
  ): void {
    if (this.currentNextTick) {
      UtilsService.clearNextTick(this.currentNextTick);
      this.currentNextTick = null;
    }

    if (doneCheckIntervalId) {
      UtilsService.clearInterval(doneCheckIntervalId);
    }

    if (key !== null) {
      property.delete(key);
    }

    propertyCount.next(property.size);

    if (property.size === 0) {
      propertyCount.complete();
    }
  }

  /**
   * Process a complete queue
   *
   * @param {Map<string, LoaderServiceQueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @private
   */
  private processQueue(property: Map<string, LoaderServiceQueueItemModel>, propertyCount: Subject<number>): void {
    if (property.size === 0) {
      this.currentNextTick = UtilsService.nextTick(() => this.doneCallback(property, propertyCount));
    } else {
      propertyCount.pipe(filter((size: number) => size !== 0)).subscribe(() => this.processQueueItem(property, propertyCount));

      this.processQueueItem(property, propertyCount);
    }
  }

  /**
   * Process an item from queue
   *
   * @param {Map<string, LoaderServiceQueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @private
   */
  private processQueueItem(property: Map<string, LoaderServiceQueueItemModel>, propertyCount: Subject<number>): void {
    const nextItem: LoaderServiceQueueItemModel = property.values().next().value;
    const nextKey = property.keys().next().value as string;

    if (nextItem !== undefined) {
      this.currentNextTick = UtilsService.nextTick(async () => {
        const instance = container.resolve(nextItem.target);
        const checkTimeoutDuration = nextItem.doneCheckTimeout;
        const [moduleName, methodName] = nextKey.split('_');
        const instanceMethod = instance[nextItem.methodName];

        if (!instanceMethod) {
          UtilsService.log(`~lb~[Class: ${moduleName}]~w~ - ~r~{Method: ${methodName}} does not exists~w~`);
          return;
        }

        const doneCheckTimeoutId = UtilsService.setTimeout(() => {
          this.setupDoneTimeout(moduleName, methodName, checkTimeoutDuration, doneCheckTimeoutId);
        }, checkTimeoutDuration);

        const doneCallback = this.doneCallback.bind(this, property, propertyCount, nextKey, doneCheckTimeoutId);
        const method = instanceMethod.bind(instance, doneCallback);

        await method();
      });
    }
  }

  /**
   * Add new Item to queue
   *
   * @param {LoaderServiceQueueItemModel} queueItem
   */
  private add(queueItem: LoaderServiceQueueItemModel): void {
    const targetName = typeof queueItem.target === 'string' ? queueItem.target : queueItem.target.name;

    const identifier = `${targetName}_${queueItem.methodName}`;

    this.queue[queueItem.type].set(identifier, queueItem);
  }

  /**
   * Get the queue items and add to queue
   *
   * @return {LoaderServiceQueueItemModel[]}
   * @private
   */
  private resolveMetaDataAndAdd(): void {
    const queueItems = getAtlasMetaData<LoaderServiceQueueItemModel[]>(LoaderServiceEnum.QUEUE_ITEM, container.resolve(BaseLoaderService));

    queueItems.forEach((queueItem: LoaderServiceQueueItemModel) => this.add(queueItem));
  }

  /**
   * Setup the counts for each queue item
   *
   * @private
   */
  private setupQueueCounts(): void {
    this.queue.frameworkBeforeBootCount.next(this.queue.frameworkBeforeBoot.size);
    this.queue.beforeCount.next(this.queue.before.size);
    this.queue.afterCount.next(this.queue.after.size);
    this.queue.frameworkAfterBootCount.next(this.queue.frameworkAfterBoot.size);
  }

  /**
   * Setup the done timeout callback
   *
   * @param {string} moduleName
   * @param {string} method
   * @param {number} timeoutDuration
   * @param {number} timeoutId
   * @private
   */
  private setupDoneTimeout(moduleName: string, method: string, timeoutDuration: number, timeoutId: number) {
    UtilsService.log(`~lb~[Module: ${moduleName}]~y~{Method: ${method}}~w~ - ~r~Have you maybe forgotten the done callback?~w~`);
    UtilsService.log(`~y~If not, increase decorator runtime parameter ~w~[yours: ${timeoutDuration}ms] ~lg~[default: 5000ms] ~w~`);
    UtilsService.clearInterval(timeoutId);
  }

  /**
   * Finish up the booting if bootstrapped class resolved
   *
   * @param {InjectionToken} target
   * @private
   */
  private finishUpBooting(target: InjectionToken) {
    container.afterResolution(
      target,
      () => {
        UtilsService.nextTick(() => {
          this.finishSubject$.next(true);
          this.finishSubject$.complete();
        });
      },
      { frequency: 'Once' },
    );
  }
}
