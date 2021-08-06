import { Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { Client } from 'eris';

@Singleton
export class DiscordBotService {

  /**
   * Contains the bot secret for connect
   *
   * @type {string}
   * @private
   */
  private bot_secret: string = process.env.DISCORD_BOT_SECRET;

  /**
   * Contains if the bot already connected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  /**
   * Contains the the discord client
   *
   * @type {Client}
   * @private
   */
  private client: Client;

  /**
   * Try to create a login to discord
   *
   * @return {Promise<void>}
   */
  @Init()
  public connect(): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.connected || !this.bot_secret) return resolve();

      this.client = new Client(this.bot_secret);

      this.client.once('ready', () => {
        this.connected = true;
        UtilsService.logLoaded('DiscordBot');

        resolve();
      });

      await this.client.connect();
    });
  }
}
