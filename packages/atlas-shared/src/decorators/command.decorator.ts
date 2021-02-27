import { CommandEnums } from '../constants/command.constant';
import { container } from 'tsyringe';
import { CommandService } from '../services/command.service';
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
        CommandEnums.CONSOLE_COMMAND,
        commandService
    ) || [];

    propertiesConfig.push(config);

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    Reflect.defineMetadata(CommandEnums.CONSOLE_COMMAND, propertiesConfig, commandService);

    return descriptor;
  };
};
