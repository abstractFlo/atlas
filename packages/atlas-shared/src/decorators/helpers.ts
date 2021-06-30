import { container, instanceCachingFactory } from 'tsyringe';
import { constructor } from '../types/constructor';

/**
 * Register the override descriptor
 *
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 */
export function registerDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  return descriptor;
}

/**
 * Register class as string based dependency
 * @param target
 * @return {any}
 * @constructor
 */
export const StringResolver = (target: constructor<any>) => {
  container.register(target.name, {
    useFactory: instanceCachingFactory((c) => c.resolve(target)),
  });
  return target;
};

/**
 * Helper around Reflect.getMetadata
 *
 * @param {string} key
 * @param {any} target
 * @param {T} defaultValue
 * @return {T}
 */
export function getAtlasMetaData<T>(key: string, target: any, defaultValue: any | any[] = []): T {
  return (Reflect.getMetadata<T>(key, target) || defaultValue) as T;
}
