import { container } from 'tsyringe';
import { CommandService } from './command.service';

export class UtilsService {
  /**
   * Auto clear setTimeout
   *
   * @param {Function} listener
   * @param {number} duration
   */
  public static autoClearSetTimeout(listener: CallableFunction, duration: number): void {
    const clearTimeoutFn = container.resolve<CallableFunction>('alt.clearTimeout');

    const timeout = UtilsService.setTimeout(async () => {
      await listener();
      clearTimeoutFn(timeout);
    }, duration);
  }

  /**
   * Run a setTimeout
   *
   * @param {Function} listener
   * @param {number} duration
   */
  public static setTimeout(listener: CallableFunction, duration: number): number {
    const setTimeoutFn = container.resolve<CallableFunction>('alt.setTimeout');

    return setTimeoutFn(async () => {
      await listener();
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
  public static nextTick(listener: CallableFunction): number {
    const nextTickFn = container.resolve<CallableFunction>('alt.nextTick');
    return nextTickFn(listener);
  }

  /**
   * Clear given interval
   *
   * @param {number} interval
   * @returns {void}
   */
  public static clearInterval(interval: number): void {
    const clearIntervalFn = container.resolve<CallableFunction>('alt.clearInterval');
    clearIntervalFn(interval);
  }

  /**
   * Clear given timeout
   *
   * @param {number} timeout
   * @returns {void}
   */
  public static clearTimeout(timeout: number): void {
    const clearTimeoutFn = container.resolve<CallableFunction>('alt.clearTimeout');
    clearTimeoutFn(timeout);
  }

  /**
   * Clear given nextTick
   *
   * @param {number} tick
   * @returns {void}
   */
  public static clearNextTick(tick: number): void {
    const clearNextTickFn = container.resolve<CallableFunction>('alt.clearNextTick');
    clearNextTickFn(tick);
  }

  /**
   * Clear given everyTick
   *
   * @param {number} tick
   * @returns {void}
   */
  public static clearEveryTick(tick: number): void {
    const clearEveryTick = container.resolve<CallableFunction>('alt.clearEveryTick');
    clearEveryTick(tick);
  }

  /**
   * Add normal message to log
   *
   * @param messages
   */
  public static log(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.log');
    log(...messages);
  }

  /**
   * Add warning message to log
   *
   * @param messages
   */
  public static logWarning(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logWarning');
    log(...messages);
  }

  /**
   * Add error message to log
   *
   * @param messages
   */
  public static logError(...messages: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logError');
    log(...messages);
  }

  /**
   * Add loaded message to log
   *
   * @param messages
   */
  public static logLoaded(...messages: any[]): void {
    messages.forEach((message: any) => UtilsService.log(`Loaded ~lg~${message}~w~`));
  }

  /**
   * Add unloaded message to log
   *
   * @param messages
   */
  public static logUnloaded(...messages: any[]): void {
    messages.forEach((message: any) => UtilsService.log(`Unloaded ~lg~${message}~w~`));
  }

  /**
   * Log registered handler with length
   *
   * @param {string} name
   * @param {number} length
   */
  public static logRegisteredHandlers(name: string, length: number): void {
    if (UtilsService.isProduction()) return;
    UtilsService.log(`Registered all handlers for ~lg~${name}~w~ - ~y~[${length}]~w~`);
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
   * Emit event helper
   *
   * @param {string} eventName
   * @param args
   */
  public static eventEmit(eventName: string, ...args: any[]): void {
    const eventHandler = container.resolve<CallableFunction>('alt.emit');
    eventHandler(eventName, ...args);
  }

  /**
   * Return if production mode is enabled
   *
   * @return {boolean}
   */
  public static isProduction(toggle: boolean = false): boolean {
    return (typeof process !== 'undefined' && process.env.ATLAS_PRODUCTION === 'true') || toggle;
  }

  /**
   * Setup new command prefix
   *
   * @param {string} prefix
   */
  public static setCommandPrefix(prefix: string): void {
    const commandService = container.resolve(CommandService);
    commandService.setPrefix(prefix);
  }
}
