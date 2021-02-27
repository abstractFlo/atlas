import { EventEnum, registerDescriptor, setReflectMetaData } from '@abstractflo/atlas-shared';
import { BaseObjectType, ColShapeType } from 'alt-server';

/**
 * Register @OnClient decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnClient = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventEnum.ON_CLIENT, {
      type: 'onClient',
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
 * Register @OnceClient decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnceClient = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventEnum.ONCE_CLIENT, {
      type: 'onceClient',
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
 * Register @SyncedMetaChange decorator
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const SyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    setReflectMetaData(EventEnum.SYNCED_META_CHANGE, {
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

/**
 * Register @EntityEnterColShape decorator
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
export const EntityEnterColShape = (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventEnum.ENTITY_ENTER_COLSHAPE, {
      type: 'entityEnterColShape',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        colShapeType,
        name,
        entity,
        eventAddTo: 'colShape'
      }
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @EntityLeaveColShape decorator
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
export const EntityLeaveColShape = (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setReflectMetaData(EventEnum.ENTITY_LEAVE_COLSHAPE, {
      type: 'entityLeaveColShape',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        colShapeType,
        name,
        entity,
        eventAddTo: 'colShape'
      }
    });

    return registerDescriptor(descriptor);
  };
};
