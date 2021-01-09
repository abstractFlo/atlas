import { validateEventExistsAndPush } from '@abstractFlo/shared';
import { BaseObjectType } from 'alt-client';
import { container } from 'tsyringe';
import { EventService } from '../services';

/**
 * Add onServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnServer = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'onServer', eventName, propertyKey, descriptor);
  };
};

/**
 * Add onceServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnceServer = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'onceServer', eventName, propertyKey, descriptor);
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
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'onGui', eventName, propertyKey, descriptor);
  };
};

/**
 * GameEntityCreate Decorator
 *
 * @param {BaseObjectType} entityType
 * @returns {MethodDecorator}
 * @constructor
 */

export const GameEntityCreate = (entityType: BaseObjectType): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    return validateGameEntityExistsAndPush(target, 'gameEntityCreate', entityType, propertyKey, descriptor);
  };
};

/**
 * GameEntityDestroy Decorator
 *
 * @param {BaseObjectType} entityType
 * @returns {MethodDecorator}
 * @constructor
 */
export const GameEntityDestroy = (entityType: BaseObjectType): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    return validateGameEntityExistsAndPush(target, 'gameEntityDestroy', entityType, propertyKey, descriptor);
  };
};

/**
 * Helper for adding gameEntity Helpers
 *
 * @param {Object} target
 * @param {string} type
 * @param {BaseObjectType} entityType
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 */
function validateGameEntityExistsAndPush<T>(
    target: Object,
    type: string,
    entityType: BaseObjectType,
    propertyKey: string,
    descriptor: PropertyDescriptor): PropertyDescriptor | void {
  const eventService = container.resolve(EventService);
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  eventService.addGameEntityMethods(type, entityType, target.constructor.name, propertyKey);

  return descriptor;
}
