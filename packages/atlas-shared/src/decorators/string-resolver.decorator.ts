import { container, instanceCachingFactory } from 'tsyringe';
import { constructor } from '../types';

/**
 * Register class as string based dependency
 * @param target
 * @return {any}
 * @constructor
 */
export const StringResolver = (target: constructor<any>) => {
  container.register(target.name, { useFactory: instanceCachingFactory(c => c.resolve(target)) });
  return target;
};
