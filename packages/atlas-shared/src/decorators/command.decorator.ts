import { CommandConstants } from '../constants/command.constants';
import { container } from 'tsyringe';
import { CommandService } from '../services';
import { CommandModel } from '../models/command.model';

/**
 * Register new console command
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const Cmd = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {

    const commandName = name || propertyKey;
    const original = descriptor.value;
    const config = new CommandModel().cast({
      name: commandName,
      target: target.constructor.name,
      methodName: propertyKey
    });

    const commandService = container.resolve(CommandService);
    const propertiesConfig: CommandModel[] = Reflect.getMetadata(
        CommandConstants.CONSOLE_COMMAND,
        commandService
    ) || [];

    propertiesConfig.push(config);

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    Reflect.defineMetadata(CommandConstants.CONSOLE_COMMAND, propertiesConfig, commandService);

    return descriptor;
  };
};