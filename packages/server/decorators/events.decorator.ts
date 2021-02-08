import { validateEventExistsAndPush } from '@abstractFlo/shared';

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnClient = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'onClient', eventName, propertyKey, descriptor);
  };
};

/**
 * Add onceClient event listencer
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnceClient = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    return validateEventExistsAndPush(target, 'onceClient', eventName, propertyKey, descriptor);
  };
};
