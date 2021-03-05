import { Server } from '@overnightjs/core';
import { container } from 'tsyringe';
import { AutoloadAfter, castToNumber, UtilsService } from '@abstractflo/atlas-shared';
import { AuthenticationController } from './controllers/authentication.controller';
import bodyParser from 'body-parser';

@AutoloadAfter({ methodName: 'start' })
export class ExpressServer extends Server {

  private port: number | null = castToNumber()(process.env.DISCORD_API_PORT) || null;

  constructor() {
    super();

    if (this.port) {
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
