import { MetadataKey, Target } from '@abraham/reflection';

/**
 * Return metadata for given key and target
 *
 * @param {MetadataKey} key
 * @param {Target} target
 * @param defaultValue
 * @return {T}
 */
export function getFrameworkMetaData<T>(key: MetadataKey, target: Target, defaultValue: any | any[] = []): T {
  return (Reflect.getMetadata<T>(key, target) || defaultValue) as T;
}

/**
 * Return a custom descriptor applied with its own properties
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
