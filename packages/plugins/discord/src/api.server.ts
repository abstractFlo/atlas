import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Last, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { AddressInfo } from 'net';

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
   * Contains if the server already started
   *
   * @type {boolean}
   * @private
   */
  private isStarted: boolean = false;

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
      UtilsService.logLoaded('DiscordApiServer')

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
    return reply.send('FOO');
  }

  /**
   * Discord Route
   *
   * @param {FastifyRequest} _request
   * @param {FastifyReply} reply
   * @return {FastifyReply}
   * @private
   */
  private discordRoute(_request: FastifyRequest, reply: FastifyReply): FastifyReply {
    return reply.send('BAR');
  }

  /**
   * Start the api server
   *
   * @return {Promise<{address: AddressInfo | string, port: string | number}>}
   * @private
   */
  private async startServer(): Promise<{port: number, address: string | AddressInfo}> {
    try {
      const port = Number(process.env.DISCORD_API_PORT) || 3000;
      await this.fastify.listen(port, '0.0.0.0');

      const address = this.fastify.server.address();
      return { port, address };

    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}
