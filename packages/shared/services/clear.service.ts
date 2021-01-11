import { singleton } from 'tsyringe';
import { ClearServiceConfig } from '../config';
import { UtilsService } from '@abstractFlo/shared';

@singleton()
export class ClearService {

  private everyTick: Map<string|number, number> = new Map<string|number, number>();
  private interval: Map<string|number, number> = new Map<string|number, number>();
  private timeout: Map<string|number, number> = new Map<string|number, number>();
  private nextTick: Map<string|number, number> = new Map<string|number, number>();

  /**
   * Add new everyTick Timer
   *
   * @param {string|number} name
   * @param {number} tick
   */
  public addEveryTick(name: string|number, tick: number): void {
    if (!this.everyTick.has(name)) {
      this.everyTick.set(name, tick);
    }
  }

  /**
   * Add new interval timer
   *
   * @param {string|number} name
   * @param {number} tick
   */
  public addInterval(name: string|number, tick: number): void {
    if (!this.interval.has(name)) {
      this.interval.set(name, tick);
    }
  }

  /**
   * Add new timeout timer
   *
   * @param {string|number} name
   * @param {number} tick
   */
  public addTimeout(name: string|number, tick: number): void {
    if (!this.timeout.has(name)) {
      this.timeout.set(name, tick);
    }
  }

  /**
   * Add new next tick timer
   *
   * @param {string|number} name
   * @param {number} tick
   */
  public addNextTick(name: string|number, tick: number): void {
    if (!this.nextTick.has(name)) {
      this.nextTick.set(name, tick);
    }
  }

  /**
   * Add a timer to holding queue
   *
   * @param {keyof typeof ClearServiceConfig} type
   * @param {string|number} name
   * @param {number} tick
   */
  public add(type: keyof typeof ClearServiceConfig, name: string|number, tick: number): void {
    const methodName = ClearServiceConfig[type];

    // @ts-ignore
    this[methodName].apply(name, tick);
  }

  /**
   * Clear all timers
   */
  public clearAll(): void {
    this.clearMap(this.nextTick, UtilsService.clearNextTick);
    this.clearMap(this.everyTick, UtilsService.clearEveryTick);
    this.clearMap(this.interval, UtilsService.clearInterval);
    this.clearMap(this.timeout, UtilsService.clearTimeout);
  }

  /**
   * Clear one specific timer for given timer type
   *
   * @param {keyof typeof ClearServiceConfig} type
   * @param {string|number} name
   */
  public clearOne(type: keyof typeof ClearServiceConfig, name: string|number) {
    switch (type) {
      case 'EVERY_TICK':
        this.clearTimer(this.everyTick, name, UtilsService.clearEveryTick);
        break;
      case 'INTERVAL':
        this.clearTimer(this.interval, name, UtilsService.clearInterval);
        break;
      case 'NEXT_TICK':
        this.clearTimer(this.nextTick, name, UtilsService.clearNextTick);
        break;
      case 'TIMEOUT':
        this.clearTimer(this.timeout, name, UtilsService.clearTimeout);
        break;
    }
  }

  /**
   * Clear the given map with the given clear function
   *
   * @param {Map<string, number>} map
   * @param {Function} clearFn
   * @private
   */
  private clearMap(map: Map<string|number, number>, clearFn: CallableFunction): void {
    const timers = Array.from(map.keys());
    timers.forEach((key: string) => this.clearTimer(map, key, clearFn));
  }

  /**
   * Clear the timer for given map with given key and given clearFn
   *
   * @param {Map<string|number, number>} map
   * @param {string|number} key
   * @param {Function} clearFn
   * @private
   */
  private clearTimer(map: Map<string|number, number>, key: string|number, clearFn: Function) {
    if (map.has(key)) {
      clearFn(map.get(key));
      map.delete(key);
    }
  }
}
