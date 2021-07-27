import { Internal, registerDescriptor, setEventServiceReflectMetaData } from '@abstractflo/atlas-shared';
import { BaseObjectType, ColShapeType } from 'alt-server';

/**
 * Register @OnClient decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
function OnClient(name: string): MethodDecorator;
function OnClient(resetable: boolean): MethodDecorator;
function OnClient(name: string, resetable: boolean): MethodDecorator;
function OnClient(name?: string, resetable?: boolean): MethodDecorator;
function OnClient(name?: string | boolean, resetable?: boolean): MethodDecorator {
  return (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor | void => {
    const eventName = typeof name !== 'boolean' && name || propertyKey;

    setEventServiceReflectMetaData(Internal.Events_On_Client, {
      type: 'onClient',
      eventName,
      resetable: typeof name !== 'boolean' ? resetable : name,
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
  return (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(Internal.Events_Once_Client, {
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
 * Register decorated method for offClient handler
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OffClient = (name?: string): MethodDecorator => {
  return function (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(Internal.Events_OffClient, {
      type: 'offServer',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name
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
  return (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor | void => {
    setEventServiceReflectMetaData(Internal.Events_Synced_Meta_Change, {
      type: 'syncedMetaChange',
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        entity: entityType,
        metaKey
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
export const EntityEnterColShape = (
    colShapeType: ColShapeType,
    name?: string,
    entity?: BaseObjectType
): MethodDecorator => {
  return (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(Internal.Events_Entity_Enter_Col_Shape, {
      type: 'entityEnterColshape',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        colShapeType,
        name,
        entity
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
export const EntityLeaveColShape = (
    colShapeType: ColShapeType,
    name?: string,
    entity?: BaseObjectType
): MethodDecorator => {
  return (
      target: Record<string, unknown>,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ): PropertyDescriptor | void => {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(Internal.Events_Entity_Leave_Col_Shape, {
      type: 'entityLeaveColshape',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        colShapeType,
        name,
        entity
      }
    });

    return registerDescriptor(descriptor);
  };
};

export { OnClient };
