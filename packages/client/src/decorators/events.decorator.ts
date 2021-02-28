import { validateEventExistsAndPush, ValidateOptionsModel } from '@abstractflo/atlas-shared';
import { BaseObjectType } from 'alt-client';

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
    const options = new ValidateOptionsModel().cast({ name: eventName });

    return validateEventExistsAndPush(target, 'onServer', propertyKey, descriptor, options);
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
    const options = new ValidateOptionsModel().cast({ name: eventName });

    return validateEventExistsAndPush(target, 'onceServer', propertyKey, descriptor, options);
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
    const options = new ValidateOptionsModel().cast({ name: eventName });

    return validateEventExistsAndPush(target, 'onGui', propertyKey, descriptor, options);
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
    const options = new ValidateOptionsModel().cast({ entity: entityType, eventAddTo: 'gameEntity' });

    return validateEventExistsAndPush(target, 'gameEntityCreate', propertyKey, descriptor, options);
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
    const options = new ValidateOptionsModel().cast({ entity: entityType, eventAddTo: 'gameEntity' });

    return validateEventExistsAndPush(target, 'gameEntityDestroy', propertyKey, descriptor, options);
  };
};

/**
 * Decorate streamSyncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const StreamSyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const options = new ValidateOptionsModel().cast({ entity: entityType, metaKey, eventAddTo: 'metaChange' });

    return validateEventExistsAndPush(
        target,
        'streamSyncedMetaChange',
        propertyKey,
        descriptor,
        options
    );
  };
};

/**
 * Decorate syncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const SyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const options = new ValidateOptionsModel().cast({ entity: entityType, metaKey, eventAddTo: 'metaChange' });

    return validateEventExistsAndPush(
        target,
        'syncedMetaChange',
        propertyKey,
        descriptor,
        options
    );
  };
};
