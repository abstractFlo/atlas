import { container, singleton } from 'tsyringe';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { AuthenticationController } from './controllers/authentication.controller';
import { UtilsService } from '@abstractFlo/shared';

@singleton()
export class ExpressServer extends Server {

  constructor() {
    super();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const discordController = container.resolve(AuthenticationController);

    super.addControllers([discordController]);
  }

  /**
   * Start the express server on given port
   *
   * @param {number} port
   * @param callback
   */
  public start(port: number, callback: CallableFunction): void {
    this.app.listen(port, () => {
      callback(port);
    });
  }

  /**
   * Autostart method
   * @param {Function} done
   */
  public autoStart(done: CallableFunction): void {
    UtilsService.log('Starting ~y~DiscordApiServer~w~');
    const port = container.resolve<number>('discord.express.port');

    this.start(port, () => {
      UtilsService.log(`Started ~lg~DiscordApiServer~w~ on port ~y~${port}~w~`);
      done();
    });

  }

}
