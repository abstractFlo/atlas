import { LoggerService, validateEventExistsAndPush } from '@abstractFlo/shared';
import { container } from 'tsyringe';

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
