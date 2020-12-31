import { KeyEventService } from '../services';
import { container } from 'tsyringe';

/**
 * KeyUp Decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 * @constructor
 */
export const KeyUp = (key: number | string): MethodDecorator => createDecorator(key, 'keyup');

/**
 * KeyDown Decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 * @constructor
 */
export const KeyDown = (key: number | string): MethodDecorator => createDecorator(key, 'keydown');


/**
 * Helper for creating key event decorator
 *
 * @param {number | string} key
 * @param {string} type
 * @returns {MethodDecorator}
 */
function createDecorator(key: number | string, type: string): MethodDecorator {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const keyEventService = container.resolve(KeyEventService);
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    key = typeof key === 'string' ? key.charCodeAt(0) : key;
    keyEventService.add(type, key, target.constructor.name, propertyKey);

    return descriptor;
  };
}
