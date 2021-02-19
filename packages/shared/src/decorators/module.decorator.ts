import { container } from 'tsyringe';
import { ModuleOptionsDecoratorInterface } from '../core/interfaces';
import { constructor } from 'tsyringe/dist/typings/types';
import { ModuleLoaderService } from '../services/module-loader.service';
import { UtilsService } from '../services';

/**
 * Register class as string injection token and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @returns {ClassDecorator}
 * @constructor
 */
export function Module(options?: ModuleOptionsDecoratorInterface) {

  const moduleLoaderService = container.resolve(ModuleLoaderService);

  // Load imports and Components
  if (options) {
    if (options.imports) {
      options.imports.forEach((m: constructor<any>) => moduleLoaderService.add(m));
    }

    if (options.components) {
      options.components.forEach((m: constructor<any>) => moduleLoaderService.add(m));
    }
  }

  return (constructor: constructor<any>) => {
    moduleLoaderService.add(constructor);
    return constructor;
  };
}
