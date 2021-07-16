import { InjectionToken } from 'tsyringe';
import { Internal } from '../internal';
import { app } from '../di-container';

export class UtilsService {
	/**
	 * Auto clear setTimeout
	 *
	 * @param {Function} listener
	 * @param {number} duration
	 */
	public static autoClearSetTimeout(listener: CallableFunction, duration: number): void {
		const timeout = this.setTimeout(async () => {
			await listener();
			this.clearTimeout(timeout);
		}, duration);
	}

	/**
	 * Run a setTimeout
	 *
	 * @param {Function} listener
	 * @param {number} duration
	 * @return {number}
	 */
	public static setTimeout(listener: CallableFunction, duration: number): number {
		const setTimeoutFn = this.resolveFromContainer(Internal.Alt_Set_Timeout);

		return setTimeoutFn(async () => {
			await listener();
		}, duration);
	}

	/**
	 * Run an interval
	 *
	 * @param {Function} listener
	 * @param {number} milliseconds
	 * @return {number}
	 */
	public static setInterval(listener: CallableFunction, milliseconds: number): number {
		const setIntervalFn = this.resolveFromContainer(Internal.Alt_Set_Interval);
		return setIntervalFn(listener, milliseconds);
	}

	/**
	 * Run an everyTick Timer
	 *
	 * @param {Function} listener
	 * @return {number}
	 */
	public static everyTick(listener: CallableFunction): number {
		const everyTickFn = this.resolveFromContainer(Internal.Alt_Every_Tick);
		return everyTickFn(listener);
	}

	/**
	 * Run an interval and clear after duration
	 *
	 * @param {Function} listener
	 * @param {number} milliseconds
	 * @param {number} intervalDuration
	 */
	public static autoClearInterval(listener: CallableFunction, milliseconds: number, intervalDuration: number): void {
		const interval = this.setInterval(listener, milliseconds);

		this.setTimeout(() => {
			this.clearInterval(interval);
		}, intervalDuration);
	}

	/**
	 * Run an nextTick
	 *
	 * @param {Function} listener
	 * @return {number}
	 */
	public static nextTick(listener: CallableFunction): number {
		const nextTickFn = this.resolveFromContainer(Internal.Alt_Next_Tick);
		return nextTickFn(listener);
	}

	/**
	 * Clear given timeout
	 *
	 * @param {number} timeout
	 */
	public static clearTimeout(timeout: number): void {
		const clearTimeoutFn = this.resolveFromContainer(Internal.Alt_Clear_Timeout);
		clearTimeoutFn(timeout);
	}

	/**
	 * Clear given interval
	 *
	 * @param {number} interval
	 */
	public static clearInterval(interval: number): void {
		const clearIntervalFn = this.resolveFromContainer(Internal.Alt_Clear_Interval);
		clearIntervalFn(interval);
	}

	/**
	 * Clear given nextTick
	 *
	 * @param {number} tick
	 */
	public static clearNextTick(tick: number): void {
		const clearNextTickFn = this.resolveFromContainer(Internal.Alt_Clear_Next_Tick);
		clearNextTickFn(tick);
	}

	/**
	 * Clear given everyTick
	 *
	 * @param {number} tick
	 */
	public static clearEveryTick(tick: number): void {
		const clearEveryTick = this.resolveFromContainer(Internal.Alt_Clear_Every_Tick);
		clearEveryTick(tick);
	}

	/**
	 * Add normal message to log
	 *
	 * @param messages
	 */
	public static log(...messages: any[]): void {
		const log = this.resolveFromContainer(Internal.Alt_Log);
		log(...messages);
	}

	/**
	 * Add warning message to log
	 *
	 * @param messages
	 */
	public static logWarning(...messages: any[]): void {
		const logWarning = this.resolveFromContainer(Internal.Alt_Log_Warning);
		logWarning(...messages);
	}

	/**
	 * Add error message to log
	 *
	 * @param messages
	 */
	public static logError(...messages: any[]): void {
		const logError = this.resolveFromContainer(Internal.Alt_Log_Error);
		logError(...messages);
	}

	/**
	 * Add loaded message to log
	 *
	 * @param messages
	 */
	public static logLoaded(...messages: any[]): void {
		messages.forEach((message: any) => this.log(`Loaded ~lg~${message}~w~`));
	}

	/**
	 * Add unloaded message to log
	 *
	 * @param messages
	 */
	public static logUnloaded(...messages: any[]): void {
		messages.forEach((message: any) => this.log(`Unloaded ~lg~${message}~w~`));
	}

	/**
	 * Log registered handler with length
	 *
	 * @param {string} name
	 * @param {number} length
	 */
	public static logRegisteredHandlers(name: string, length: number): void {
		if (this.isProduction()) return;
		this.log(`Registered all handlers for ~lg~${name}~w~ - ~y~[${length}]~w~`);
	}

	public static isProduction(toggle: boolean = false): boolean {
		return (typeof process !== 'undefined' && process.env.ATLAS_PRODUCTION === 'true') || toggle;
	}

	/**
	 * Receive on event helper
	 *
	 * @param {string} eventName
	 * @param {(...args: any[]) => void} listener
	 */
	public static eventOn(eventName: string, listener: (...args: any[]) => void): void {
		const eventHandler = this.resolveFromContainer(Internal.Alt_On);
		eventHandler(eventName, listener);
	}

	/**
	 * Receive once event helper
	 *
	 * @param {string} eventName
	 * @param {(...args: any[]) => void} listener
	 */
	public static eventOnce(eventName: string, listener: (...args: any[]) => void): void {
		const eventHandler = this.resolveFromContainer(Internal.Alt_Once);
		eventHandler(eventName, listener);
	}

	/**
	 * Unsubscribe from event
	 *
	 * @param {string} eventName
	 * @param {(...args: any[]) => void} listener
	 */
	public static eventOff(eventName: string, listener: (...args: any[]) => void): void {
		const eventHandler = this.resolveFromContainer(Internal.Alt_Off);
		eventHandler(eventName, listener);
	}

	/**
	 * Emit event helper
	 *
	 * @param {string} eventName
	 * @param args
	 */
	public static eventEmit(eventName: string, ...args: any[]): void {
		const eventHandler = this.resolveFromContainer(Internal.Alt_Emit);
		eventHandler(eventName, ...args);
	}

	/**
	 * Setup new command prefix
	 *
	 * @param {string} prefix
	 */

	/*public static setCommandPrefix(prefix: string): void {
		const commandService = app.resolve(CommandService);
		commandService.setPrefix(prefix);
	}*/

	/**
	 * Resolve from container as callableFunction
	 *
	 * @param {InjectionToken} token
	 * @return {Function}
	 * @private
	 */
	private static resolveFromContainer(token: InjectionToken): CallableFunction {
		return app.resolve<CallableFunction>(token);
	}
}
