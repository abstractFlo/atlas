import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Last, LoggerService, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { AddressInfo } from 'net';
import { DiscordApiService } from './services/discord-api.service';
import { EventService } from '@abstractflo/atlas-server';
import { DiscordApiProvider } from './providers/discord-api.provider';
import { filter, mergeMap } from 'rxjs';
import { DiscordUserModel } from './models/discord-user.model';
import { AccessTokenModel } from './models/access-token.model';

@Singleton
export class ApiServer {

  /**
   * Enable the api server logger
   *
   * @type {boolean}
   * @private
   */
  private logger: boolean = process.env.DISCORD_API_LOGGER === 'true';

  /**
   * Contains the fastify instance
   *
   * @type {FastifyInstance}
   * @private
   */
  private fastify: FastifyInstance = fastify({ logger: this.logger });

  /**
   * Contains if the service to be used
   *
   * @type {boolean}
   * @private
   */
  private useServer: boolean = process.env.DISCORD_ENABLE_API_SERVER === 'true';

  /**
   * Contains the name for api done event
   *
   * @type {string}
   * @private
   */
  private doneEventName: string = process.env.DISCORD_AUTH_DONE || 'discord-api:auth:done';

  /**
   * Url for redirect can be set by environment
   *
   * @type {string}
   * @private
   */
  private redirectedAfterAuth: string = process.env.DISCORD_REDIRECT_AFTER_AUTH || '/auth/done';

  /**
   * Contains if the server already started
   *
   * @type {boolean}
   * @private
   */
  private isStarted: boolean = false;

  constructor(
      private readonly discordApiService: DiscordApiService,
      private readonly discordApiProvider: DiscordApiProvider,
      private readonly loggerService: LoggerService,
      private readonly eventService: EventService
  ) {}

  /**
   * Initialize the system
   *
   * @return {Promise<void>}
   */
  @Last
  public setup(): Promise<void> {
    return new Promise(async (resolve) => {
      if (!this.useServer || this.isStarted) return resolve();

      this.fastify.get('/auth/done', this.doneRoute.bind(this));
      this.fastify.get('/auth/discord', this.discordRoute.bind(this));

      const { port } = await this.startServer();
      this.isStarted = true;

      UtilsService.log(`DiscordApiServer started on ~y~${port}~w~`);
      UtilsService.logLoaded('DiscordApiServer');

      resolve();
    });
  }

  /**
   * Done Route
   *
   * @param {FastifyRequest} _request
   * @param {FastifyReply} reply
   * @return {FastifyReply}
   * @private
   */
  private doneRoute(_request: FastifyRequest, reply: FastifyReply): FastifyReply {
    return reply.send('Authentication done, you can now close this window');
  }

  /**
   * Discord Route
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @return {FastifyReply}
   * @private
   */
  private discordRoute(request: FastifyRequest, reply: FastifyReply) {
    const { code, state } = request.query as { code: string, state: string };

    if (!code || !state) reply.redirect(this.redirectedAfterAuth);

    this.discordApiService
        .getToken(code)
        .pipe(
            filter((model: AccessTokenModel) => !!model.access_token),
            mergeMap((model: AccessTokenModel) => this.discordApiService.getUserData(
                model.token_type,
                model.access_token
            )),
            filter((user: DiscordUserModel) => !!user.id && !!user.username)
        )
        .subscribe({
          next: (user: DiscordUserModel) => {
            this.eventService.emit(this.doneEventName, state, user);
            reply.redirect(this.redirectedAfterAuth);
          },
          error: (err) => {
            this.loggerService.error(err);
            throw new Error(err);
          }
        });

  }

  /**
   * Start the api server
   *
   * @return {Promise<{address: AddressInfo | string, port: string | number}>}
   * @private
   */
  private async startServer(): Promise<{ port: number, address: string | AddressInfo }> {
    try {
      const port = Number(process.env.DISCORD_API_PORT) || 3000;
      await this.fastify.listen(port, '0.0.0.0');

      const address = this.fastify.server.address();
      return { port, address };

    } catch (err) {
      this.loggerService.error(err);
      process.exit(1);
    }
  }
}
