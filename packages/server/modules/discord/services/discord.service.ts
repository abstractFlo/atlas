import { injectable } from 'tsyringe';
import { DiscordBotService } from './discord-bot.service';
import { Observable } from 'rxjs';
import { Client } from 'discord.js';
import { ExpressServer } from '../express.server';

@injectable()
export class DiscordService {

  constructor(
      private readonly discordBotService: DiscordBotService,
      private readonly discordExpressServer: ExpressServer
  ) {}

  /**
   * Start the bot
   */
  public startBot(): void {
    this.discordBotService.start();
  }

  /**
   * Initialize the bot
   *
   * @returns {Observable<Client>}
   */
  public initBot(): Observable<Client> {
    return this.discordBotService.initialize();
  }

  /**
   * Stop the discord bot
   */
  public stopBot(): void {
    return this.discordBotService.client.destroy();
  }

  /**
   * Start the express server
   *
   * @param {number} port
   * @param callback
   */
  public startApiServer(port: number = 1337, callback: CallableFunction): void {
    this.discordExpressServer.start(port, callback);
  }

}
