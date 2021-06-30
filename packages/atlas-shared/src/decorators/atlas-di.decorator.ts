import { container, singleton } from 'tsyringe';
import { ModuleLoaderService } from '../services/module-loader.service';
import { ModuleLoaderEnum } from '../constants/module-loader.constant';
import { getAtlasMetaData, StringResolver } from './helpers';
import { constructor } from '../types/constructor';

/**
 * Interface for all module decorator options
 */
export interface ModuleOptionsDecoratorInterface {
  imports?: constructor<any>[];
  components?: constructor<any>[];
}

/**
 * Register class as string injection token and singleton and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @return {(targetConstructor: constructor<any>) => void}
 * @constructor
 */
export function Module(options?: ModuleOptionsDecoratorInterface): (targetConstructor: constructor<any>) => void {
  if (options && (options.components || options.imports)) {
    const moduleLoaderService = container.resolve(ModuleLoaderService);

    if (options.components) {
      options.components.forEach((component: constructor<any>) => addMetaData(ModuleLoaderEnum.COMPONENTS, component, moduleLoaderService));
    }

    if (options.imports) {
      options.imports.forEach((importedModule: constructor<any>) =>
        addMetaData(ModuleLoaderEnum.IMPORTS, importedModule, moduleLoaderService),
      );
    }
  }

  return function (targetConstructor: constructor<any>) {
    registerAsSingletonAndString(targetConstructor);
  };
}

/**
 * Register component decorator for singleton and stringed version
 *
 * @return {(targetConstructor: constructor<any>) => void}
 * @constructor
 */
export function Component(): (targetConstructor: constructor<any>) => void {
  return function (targetConstructor: constructor<any>) {
    registerAsSingletonAndString(targetConstructor);
  };
}

/**
 * Helper for register as singleton and stringed version
 *
 * @param {constructor<any>} targetConstructor
 * @return {constructor<any>}
 */
function registerAsSingletonAndString(targetConstructor: constructor<any>): constructor<any> {
  singleton()(targetConstructor);
  StringResolver(targetConstructor);

  return targetConstructor;
}

/**
 * Create or update reflect metadata for given key
 *
 * @param {string} key
 * @param newProperty
 * @param {constructor<any>} target
 */
function addMetaData(key: string, newProperty: constructor<any>, target: any): void {
  const properties = getAtlasMetaData<constructor<any>[]>(key, target);
  const alreadyExists = properties.find((property: constructor<any>) => property === newProperty);

  if (alreadyExists) return;

  properties.push(newProperty);

  Reflect.defineMetadata<constructor<any>[]>(key, properties, target);
}
