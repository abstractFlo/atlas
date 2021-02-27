import { constructor } from '../types';
import { container, singleton } from 'tsyringe';
import { StringResolver } from './string-resolver.decorator';
import { ModuleLoaderService } from '../services/module-loader.service';
import { ModuleLoaderEnum } from '../constants/module-loader.constant';

/**
 * Interface for all module decorator options
 */
export interface ModuleOptionsDecoratorInterface {
  imports?: constructor<any>[],
  components?: constructor<any>[],
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
      options.components.forEach((component: constructor<any>) =>
          createOrUpdateMetaData(
              ModuleLoaderEnum.COMPONENTS,
              component,
              moduleLoaderService
          ));
    }

    if (options.imports) {
      options.imports.forEach((importedModule: constructor<any>) =>
          createOrUpdateMetaData(
              ModuleLoaderEnum.IMPORTS,
              importedModule,
              moduleLoaderService
          ));
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
 * @param {constructor<any>} config
 * @param {constructor<any>} target
 */
function createOrUpdateMetaData(key: string, config: constructor<any>, target: any): void {
  const properties: constructor<any>[] = Reflect.getMetadata(key, target) || [];
  const alreadyExists = properties.filter((property: constructor<any>) => property === config);

  if (alreadyExists.length) return;

  properties.push(config);

  Reflect.defineMetadata(key, properties, target);

}
