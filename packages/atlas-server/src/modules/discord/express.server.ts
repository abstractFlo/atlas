import { Server } from '@overnightjs/core';
import { container } from 'tsyringe';
import { AutoloadAfter, castToNumber, UtilsService } from '@abstractflo/atlas-shared';
import { AuthenticationController } from './controllers/authentication.controller';
import bodyParser from 'body-parser';

@AutoloadAfter({ methodName: 'start' })
export class ExpressServer extends Server {

  private port: number | null = castToNumber()(process.env.DISCORD_API_PORT) || null;
  private hasClientId: boolean = process.env.DISCORD_CLIENT_ID !== 'null';
  private hasClientSecret: boolean = process.env.DISCORD_CLIENT_SECRET !== 'null';

  constructor() {
    super();

    if (this.port) {
      if (!this.hasClientId || !this.hasClientSecret) {
        throw new Error(`DiscordExpressServer can't start. You missing some configuration. 
      Look at your .env and fill out DISCORD_API_PORT, DISCORD_CLIENT_ID & DISCORD_CLIENT_SECRET`);
      }

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
