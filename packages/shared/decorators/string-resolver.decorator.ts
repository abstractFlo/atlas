import { container, instanceCachingFactory } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';

/**
 * Register class as string injection token
 *
 * @param {constructor<any>} constructor
 * @returns {constructor<any>}
 * @constructor
 */
export const StringResolver = (constructor: any) => {
  container.register(constructor.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(constructor)) });
  return constructor;
};
