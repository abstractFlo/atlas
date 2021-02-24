import { CommandService } from '../services/command.service';
import { KEYS } from '../constants/decorator.constants';

export const Cmd = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {

    const commandName = name || String(propertyKey);
    const original = descriptor.value;
    const config = {
      commandName,
      target: target.constructor.name
    };


    const propertiesConfig: { [key: string]: any } = Reflect.getMetadata(KEYS.COMMANDS, CommandService) || {};

    propertiesConfig[String(propertyKey)] = config;

    Reflect.defineMetadata(KEYS.COMMANDS, propertiesConfig, CommandService);

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  };
};
