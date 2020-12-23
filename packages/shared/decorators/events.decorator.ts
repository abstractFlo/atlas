import { container } from 'tsyringe';
import { EventServiceInterface, UtilsService } from '@abstractFlo/shared';

/**
 * Add on event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const On = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    let eventName = name || propertyKey;
    eventName = UtilsService.convertToEventName(eventName);

    return validateEventExistsAndPush(target, 'on', eventName, propertyKey, descriptor);
  };
};

/**
 * Add once event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const Once = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    let eventName = name || propertyKey;
    eventName = UtilsService.convertToEventName(eventName);

    return validateEventExistsAndPush(target, 'once', eventName, propertyKey, descriptor);
  };
};


/**
 * Add onGui event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnGui = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    let eventName = name || propertyKey;
    eventName = UtilsService.convertToEventName(eventName);

    return validateEventExistsAndPush(target, 'onGui', eventName, propertyKey, descriptor);
  };
};

/**
 * Helper for adding events
 *
 * @param {Object} target
 * @param {string} type
 * @param {string} name
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 */
export function validateEventExistsAndPush<T>(
    target: Object,
    type: string,
    name: string,
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor | void {
  const eventService = container.resolve<EventServiceInterface>('EventService');
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  eventService.add(type, name, target.constructor.name, propertyKey);

  return descriptor;

}
