import { app, constructor, getFrameworkMetaData, Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { Client } from 'eris';
import { OnDiscordModel } from '../models/on-discord.model';
import { ON_DISCORD } from '../interfaces/eris.interface';

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
   * Contains the the discord client
   *
   * @private
   */
  private client: Client = new Client(this.bot_secret);

  /**
   * Contains the mapped events from decorator
   *
   * @type {Map<string, OnDiscordModel[]>}
   * @private
   */
  private eventsMap: Map<string, OnDiscordModel[]> = new Map<string, OnDiscordModel[]>();

  /**
   * Contains if the bot already connected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  /**
   * Try to create a login to discord
   *
   * @return {Promise<void>}
   */
  @Init()
  public connect(): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.connected || !this.bot_secret) return resolve();

      this.setupReflection();

      this.client.once('ready', () => {
        this.connected = true;
        UtilsService.logRegisteredHandlers('DiscordBot', this.eventsMap.size);
        UtilsService.logLoaded('DiscordBot');

        resolve();
      });

      await this.client.connect();
    });
  }

  /**
   * Return the bot client
   *
   * @return {Client}
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Setup the reflected methods
   *
   * @private
   */
  private setupReflection(): void {
    const events = getFrameworkMetaData<OnDiscordModel[]>(ON_DISCORD, this);

    if (events.length) {
      events.forEach((event: OnDiscordModel) => {
        if (!this.eventsMap.has(event.eventName)) {
          this.eventsMap.set(event.eventName, []);
        }

        const models = this.eventsMap.get(event.eventName);
        models.push(event);
      });

      this.setupListeners();
    }
  }

  /**
   * Perform the listen for events and handle
   *
   * @private
   */
  private setupListeners(): void {
    Array.from(this.eventsMap.keys())
        .forEach((key: string) => {

          this.client.on(key, (...args: any[]) => {
            const events = this.eventsMap.get(key);

            events.forEach((event: OnDiscordModel) => {
              const instances = app.resolveAll<constructor<any>>(event.targetName);

              instances.forEach(async (instance: constructor<any>) => {
                const instanceMethod = instance[event.methodName];

                if (!instanceMethod) return;

                const method = instanceMethod.bind(instance, ...args);
                await method();
              });
            });
          });
        });
  }
}
