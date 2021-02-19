import { container, injectable } from 'tsyringe';

@injectable()
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
   * Convert given value to event name
   * e.g: myAwesomeEvent => my:awesome:event
   *
   * @param {string} value
   * @returns {string}
   */
  public static convertToEventName(value: string): string {
    return value
        .replace(/([a-zA-Z])(?=[A-Z])/g, '$1:')
        .toLowerCase();
  }

  /**
   * Convert given value to camelCase
   *
   * @param {string} value
   * @returns {string}
   */
  public static convertToCamelCase(value: string): string {
    return value.replace(/[:]/g, ' ')
        .replace(
            /(?:^\w|[A-Z]|\b\w)/g,
            (word: string, index: number) => index === 0
                ? word.toLowerCase()
                : word.toUpperCase()
        )
        .replace(/\s+/g, '');
  }

  /**
   * Add message to console
   *
   * @param messages
   */
  public static log(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.log');
    log(...messages);
  }

  /**
   * Add warning to console
   *
   * @param messages
   */
  public static logWarning(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logWarning');
    log(...messages);
  }

  /**
   * Add error to console
   *
   * @param messages
   */
  public static logError(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logError');
    log(...messages);
  }

  /**
   * Add loaded message to console
   *
   * @param messages
   */
  public static logLoaded(...messages: any[]): void {
    messages.forEach((message: any) => UtilsService.log(`Loaded ~lg~${message}~w~`));
  }

  /**
   * Add unloaded message to console
   *
   * @param messages
   */
  public static logUnloaded(...messages: any[]): void {
    messages.forEach((message: any) => UtilsService.log(`Unloaded ~lg~${message}~w~`));
  }

  /**
   * Receive on event helper
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public static eventOn(eventName: string, listener: (...args: any[]) => void): void {
    const eventHandler = container.resolve<CallableFunction>('alt.on');
    eventHandler(eventName, listener);
  }

  /**
   * Receive once event helper
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public static eventOnce(eventName: string, listener: (...args: any[]) => void): void {
    const eventHandler = container.resolve<CallableFunction>('alt.once');
    eventHandler(eventName, listener);
  }

  /**
   * Unsubscribe from event helper
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public static eventOff(eventName: string, listener: (...args: any[]) => void): void {
    const eventHandler = container.resolve<CallableFunction>('alt.off');
    eventHandler(eventName, listener);
  }

  /**
   * Emit event helper
   *
   * @param {string} eventName
   * @param args
   */
  public static eventEmit(eventName: string, ...args: any[]): void {
    const eventHandler = container.resolve<CallableFunction>('alt.emit');
    eventHandler(eventName, ...args);
  }

}
