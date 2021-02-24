import { KEYS } from '../constants/decorator.constants';
import { container } from 'tsyringe';
import { CommandService } from '../services';
import { CommandModel } from '../models/command.model';

export const Cmd = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {

    const commandName = name || String(propertyKey);
    const original = descriptor.value;
    const config = new CommandModel().cast({
      name: commandName,
      target: target.constructor.name,
      methodName: propertyKey
    });

    const commandService = container.resolve(CommandService);
    const propertiesConfig: CommandModel[] = Reflect.getMetadata(KEYS.COMMANDS, commandService) || [];

    propertiesConfig.push(config);

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    Reflect.defineMetadata(KEYS.COMMANDS, propertiesConfig, commandService);

    return descriptor;
  };
};
