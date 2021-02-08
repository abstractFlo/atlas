import { container } from 'tsyringe';
import { EventServiceInterface } from '../core';

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
 * @param {string|BaseObjectType} entity
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @param {'base'|'gameEntity'|'metaChange'} eventAddTo
 * @param {string} metaKey
 * @returns {PropertyDescriptor | void}
 */
export function validateEventExistsAndPush<T>(
    target: Object,
    type: string,
    entity: string | number,
    propertyKey: string,
    descriptor: PropertyDescriptor,
    eventAddTo: 'base' | 'gameEntity' | 'metaChange' = 'base',
    metaKey?: string
): PropertyDescriptor | void {

  const eventService = container.resolve<EventServiceInterface>('EventService');
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  switch (eventAddTo) {
    case 'gameEntity':
    case 'metaChange':
      eventService.addHandlerMethods(type, entity, target.constructor.name, propertyKey, metaKey);
      break;
    default:
      eventService.add(type, String(entity), target.constructor.name, propertyKey);
      break;
  }
  return descriptor;
}
