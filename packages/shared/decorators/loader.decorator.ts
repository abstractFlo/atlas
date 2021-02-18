import { container } from 'tsyringe';
import { LoaderService } from '../services';

/**
 * Add method to before queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
export const Before = (doneCheckIntervalTime?: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    return validateLoaderAndPush(target, propertyKey, 'before', descriptor, doneCheckIntervalTime);
  };
};

/**
 * Add method to after queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
export const After = (doneCheckIntervalTime?: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    return validateLoaderAndPush(target, propertyKey, 'after', descriptor, doneCheckIntervalTime);
  };
};

/**
 * Add method to afterBootstrap queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
export const AfterBootstrap = (doneCheckIntervalTime?: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    return validateLoaderAndPush(target, propertyKey, 'afterBootstrap', descriptor, doneCheckIntervalTime);
  };
};

/**
 * Helper for adding method to specific queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {"before" | "after" | "afterBootstrap"} type
 * @param {PropertyDescriptor} descriptor
 * @param doneCheckIntervalTime
 * @returns {PropertyDescriptor | void}
 */
function validateLoaderAndPush(target: Object, propertyKey: string, type: 'before' | 'after' | 'afterBootstrap', descriptor: PropertyDescriptor, doneCheckIntervalTime: number): PropertyDescriptor | void {
  const loaderService = container.resolve(LoaderService);
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  loaderService.add(type, propertyKey, target.constructor.name, doneCheckIntervalTime);

  return descriptor;
}
