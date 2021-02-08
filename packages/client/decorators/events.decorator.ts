import { BaseObjectTypeConfig, validateEventExistsAndPush } from '@abstractFlo/shared';

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
 * @param {typeof BaseObjectTypeConfig} entityType
 * @returns {MethodDecorator}
 * @constructor
 */

export const GameEntityCreate = (entityType: keyof typeof BaseObjectTypeConfig): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const entity = BaseObjectTypeConfig[entityType];
    return validateEventExistsAndPush(target, 'gameEntityCreate', entity, propertyKey, descriptor, 'gameEntity');
  };
};

/**
 * GameEntityDestroy Decorator
 *
 * @param {typeof BaseObjectTypeConfig} entityType
 * @returns {MethodDecorator}
 * @constructor
 */
export const GameEntityDestroy = (entityType: keyof typeof BaseObjectTypeConfig): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const entity = BaseObjectTypeConfig[entityType];
    return validateEventExistsAndPush(target, 'gameEntityDestroy', entity, propertyKey, descriptor, 'gameEntity');
  };
};

/**
 * Decorate streamSyncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {typeof BaseObjectTypeConfig} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const StreamSyncedMetaChange = (entityType: keyof typeof BaseObjectTypeConfig, metaKey?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const entity = BaseObjectTypeConfig[entityType];

    return validateEventExistsAndPush(
        target,
        'streamSyncedMetaChange',
        entity,
        propertyKey,
        descriptor,
        'metaChange',
        metaKey
    );
  };
};

/**
 * Decorate syncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {typeof BaseObjectTypeConfig} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const SyncedMetaChange = (entityType: keyof typeof BaseObjectTypeConfig, metaKey?: string): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const entity = BaseObjectTypeConfig[entityType];

    return validateEventExistsAndPush(
        target,
        'syncedMetaChange',
        entity,
        propertyKey,
        descriptor,
        'metaChange',
        metaKey
    );
  };
};
