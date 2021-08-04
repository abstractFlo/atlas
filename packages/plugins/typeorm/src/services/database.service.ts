import { constructor, getFrameworkMetaData, Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Internals } from '../internals';

@Singleton
export class DatabaseService {

  /**
   * Contains the database connection info
   *
   * @type {ConnectionOptions}
   * @private
   */
  private config: ConnectionOptions = {
    name: 'default',
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    logging: process.env.TYPEORM_LOGGING === 'true',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    entities: []
  };

  /**
   * Contains if database already conntected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  @Init(-2)
  public getReflectEntities(): Promise<void> {
    return new Promise((resolve) => {
      const entities = getFrameworkMetaData<constructor<any>[]>(Internals.DATABASE_ENTITIES, this);
      entities.forEach((entity) => this.config.entities.push(entity));
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

