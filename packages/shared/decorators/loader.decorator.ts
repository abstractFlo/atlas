import { container } from 'tsyringe';
import { LoaderService } from '../services';

/**
 * Add method to before queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 * @constructor
 */
export function Before(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
  return validateLoaderAndPush(target, propertyKey, 'before', descriptor);
}

/**
 * Add method to after queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 * @constructor
 */
export function After(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
  return validateLoaderAndPush(target, propertyKey, 'after', descriptor);
}

/**
 * Add method to afterBootstrap queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 * @constructor
 */
export function AfterBootstrap(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
  return validateLoaderAndPush(target, propertyKey, 'afterBootstrap', descriptor);
}

/**
 * Helper for adding method to specific queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {"before" | "after" | "afterBootstrap"} type
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | void}
 */
function validateLoaderAndPush(target: Object, propertyKey: string, type: 'before' | 'after' | 'afterBootstrap', descriptor: PropertyDescriptor): PropertyDescriptor | void {
  const loaderService = container.resolve(LoaderService);
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  loaderService.add(type, propertyKey, target.constructor.name);

  return descriptor;
}
