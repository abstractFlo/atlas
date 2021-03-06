import { singleton } from 'tsyringe';
import { BaseLoaderService, UtilsService } from '@abstractflo/atlas-shared';
import { DatabaseService } from './database.service';
import { DiscordBotService } from '../modules/discord';

@singleton()
export class LoaderService extends BaseLoaderService {

  constructor(
      private readonly databaseService: DatabaseService,
      private readonly discordBotService: DiscordBotService
  ) {
    super();
  }

  /**
   * Override default loading behaviour
   *
   * @return {Promise<void>}
   * @protected
   */
  protected async startLoading() {
    await this.dbServiceInit();
    await this.discordBotInit();
    this.startLoaderService();
  }

  /**
   * Start the database service if needed
   *
   * @return {Promise<void>}
   * @private
   */
  private async dbServiceInit(): Promise<void> {
    this.databaseService.setupReflectionEntities();
    await this.databaseService.connect();
  }

  /**
   * Start the database service if needed
   *
   * @return {Promise<void>}
   * @private
   */
  private async discordBotInit(): Promise<void> {
    this.discordBotService.setupReflectionEntities();
    await this.discordBotService.connect();
  }

  /**
   * Finally start the booting process
   *
   * @private
   */
  private startLoaderService(): void {
    UtilsService.autoClearSetTimeout(() => {
      UtilsService.log('~lg~Start booting => ~w~Please wait...');
      this.startingSubject$.next(true);
      this.startingSubject$.complete();
    }, 125);
  }
}
