import { container, instanceCachingFactory } from 'tsyringe';

/**
 * Register class as string based dependency
 * @param target
 * @return {any}
 * @constructor
 */
export const StringResolver = (target: any) => {
  container.register(target.name, { useFactory: instanceCachingFactory(c => c.resolve(target)) });
  return target;
};
