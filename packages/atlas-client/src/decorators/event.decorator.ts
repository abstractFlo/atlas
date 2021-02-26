import { EventConstants, registerDescriptor, setReflectMetaData } from '@abstractflo/atlas-shared';
import { BaseObjectType } from 'alt-client';

/**
 * Register @OnServer decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnServer = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventConstants.ON_SERVER, {
      type: 'onServer',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        name: eventName
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @OnceServer decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnceServer = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventConstants.ONCE_SERVER, {
      type: 'onceServer',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        name: eventName
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @OnGui decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnGui = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventConstants.ON_GUI, {
      type: 'onGui',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        name: eventName
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @GameEntityCreate decorator
 *
 * @param {BaseObjectType} entityType
 * @return {MethodDecorator}
 * @constructor
 */
export const GameEntityCreate = (entityType: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    setReflectMetaData(EventConstants.GAME_ENTITY_CREATE, {
      type: 'gameEntityCreate',
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        entity: entityType,
        eventAddTo: 'gameEntity'
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @GameEntityDestroy decorator
 *
 * @param {BaseObjectType} entityType
 * @return {MethodDecorator}
 * @constructor
 */
export const GameEntityDestroy = (entityType: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    setReflectMetaData(EventConstants.GAME_ENTITY_DESTROY, {
      type: 'gameEntityCreate',
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        entity: entityType,
        eventAddTo: 'gameEntity'
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @StreamSyncedMetaChange decorator
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const StreamSyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    setReflectMetaData(EventConstants.STREAM_SYNCED_META_CHANGE, {
      type: 'streamSyncedMetaChange',
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        entity: entityType,
        metaKey,
        eventAddTo: 'metaChange'
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @SyncedMetaChange decorator
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const SyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    setReflectMetaData(EventConstants.SYNCED_META_CHANGE, {
      type: 'syncedMetaChange',
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        entity: entityType,
        metaKey,
        eventAddTo: 'metaChange'
      }
    });

    return registerDescriptor(descriptor);
  };
};
