import { getAtlasMetaData, registerDescriptor } from './helpers';
import { container } from 'tsyringe';
import { TimerManagerService } from '../services/timer-manager.service';
import { TimerConstants } from '../constants/timer.constants';
import { TimerModel } from '../models/timer.model';

/**
 * Register @Interval decorator
 *
 * @param {string} name
 * @param {number} duration
 * @return {MethodDecorator}
 * @constructor
 */
export const Interval = (name: string, duration: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const timeManager = container.resolve(TimerManagerService);
    const timers: TimerModel[] = getAtlasMetaData(TimerConstants.TIMERS, timeManager, []);

    const newTimer = new TimerModel().cast({
      identifier: name,
      type: 'interval',
      targetName: target.constructor.name,
      methodName: propertyKey,
      duration,
    });

    timers.push(newTimer);

    Reflect.defineMetadata<TimerModel[]>(TimerConstants.TIMERS, timers, timeManager);

    return registerDescriptor(descriptor);
  };
};

/**
 * Create @EveryTick decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const EveryTick = (name: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const timeManager = container.resolve(TimerManagerService);
    const timers: TimerModel[] = getAtlasMetaData(TimerConstants.TIMERS, timeManager, []);

    const newTimer = new TimerModel().cast({
      identifier: name,
      type: 'everyTick',
      targetName: target.constructor.name,
      methodName: propertyKey,
    });

    timers.push(newTimer);

    Reflect.defineMetadata<TimerModel[]>(TimerConstants.TIMERS, timers, timeManager);

    return registerDescriptor(descriptor);
  };
};
