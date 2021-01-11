import { container } from 'tsyringe';
import { CommandService } from '../services/command.service';


/**
 * Register command inside command.service
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const Cmd = (name?: string): MethodDecorator => {

  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {

    const commandName = name || propertyKey;
    const commandService = container.resolve(CommandService);
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    commandService.add(commandName, propertyKey, target.constructor.name);

    return descriptor;
  };
};
