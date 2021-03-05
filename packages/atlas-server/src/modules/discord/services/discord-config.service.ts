import { DiscordConfigModel } from '../models/discord-config.model';
import { singleton } from 'tsyringe';

@singleton()
export class DiscordConfigService {

  /**
   * Contains the discord config model
   *
   * @type {DiscordConfigModel}
   * @protected
   */
  public readonly config: DiscordConfigModel;

  constructor() {
    this.config = new DiscordConfigModel()
        .cast({
          client_id: process.env.DISCORD_CLIENT_ID || null,
          client_secret: process.env.DISCORD_CLIENT_SECRET || null,
          bot_secret: process.env.DISCORD_BOT_SECRET || null,
          server_id: process.env.DISCORD_SERVER_ID || null,
          redirect_url: process.env.DISCORD_REDIRECT_URL || null,
          auth_url: process.env.DISCORD_AUTH_URL || null,
          auth_token_url: process.env.DISCORD_AUTH_TOKEN_URL || null,
          user_me_url: process.env.DISCORD_USER_ME_URL || null
        });
  }

}
