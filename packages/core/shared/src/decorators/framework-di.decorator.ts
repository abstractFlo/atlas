import { constructor } from '../interfaces/constructor.interface';
import { injectable, instanceCachingFactory, singleton } from 'tsyringe';
import { app } from '../di-container';


/**
 * Register a class as a String inside container
 *
 * if name is set, the class would register as this, otherwise the constructor name would used
 *
 * @return {constructor<any>}
 * @constructor
 */
export const RegisterClassAsString = (targetConstructor: constructor<any>) => {
  app.register(
      targetConstructor.name,
      { useFactory: instanceCachingFactory((c) => c.resolve(targetConstructor)) }
  );
  return targetConstructor;
};

/**
 * Register a class as singleton with string resolver
 *
 * @return {(targetConstructor: constructor<any>) => constructor<any>}
 * @constructor
 */
export const Singleton = (targetConstructor: constructor<any>) => {
  singleton()(targetConstructor);
  RegisterClassAsString(targetConstructor);
  return targetConstructor;
};

/**
 * Register a class as injectable with string resolver
 *
 * @return {(targetConstructor: constructor<any>) => constructor<any>}
 * @constructor
 */
export const Injectable = (targetConstructor: constructor<any>) => {
  injectable()(targetConstructor);
  RegisterClassAsString(targetConstructor);
  return targetConstructor;
};

