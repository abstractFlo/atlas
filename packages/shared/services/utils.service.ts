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

    const timeout = setTimeoutFn(() => {
      listener();
      clearTimeoutFn(timeout);
    }, duration);
  }

  /**
   * Convert given value to event name
   * e.g: myAwesomeEvent => my:awesome:event
   *
   * Only for custom events, alt:V events would be excluded
   *
   * @param {string} value
   * @returns {string}
   */
  public static convertToEventName(value: string): string {
    let events = container.resolve<string[]>('alt.internalEvents');

    return events.includes(value)
        ? value
        : value.replace(/([a-zA-Z])(?=[A-Z])/g, '$1:')
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
   * @param message
   */
  public static log(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.log');
    log(...message);
  }

  /**
   * Add warning to console
   *
   * @param message
   */
  public static logWarning(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logWarning');
    log(...message);
  }

  /**
   * Add error to console
   *
   * @param message
   */
  public static logError(...message: any[]): void {
    const log = container.resolve<CallableFunction>('alt.logError');
    log(...message);
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
