import { getFrameworkMetaData, registerDescriptor } from './helpers';
import { TimerModel } from '../models/timer.model';
import { TimerManagerService } from '../services/timer-manager.service';
import { app } from '../di-container';
import { Internal } from '../internal';

/**
 * Register @Interval decorator
 *
 * @param {string} name
 * @param {number} duration
 * @return {MethodDecorator}
 * @constructor
 */
export const Interval = (name: string, duration: number): MethodDecorator =>
	(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void =>
		addTimerMetaData(name, duration, 'interval', target, propertyKey, descriptor);

/**
 * Create @EveryTick decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const EveryTick = (name: string): MethodDecorator =>
	(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void =>
		addTimerMetaData(name, 0, 'everyTick', target, propertyKey, descriptor);


/**
 * Add new timer to service meta data
 *
 * @param {string} name
 * @param {number} duration
 * @param {string} type
 * @param {Object} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 */
function addTimerMetaData(
	name: string,
	duration: number,
	type: string, target: Object,
	propertyKey: string,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
	const timeManager = app.resolve(TimerManagerService);
	const timers: TimerModel[] = getFrameworkMetaData(Internal.Timer_Manager, timeManager, []);

	const newTimer = new TimerModel().cast({
		type,
		duration,
		identifier: name,
		methodName: propertyKey,
		targetName: target.constructor.name
	});

	timers.push(newTimer);

	Reflect.defineMetadata<TimerModel[]>(Internal.Timer_Manager, timers, timeManager);

	return registerDescriptor(descriptor);
}
