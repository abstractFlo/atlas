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
    const eventName = name || propertyKey;

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
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'once', eventName, propertyKey, descriptor);
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

  //const eventName = UtilsService.convertToEventName(name);

  eventService.add(type, name, target.constructor.name, propertyKey);

  return descriptor;

}
