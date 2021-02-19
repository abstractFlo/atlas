import { validateEventExistsAndPush, ValidateOptionsModel } from '@abstractflo/shared';
import { BaseObjectType, ColShapeType } from 'alt-server';

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnClient = (name?: string): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;
    const options = new ValidateOptionsModel().cast({ name: eventName });

    return validateEventExistsAndPush(target, 'onClient', propertyKey, descriptor, options);
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
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;
    const options = new ValidateOptionsModel().cast({ name: eventName });

    return validateEventExistsAndPush(target, 'onceClient', propertyKey, descriptor, options);
  };
};

/**
 * Add entityEnterColshape Listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
export const EntityEnterColShape = (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const options = new ValidateOptionsModel().cast({ colShapeType, name, entity, eventAddTo: 'colShape' });

    return validateEventExistsAndPush(
        target,
        'entityEnterColshape',
        propertyKey,
        descriptor,
        options
    );
  };
};

/**
 * Add entityLeaveColshape listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
export const EntityLeaveColShape = (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const options = new ValidateOptionsModel().cast({ colShapeType, name, entity, eventAddTo: 'colShape' });

    return validateEventExistsAndPush(
        target,
        'entityLeaveColshape',
        propertyKey,
        descriptor,
        options
    );
  };
};
