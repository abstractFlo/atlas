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
    this.config = new DiscordConfigModel().cast({
      client_id: process.env.DISCORD_CLIENT_ID || null,
      client_secret: process.env.DISCORD_CLIENT_SECRET || null,
      bot_secret: process.env.DISCORD_BOT_SECRET || null,
      server_id: process.env.DISCORD_SERVER_ID || null,
      redirect_url: process.env.DISCORD_REDIRECT_URL || null,
      auth_url: process.env.DISCORD_AUTH_URL || 'https://discord.com/api/oauth2/authorize',
      auth_token_url: process.env.DISCORD_AUTH_TOKEN_URL || 'https://discord.com/api/oauth2/token',
      user_me_url: process.env.DISCORD_USER_ME_URL || 'https://discord.com/api/users/@me',
    });
  }

  /**
   * Check if the discord bot has all needed options to be working
   *
   * @return {boolean}
   */
  public hasValidConfiguration(): boolean {
    const hasClientId: boolean = this.config.client_id !== 'null';
    const hasClientSecret: boolean = this.config.client_secret !== 'null';
    const hasRedirectUrl: boolean = this.config.redirect_url !== 'null';

    if (!hasClientId || !hasClientSecret || !hasRedirectUrl) {
      throw new Error(`DiscordExpressServer can't start. You missing some configuration. 
      Look at your .env and fill out DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET & DISCORD_REDIRECT_URL`);
    }

    return true;
  }
}
