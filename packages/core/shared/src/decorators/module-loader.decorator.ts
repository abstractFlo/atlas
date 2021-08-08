import { Singleton } from './framework-di.decorator';
import { constructor } from '../interfaces/constructor.interface';
import { app } from '../di-container';
import { ModuleLoaderService } from '../services/module-loader.service';
import { getFrameworkMetaData } from './helpers';
import { LoaderConstant } from '../constants/loader.constant';
import { ModuleOptionsDecoratorInterface } from '../interfaces/module-loader-options.interfac';

/**
 * Alias for singleton decorator
 *
 * @param {constructor<any>} targetConstructor
 * @return {constructor<any>}
 * @constructor
 */
export const Component = (targetConstructor: constructor<any>) => Singleton(targetConstructor);

/**
 * Alias for singleton decorator, but this loads all imports and components
 *
 * @param options
 * @return {(targetConstructor: constructor<any>) => void}
 * @constructor
 */
export function Module(options?: ModuleOptionsDecoratorInterface): (targetConstructor: constructor<any>) => void {

  if (options && (options.components || options.imports)) {
    const moduleLoaderService = app.resolve(ModuleLoaderService);

    addMetaData(LoaderConstant.COMPONENT, moduleLoaderService, options.components || []);
    addMetaData(LoaderConstant.MODULE, moduleLoaderService, options.imports || []);
  }

  return (targetConstructor: constructor<any>) => Singleton(targetConstructor);
}

/**
 * Create or update reflect metadata for given key
 *
 * @param {symbol} key
 * @param {constructor<any>} target
 * @param {constructor<any>[]} newProperties
 */
function addMetaData(key: symbol, target: any, newProperties: constructor<any>[]): void {
  newProperties.forEach((newProperty: constructor<any>) => {
    const properties = getFrameworkMetaData<constructor<any>[]>(key, target);
    const alreadyExists = properties.find((property: constructor<any>) => property === newProperty);

    if (alreadyExists) return;

    properties.push(newProperty);

    Reflect.defineMetadata<constructor<any>[]>(key, properties, target);
  });
}
