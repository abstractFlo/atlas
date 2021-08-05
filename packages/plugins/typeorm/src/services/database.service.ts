import { constructor, getFrameworkMetaData, Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import { Internals } from '../internals';

@Singleton
export class DatabaseService {

  /**
   * Contains the database connection info
   *
   * @type {ConnectionOptions}
   * @private
   */
  private config: ConnectionOptions;

  /**
   * Contains if database already conntected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  @Init(-2)
  public getReflectEntities(): Promise<void> {
    return new Promise(async (resolve) => {
      const entities = getFrameworkMetaData<constructor<any>[]>(Internals.DATABASE_ENTITIES, this);

      if (entities.length) {
        this.config = await getConnectionOptions();
        this.config.entities.push(...entities);
      }

      resolve();
    });
  }

  /**
   * Setup database connection
   *
   * @return {Promise<void>}
   * @protected
   */
  @Init(-1)
  protected async connect(): Promise<void> {
    if (this.connected) return;

    await createConnection(this.config);

    UtilsService.logLoaded('DatabaseService');

    this.connected = true;
  }

}

