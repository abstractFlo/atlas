import { container, InjectionToken, singleton } from 'tsyringe';
import { Observable, Subject } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';
import { QueueItemModel, QueueModel } from '../core';
import { UtilsService } from './utils.service';

@singleton()
export class LoaderService {

  private queue: QueueModel = new QueueModel();

  private readonly beforeCount$: Observable<number> = this.queue.beforeCount.asObservable();
  private readonly afterCount$: Observable<number> = this.queue.afterCount.asObservable();
  private readonly afterBootstrapCount$: Observable<number> = this.queue.afterBootstrapCount.asObservable();

  private readonly startingSubject: Subject<boolean> = new Subject<boolean>();
  private readonly startingSubject$: Observable<boolean> = this.startingSubject.asObservable();
  private readonly finishSubject$: Subject<boolean> = new Subject<boolean>();

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
   * Bootstrap complete system
   *
   * @param {InjectionToken} target
   * @returns {LoaderService}
   */
  public bootstrap<T>(target: InjectionToken): LoaderService {
    container.afterResolution(target, (token: InjectionToken<T>, result: T) => {
      this.resolve();
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

    this.startingSubject$
        .pipe(
            //tap(() => log('~y~Booting entire system => ~w~Please wait...')),
            filter((value: boolean) => value)
        )
        .subscribe(() => this.processWork(this.queue.before, this.queue.beforeCount));

    container.resolve(target);

    return this;
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
   * Resolve all from queue
   */
  private resolve(): void {
    this.queue.beforeCount.next(this.queue.before.size);
    this.queue.afterCount.next(this.queue.after.size);

    UtilsService.setTimeout(() => {
      this.startingSubject.next(true);
      this.startingSubject.complete();
    }, 50);
  }

  /**
   * Done callback handler for before and after methods
   *
   * @param {Map<string, QueueItemModel>} property
   * @param {Subject<number>} propertyCount
   * @param {string | null} key
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
    property.size === 0
        ? this.doneCallback(property, propertyCount)
        : property.forEach(async (value: QueueItemModel, key: string) => {
          const instance = container.resolve<any>(value.target);
          const doneCallback = this.doneCallback.bind(this, property, propertyCount, key);
          const method = instance[value.methodName].bind(instance, doneCallback);

          await method();
        });

  }
}
