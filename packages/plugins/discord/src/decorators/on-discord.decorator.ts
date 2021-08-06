import { app, constructor, getFrameworkMetaData, registerDescriptor } from '@abstractflo/atlas-shared';
import { DiscordBotService } from '../services/discord-bot.service';
import { OnDiscordModel } from '../models/on-discord.model';
import { ClientEvents, ON_DISCORD } from '../interfaces/eris.interface';

/**
 * OnDiscord Decorator to handle discord events
 *
 * @param name
 * @return {MethodDecorator}
 * @constructor
 */
export function OnDiscord(name?: ClientEvents): MethodDecorator {
  return (target: constructor<any>, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const eventName = name || propertyKey;

    const botService = app.resolve(DiscordBotService);
    const events = getFrameworkMetaData<OnDiscordModel[]>(ON_DISCORD, botService);

    const event = new OnDiscordModel().cast({
      eventName,
      targetName: target.constructor.name,
      methodName: propertyKey
    });

    events.push(event);
    Reflect.defineMetadata<OnDiscordModel[]>(ON_DISCORD, events, botService);

    return registerDescriptor(descriptor);
  };
}
