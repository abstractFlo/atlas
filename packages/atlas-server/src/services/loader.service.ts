import { singleton } from 'tsyringe';
import { BaseLoaderService, UtilsService } from '@abstractflo/atlas-shared';
import { DatabaseService } from './database.service';

@singleton()
export class LoaderService extends BaseLoaderService {

  constructor(
      private readonly databaseService: DatabaseService
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
   * Finally start the booting process
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
