import { constructor } from '../types';
import { container, instanceCachingFactory, singleton } from 'tsyringe';

/**
 * Interface for all module decorator options
 */
export interface ModuleOptionsDecoratorInterface {
  import?: constructor<any>[],
  components?: constructor<any>[],
}

/**
 * Register class as string injection token and singleton and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @returns {ClassDecorator}
 * @constructor
 */
export function Module(): (targetConstructor: constructor<any>) => void {
  return function (targetConstructor: constructor<any>) {
    registerAsSingletonAndString(targetConstructor);
  };
}


/**
 * Register component decorator for singleton and stringed version
 *
 * @param {constructor<any>} targetConstructor
 * @return {constructor<any>}
 * @constructor
 */
export function Component(targetConstructor: constructor<any>) {
  registerAsSingletonAndString(targetConstructor);
}

/**
 * Helper for register as singleton and stringed version
 *
 * @param {constructor<any>} targetConstructor
 * @return {constructor<any>}
 */
function registerAsSingletonAndString(targetConstructor: constructor<any>): void {
  container.register(
      targetConstructor.name,
      { useFactory: instanceCachingFactory(c => c.resolve(targetConstructor)) }
  );

  singleton()(targetConstructor);
}
