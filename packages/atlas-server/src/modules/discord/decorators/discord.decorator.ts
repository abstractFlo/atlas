import { ClientEvents } from 'discord.js';
import { getAtlasMetaData, registerDescriptor } from '@abstractflo/atlas-shared';
import { DiscordEventModel } from '../models/discord-event.model';
import { DiscordEnum } from '../constants/discord.constant';
import { container } from 'tsyringe';
import { DiscordBotService } from '../services/discord-bot.service';

/**
 * Register the @OnDiscord decorator
 *
 * @param {K} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnDiscord = <K extends keyof ClientEvents>(name?: K): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const eventName = name || propertyKey;
    const baseTarget = container.resolve(DiscordBotService);
    const discordEventModels = getAtlasMetaData<DiscordEventModel[]>(DiscordEnum.ON_DISCORD, baseTarget);

    const eventModel = new DiscordEventModel().cast({
      eventName,
      targetName: target.constructor.name,
      methodName: propertyKey
    });

    discordEventModels.push(eventModel);
    Reflect.defineMetadata(DiscordEnum.ON_DISCORD, discordEventModels, baseTarget);

    return registerDescriptor(descriptor);

  };
};
