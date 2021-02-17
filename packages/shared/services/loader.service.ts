import { container, InjectionToken, singleton } from 'tsyringe';
import { Observable, of, Subject } from 'rxjs';
import { delay, filter, mergeMap, takeLast } from 'rxjs/operators';
import { QueueItemModel, QueueModel } from '../core';
import { UtilsService } from './utils.service';

@singleton()
export class LoaderService {

  /**
   * Contains the complete loading queue
   *
   * @type {QueueModel}
   * @private
   */
  private queue: QueueModel = new QueueModel();

  /**
   * Contains the beforeCount observable
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly beforeCount$: Observable<number> = this.queue.beforeCount.asObservable();

  /**
   * Contains the afterCount observable
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly afterCount$: Observable<number> = this.queue.afterCount.asObservable();

  /**
   * Contains the afterBootstrapCount observable
   *
   * @type {Observable<number>}
   * @private
   */
  private readonly afterBootstrapCount$: Observable<number> = this.queue.afterBootstrapCount.asObservable();

  /**
   * Contains the starting subject for booting
   *
   * @type {Subject<boolean>}
   * @private
   */
  private readonly startingSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Contains the starting observable with default pipe
   * @type {Observable<boolean>}
   * @private
   */
  private startingSubject$: Observable<boolean> = this.startingSubject
      .asObservable()
      .pipe(
          takeLast(1),
          filter((value: boolean) => value)
      );

  /**
   * Contains the finish subject to declare finish loading state
   *
   * @type {Subject<boolean>}
   * @private
   */
  private readonly finishSubject$: Subject<boolean> = new Subject<boolean>();

  /**
   * Check if loader run on serverSide
   *
   * @type {boolean}
   * @private
   */
  private readonly isServerSide: boolean = typeof process !== 'undefined';

  /**
   * Return the loader queue status
   *
   * @returns {string}
   */
  public debug(): string {
    return JSON.stringify({
      loader: {
        beforeQueueWaiting: this.queue.before.size,
        afterQueueWaiting: this.queue.after.size,
        afterBootstrapQueueWaiting: this.queue.afterBootstrap.size
      }
    }, null, 4);
  }


  /**
   * Do something after finish booting
   *
   * @param {(...args: any[]) => void} callback
   */
  public afterComplete(callback: (...args: any[]) => void): void {
    this.finishSubject$
        .asObservable()
        .pipe(filter((isFinished: boolean) => isFinished))
        .subscribe(callback);
  }

  /**
   * Add new resolver to queue
   *
   * @param {"before" | "after" | "afterBootstrap"} type
   * @param key
   * @param target
   */
  public add(type: 'before' | 'after' | 'afterBootstrap', key: string, target: string): void {
    this.queue[type].set(`${target}_${key}`, new QueueItemModel().cast({ target, methodName: key }));
  }

  /**
   * Bootstrap complete system
   *
   * @param {InjectionToken} target
   * @returns {LoaderService}
   */
  public bootstrap<T>(target: InjectionToken): LoaderService {
    container.afterResolution(target, (token: InjectionToken<T>, result: T) => {
      this.resolve();
      UtilsService.setTimeout(() => {
        this.startingSubject.next(true);
        this.startingSubject.complete();
      }, 0);

    }, { frequency: 'Once' });

    this.beforeCount$
        .pipe(takeLast(1))
        .subscribe(() => this.processWork(this.queue.after, this.queue.afterCount));

    this.afterCount$
        .pipe(takeLast(1))
        .subscribe(() => this.processWork(this.queue.afterBootstrap, this.queue.afterBootstrapCount));

    this.afterBootstrapCount$
        .pipe(takeLast(1))
        .subscribe(() => {
          this.finishSubject$.next(true);
          this.finishSubject$.complete();
        });

    // Workaround for server side
    if (this.isServerSide) {
      let entities: Function[];

      try {
        entities = container.resolve('server.database.entities');
      } catch {
        entities = [];
      }

      this.startingSubject$ = this.startingSubject$.pipe(
          delay(125),
          mergeMap(() => {
            if (entities.length) {
              const dbService = container.resolve<any>('DatabaseService');
              return dbService.initialize() as Observable<boolean>;
            }

            return of(true);
          })
      );
    }

    this.startingSubject$.subscribe(() => this.processWork(this.queue.before, this.queue.beforeCount));

    container.resolve(target);

    return this;
  }

  /**
   * Resolve all from queue
   */
  private resolve(): void {
    this.queue.beforeCount.next(this.queue.before.size);
    this.queue.afterCount.next(this.queue.after.size);
  }

  /**
   * Done callback handler for before and after methods
   *
   * @param {Map<string, QueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @param {string | null} key
   * @param {number} timeout
   * @private
   */
  private doneCallback(property: Map<string, QueueItemModel>, propertyCount: Subject<number>, key: string | null = null): void {

    if (key !== null) {
      property.delete(key);
    }

    propertyCount.next(property.size);

    if (property.size === 0) {
      propertyCount.complete();
    }
  }

  /**
   * Process the queue for given property
   *
   * @param {Map<string, any>} property
   * @param {Subject<number>} propertyCount
   * @private
   */
  private processWork(property: Map<string, QueueItemModel>, propertyCount: Subject<number>): void {
    if (property.size === 0) {
      this.doneCallback(property, propertyCount);
    } else {
      propertyCount
          .pipe(
              filter((size: number) => size !== 0)
          )
          .subscribe(() => this.processQueueItem(property, propertyCount));

      this.processQueueItem(property, propertyCount);
    }
  }

  /**
   * Process one item from queue
   *
   * @param {Map<string, QueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @return {Promise<void>}
   * @private
   */
  private async processQueueItem(property: Map<string, QueueItemModel>, propertyCount: Subject<number>): Promise<void> {
    const nextItem = property.values().next().value as QueueItemModel;
    const nextKey = property.keys().next().value as string;
    const instance = container.resolve<any>(nextItem.target);
    const doneCallback = this.doneCallback.bind(this, property, propertyCount, nextKey);
    const method = instance[nextItem.methodName].bind(instance, doneCallback);

    await method();
  }
}
