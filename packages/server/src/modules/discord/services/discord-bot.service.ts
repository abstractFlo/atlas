import { container, singleton } from 'tsyringe';
import { DiscordConfigModel, DiscordEventModel, StringResolver, UtilsService } from '@abstractflo/shared';
import { ConfigService } from '../../../services';
import { Client } from 'discord.js';
import { defer, from, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

@StringResolver
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
      private readonly configService: ConfigService
  ) {
    this.connect();
  }

  /**
   * Autostart the discord bot it class is first time resolved
   *
   * @param {Function} done
   */
  public autoStart(done: CallableFunction): void {
    UtilsService.log('Starting ~y~DiscordBot~w~');

    this.initialize()
        .subscribe(() => {

          container.register<Client>('discord.client', { useValue: this.client });

          this.start();
          UtilsService.log('Started ~lg~DiscordBot~w~');
          done();
        });

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
   * Destroy/Logout the discord bot
   */
  public destroy(): void {
    this.client.destroy();
  }

  /**
   * Return the client service observable
   *
   * @returns {Observable<Client>}
   * @private
   */
  private initialize(): Observable<Client> {
    return this.serviceObservable$;
  }

  /**
   * Start event loop
   *
   * @private
   */
  private start(): void {
    if (this.events.length) {
      UtilsService.log('Starting ~y~DiscordBot Decorators~w~');

      this.events.forEach((event: DiscordEventModel) => {
        const instances = container.resolveAll<any>(event.targetName);

        instances.forEach((instance) => {
          const method = instance[event.methodName].bind(instance);
          this.client.on(event.eventName, method);
        });
      });

      UtilsService.log('Started ~lg~DiscordBot Decorators~w~');
    }
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
            share()
        );
  }
}
