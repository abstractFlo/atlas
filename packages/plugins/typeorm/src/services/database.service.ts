import { constructor, getFrameworkMetaData, Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import { Internals } from '../internals';

@Singleton
export class DatabaseService {

  /**
   * Contains if database already conntected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  /**
   * Setup database connection
   *
   * @return {Promise<void>}
   * @protected
   */
  @Init(-1)
  protected async connect(): Promise<void> {
    if (this.connected) return;

    const config = await this.getConfig();
    await createConnection(config);

    UtilsService.logRegisteredHandlers('DatabaseService', config.entities.length);
    UtilsService.logLoaded('DatabaseService');

    this.connected = true;
  }

  /**
   * Return TypeORM Connection Options with added entities
   *
   * @return {Promise<ConnectionOptions>}
   * @private
   */
  private async getConfig(): Promise<ConnectionOptions> {
    const entities = getFrameworkMetaData<constructor<any>[]>(Internals.DATABASE_ENTITIES, this);
    const config = await getConnectionOptions();

    if (entities.length) {
      config.entities.push(...entities);
    }

    return config;
  }
}

