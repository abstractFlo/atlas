import { container, instanceCachingFactory } from 'tsyringe';
import { ModuleOptionsDecoratorInterface } from '../core/interfaces';
import { constructor } from 'tsyringe/dist/typings/types';

/**
 * Register class as string injection token and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @returns {ClassDecorator}
 * @constructor
 */
export function Module(options?: ModuleOptionsDecoratorInterface) {

  // Load imports
  if (options && options.imports) {
    options.imports.forEach((m: constructor<any>) => {
      container.register(m.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(m)) });
    });
  }

  return (constructor: constructor<any>) => {
    container.register(constructor.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(constructor)) });
    return constructor;
  };
}
