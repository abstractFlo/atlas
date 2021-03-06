import { container, singleton } from 'tsyringe';
import { constructor, getAtlasMetaData, UtilsService } from '@abstractflo/atlas-shared';
import { DiscordConfigService } from './discord-config.service';
import { DiscordConfigModel } from '../models/discord-config.model';
import { Client } from 'discord.js';
import { DiscordEnum } from '../constants/discord.constant';
import { DiscordEventModel } from '../models/discord-event.model';


@singleton()
export class DiscordBotService {

  private config: DiscordConfigModel = this.discordConfigService.config;
  private client: Client = new Client(this.config.presences);
  private eventModels: DiscordEventModel[] = [];
  private listeners: Map<string, DiscordEventModel[]> = new Map<string, DiscordEventModel[]>();
  private connected: boolean = false;

  constructor(
      private readonly discordConfigService: DiscordConfigService
  ) {}


  /**
   * Connect the discord bot
   */
  public async connect(): Promise<void> {
    if (this.connected || !this.eventModels.length) return;

    try {
      await this.client.login(this.config.bot_secret);
      this.listenEvents();
      UtilsService.log(`Registered all events for ~lg~DiscordBot~w~ - ~y~[${this.eventModels.length}]~w~`);
      UtilsService.logLoaded('DiscordBotService');
      this.connected = true;
    } catch (e) {
      UtilsService.logError(`You have add the bot_secret to your .env file?`);
      throw new Error(e);
    }
  }

  /**
   * Setup the reflection data
   *
   * @private
   */
  public setupReflectionEntities() {
    this.eventModels = getAtlasMetaData<DiscordEventModel[]>(DiscordEnum.ON_DISCORD, this);
    this.mapEvents();
  }

  /**
   * Destroy/Logout the discord bot
   */
  public destroy(): void {
    this.client.destroy();
  }

  /**
   * Setup the events to map
   *
   * @private
   */
  private mapEvents(): void {
    this.eventModels.forEach((eventModel: DiscordEventModel) => {
      if (!this.listeners.has(eventModel.eventName)) {
        this.listeners.set(eventModel.eventName, []);
      }

      const models = this.listeners.get(eventModel.eventName);
      models.push(eventModel);
    });
  }

  /**
   * Listen for events
   *
   * @private
   */
  private listenEvents(): void {
    Array.from(this.listeners.keys()).forEach((key: string) => {
      this.client.on(key, (...args: any[]) => {
        const events = this.listeners.get(key);

        events.forEach((event: DiscordEventModel) => {
          const instances = container.resolveAll<constructor<any>>(event.targetName);

          instances.forEach(async (instance: constructor<any>) => {
            const instanceMethod = instance[event.methodName];

            if (!instanceMethod) return;

            const method = instanceMethod.bind(instance);
            await method(...args);
          });
        });
      });
    });
  }
}
