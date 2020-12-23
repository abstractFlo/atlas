import { ClientEvents } from 'discord.js';
import { container } from 'tsyringe';
import { DiscordBotService } from '../services/discord-bot.service';

/**
 * Add OnDiscord event listener
 *
 * @param {K} name
 * @returns {MethodDecorator}
 * @constructor
 */
export const OnDiscord = <K extends keyof ClientEvents>(name?: K): MethodDecorator => {
  return <T>(target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    const eventName = name || propertyKey;
    const discordBotService = container.resolve(DiscordBotService);
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    discordBotService.add(eventName, target.constructor.name, propertyKey);

    return descriptor;

  };
};
