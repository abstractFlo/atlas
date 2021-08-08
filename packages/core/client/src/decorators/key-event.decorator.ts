import {
  EventModel,
  eventServiceTarget,
  getFrameworkMetaData,
  Internal,
  registerDescriptor,
  setEventServiceReflectMetaData
} from '@abstractflo/atlas-shared';

/**
 * Register @KeyUp decorator
 *
 * @param {number | string} key
 * @return {MethodDecorator}
 * @constructor
 */
export const KeyUp = (key: number | string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    registerKeyEvent(key, target, propertyKey, 'keyup', Internal.Events_Key_Up);
    return registerDescriptor(descriptor);
  };
};

/**
 * Register @KeyDown decorator
 *
 * @param {number | string} key
 * @return {MethodDecorator}
 * @constructor
 */
export const KeyDown = (key: number | string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    registerKeyEvent(key, target, propertyKey, 'keydown', Internal.Events_Key_Down);
    return registerDescriptor(descriptor);
  };
};

/**
 * Helper for key event register
 *
 * @param {string | number} key
 * @param {Object} target
 * @param {string} propertyKey
 * @param {string} type
 * @param {string} metaDataKey
 */
function registerKeyEvent(
    key: string | number,
    target: Object,
    propertyKey: string,
    type: 'keyup' | 'keydown',
    metaDataKey: string
): void {
  const keyValue = typeof key === 'string' ? key.charCodeAt(0) : key;
  const events = getFrameworkMetaData<EventModel[]>(metaDataKey, eventServiceTarget());
  const alreadyExists = events.find((event: EventModel) => event.validateOptions.keyboardKey === keyValue);

  if (!alreadyExists) {
    setEventServiceReflectMetaData(metaDataKey, {
      type,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        keyboardKey: keyValue
      }
    });
  }
}
