import { container } from 'tsyringe';

export class UtilsService {

  /**
   * Auto clear setTimeout
   *
   * @param {Function} listener
   * @param {number} duration
   */
  public static setTimeout(listener: CallableFunction, duration: number): void {
    const setTimeoutFn = container.resolve<CallableFunction>('alt.setTimeout');
    const clearTimeoutFn = container.resolve<CallableFunction>('alt.clearTimeout');

    const timeout = setTimeoutFn(async () => {
      await listener();
      clearTimeoutFn(timeout);
    }, duration);
  }

  /**
   * Run an interval
   *
   * @param {Function} listener
   * @param {number} milliseconds
   * @returns {number}
   */
  public static setInterval(listener: CallableFunction, milliseconds: number): number {
    const setIntervalFn = container.resolve<CallableFunction>('alt.setInterval');
    return setIntervalFn(listener, milliseconds);
  }

  /**
   * Run an everyTick Timer
   *
   * @param {Function} listener
   * @returns {number}
   */
  public static everyTick(listener: CallableFunction): number {
    const everyTickFn = container.resolve<CallableFunction>('alt.everyTick');
    return everyTickFn(listener);
  }

  /**
   * Run an interval and clear after duration
   *
   * @param {Function} listener
   * @param {number} milliseconds
   * @param intervalDuration
   * @returns {number}
   */
  public static autoClearInterval(listener: CallableFunction, milliseconds: number, intervalDuration: number): void {
    const setIntervalFn = container.resolve<CallableFunction>('alt.setInterval');
    const clearIntervalFn = container.resolve<CallableFunction>('alt.clearInterval');

    const interval = setIntervalFn(listener, milliseconds);

    UtilsService.setTimeout(() => {
      clearIntervalFn(interval);
    }, intervalDuration);
  }


  /**
   * Next tick
   * @param {Function} listener
   */
  public static nextTick(listener: CallableFunction): void {
    const nextTickFn = container.resolve<CallableFunction>('alt.nextTick');
    const nextTick = nextTickFn(listener);
  }

  /**
   * Clear given interval
   *
   * @param {number} interval
   * @returns {void}
   */
  public static clearInterval(interval: number): void {
    const clearIntervalFn = container.resolve<CallableFunction>('alt.clearInterval');

    return clearIntervalFn(interval);
  }

  /**
   * Clear given timeout
   *
   * @param {number} timeout
   * @returns {void}
   */
  public static clearTimeout(timeout: number): void {
    const clearTimeoutFn = container.resolve<CallableFunction>('alt.clearTimeout');

    return clearTimeoutFn(timeout);
  }

  /**
   * Clear given nextTick
   *
   * @param {number} tick
   * @returns {void}
   */
  public static clearNextTick(tick: number): void {
    const clearNextTickFn = container.resolve<CallableFunction>('alt.clearNextTick');

    return clearNextTickFn(tick);
  }

  /**
   * Clear given everyTick
   *
   * @param {number} tick
   * @returns {void}
   */
  public static clearEveryTick(tick: number): void {
    const clearEveryTick = container.resolve<CallableFunction>('alt.clearEveryTick');

    return clearEveryTick(tick);
  }

  /**
   * Add normal message to log
   *
   * @param message
   */
  public static log(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.log');
    log(...message);
  }

  /**
   * Add warning message to log
   *
   * @param message
   */
  public static logWarning(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logWarning');
    log(...message);
  }

  /**
   * Add error message to log
   *
   * @param message
   */
  public static logError(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logError');
    log(...message);
  }

  /**
   * Add loaded message to log
   *
   * @param message
   */
  public static logLoaded(...message: any[]): void {
    message.forEach((message: any) => UtilsService.log(`Loaded ~lg~${message}~w~`));
  }

  /**
   * Add unloaded message to log
   *
   * @param message
   */
  public static logUnloaded(...message: any[]): void {
    message.forEach((message: any) => UtilsService.log(`Unloaded ~lg~${message}~w~`));
  }


}
