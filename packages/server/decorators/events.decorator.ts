import { UtilsService, validateEventExistsAndPush } from '@abstractFlo/shared';

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnClient = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    let eventName = name || propertyKey;
    eventName = UtilsService.convertToEventName(eventName);

    return validateEventExistsAndPush(target, 'onClient', eventName, propertyKey, descriptor);
  };
};

/**
 * Add onceClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnceClient = (name?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    let eventName = name || propertyKey;
    eventName = UtilsService.convertToEventName(eventName);

    return validateEventExistsAndPush(target, 'onceClient', eventName, propertyKey, descriptor);
  };
};
