import { container } from 'tsyringe';
import { EventServiceInterface } from '../core';
import { ValidateOptionsModel } from '../models';

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
    const options = new ValidateOptionsModel().cast({ name: eventName });
    return validateEventExistsAndPush(target, 'on', propertyKey, descriptor, options);
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
    const options = new ValidateOptionsModel().cast({ name: eventName });
    return validateEventExistsAndPush(target, 'once', propertyKey, descriptor, options);
  };
};

/**
 * Helper for adding events
 *
 * @param {Object} target
 * @param {string} type
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @param options
 * @returns {PropertyDescriptor | void}
 */
export function validateEventExistsAndPush<T>(
    target: Object,
    type: string,
    propertyKey: string,
    descriptor: PropertyDescriptor,
    options: ValidateOptionsModel
): PropertyDescriptor | void {

  const eventService = container.resolve<EventServiceInterface>('EventService');
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  switch (options.eventAddTo) {
    case 'gameEntity':
    case 'metaChange':
    case 'colShape':
      eventService.addHandlerMethods(type, target.constructor.name, propertyKey, options);
      break;
    default:
      eventService.add(type, target.constructor.name, propertyKey, options);
      break;
  }
  return descriptor;
}
