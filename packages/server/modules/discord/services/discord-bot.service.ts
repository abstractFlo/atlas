import { container, singleton } from 'tsyringe';
import { DiscordConfigModel, DiscordEventModel } from '../models';
import { ConfigService } from '../../../services';
import { Client } from 'discord.js';
import { defer, from, Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { LoggerService } from '@abstractFlo/shared';

@singleton()
export class DiscordBotService {

  /**
   * Contains all discord event commands
   * @type {Map<any, any>}
   * @private
   */
  private events: DiscordEventModel[] = [];

  /**
   * Contains the discord config
   *
   * @type {DiscordConfigModel}
   * @private
   */
  private readonly config: DiscordConfigModel = new DiscordConfigModel().cast(this.configService.get('discord'));

  /**
   * Discord client
   *
   * @type {Client}
   * @private
   */
  public readonly client: Client = new Client(this.config.presences);
  
  /**
   * Contains the client observable
   *
   * @type {Observable<Client>}
   * @private
   */
  private serviceObservable$: Observable<Client> = new Observable<Client>();

  /**
   * Internal property to set the created state
   *
   * @type {boolean}
   * @private
   */
  private created: boolean = false;

  constructor(
      private readonly configService: ConfigService,
      private readonly loggerService: LoggerService
  ) {
    this.connect();
  }

  /**
   * Add event to events array
   *
   * @param eventName
   * @param targetName
   * @param {string} methodName
   */
  public add(eventName: string, targetName: string, methodName: string): void {
    const event = new DiscordEventModel().cast({ eventName, targetName, methodName });
    this.events.push(event);
  }

  /**
   * Start event loop
   */
  public start(): void {
    this.events.forEach((event: DiscordEventModel) => {
      const instance = container.resolve<any>(event.targetName);
      const method = instance[event.methodName].bind(instance);

      this.client.on(event.eventName, method);
    });
  }

  /**
   * Return the client service observable
   *
   * @returns {Observable<Client>}
   */
  public initialize(): Observable<Client> {
    return this.serviceObservable$;
  }

  /**
   * Add observable to serviceObservable
   *
   * @private
   */
  private connect(): void {
    this.serviceObservable$ = this.created
        ? this.initialize()
        : this.login();
  }

  /**
   * Create new client login and share between all subscribers
   *
   * @returns {Observable<Client>}
   * @private
   */
  private login(): Observable<Client> {
    this.created = true;

    return defer(() => from(this.client.login(this.config.bot_secret)))
        .pipe(
            map(() => this.client),
            tap(() => this.loggerService.started('DiscordBot')),
            share()
        );
  }
}
