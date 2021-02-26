import { KEYS } from '../constants';
import { EventModel } from '../models';
import { container } from 'tsyringe';
import { BaseEventService } from '../services';

/**
 * Register @On decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const On = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const eventName = name || propertyKey;

    setReflectMetaData(KEYS.EVENTS_ON, {
      type: 'on',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        name: eventName
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @Once decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const Once = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const eventName = name || propertyKey;

    setReflectMetaData(KEYS.EVENTS_ONCE, {
      type: 'once',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register the override descriptor
 *
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 */
export function registerDescriptor(
    descriptor: PropertyDescriptor
): PropertyDescriptor {

  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  return descriptor;
}

/**
 * Setup metaData
 *
 * @param {string} key
 * @param {Partial<EventModel>} data
 */
export function setReflectMetaData(key: string, data: Partial<EventModel>): void {
  const eventService = container.resolve(BaseEventService);
  const config: EventModel[] = Reflect.getMetadata(key, eventService) || [];
  const eventModel = new EventModel().cast(data);

  config.push(eventModel);

  Reflect.defineMetadata(key, config, eventService);
}

