import { inject, singleton } from 'tsyringe';
import { Client, Guild } from 'discord.js';
import { ConfigService } from '../../../services';

@singleton()
export class GuildService {

  public readonly guild: Guild;

  constructor(
      @inject('discord.client') private readonly client: Client,
      protected readonly configService: ConfigService
  ) {
    this.guild = this.getGuild();
  }

  /**
   * Fetch Server/Guild from client
   *
   * @private
   */
  private getGuild(): Guild {
    return this.client
        .guilds
        .cache
        .get(this.configService.get('discord.server_id'));
  }
}
