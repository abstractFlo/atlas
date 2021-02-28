import { container, singleton } from 'tsyringe';
import { Guild } from 'discord.js';
import { StringResolver } from '@abstractflo/atlas-shared';
import { DiscordBotService } from './discord-bot.service';
import { ConfigService } from '../../../services';

@StringResolver
@singleton()
export class GuildService {

  /**
   * The discord bot service
   *
   * @type {DiscordBotService}
   * @private
   */
  private guildBotService = container.resolve(DiscordBotService);

  /**
   * The config service
   *
   * @type {ConfigService}
   * @private
   */
  private guildConfigService = container.resolve(ConfigService);

  /**
   * Public guild variable
   *
   * @return {Guild}
   */
  public get guild(): Guild {
    const serverId = this.guildConfigService.get('discord.server_id');
    return this.guildBotService.client.guilds.cache.get(serverId);
  }
}
