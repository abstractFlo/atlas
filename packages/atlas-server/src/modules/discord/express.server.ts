import { Server } from '@overnightjs/core';
import { container, singleton } from 'tsyringe';
import { AutoloadAfter, castToNumber, UtilsService } from '@abstractflo/atlas-shared';
import { AuthenticationController } from './controllers/authentication.controller';
import bodyParser from 'body-parser';
import { DiscordConfigService } from './services/discord-config.service';

@AutoloadAfter({ methodName: 'start' })
@singleton()
export class ExpressServer extends Server {

  /**
   * Contains the express port to be listen
   *
   * @type {number | null}
   * @private
   */
  private port: number | null = castToNumber()(process.env.DISCORD_API_PORT) || null;

  constructor(
      private readonly discordConfigService: DiscordConfigService
  ) {
    super();

    if (this.port) {
      if (!this.discordConfigService.hasValidConfiguration()) return;

      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));

      const discordController = container.resolve(AuthenticationController);

      super.addControllers([discordController]);
    }
  }

  /**
   * Start the express server
   */
  public start(done: CallableFunction): void {
    if (this.port === null) {
      done();
      return;
    }

    this.app.listen(this.port, () => {
      UtilsService.logLoaded(`DiscordExpressServer ~y~PORT => ${this.port}`);
      done();
    });
  }

}
