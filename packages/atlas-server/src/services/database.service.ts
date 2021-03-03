import { singleton } from 'tsyringe';
import { constructor, getAtlasMetaData, UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection } from 'typeorm';
import { DatabaseEnums } from '../constants/database.constants';

@singleton()
export class DatabaseService {
  /**
   * Contains the database config
   *
   * @type {}
   * @private
   */
  private config: ConnectionOptions = {
    name: 'default',
    type: process.env.DB_CONNECTION as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING === 'true',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: []
  };

  /**
   * Contains the connection state
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  constructor() {}

  /**
   * Setup all entities getting from reflection
   *
   */
  public setupReflectionEntities(): void {
    const reflectionEntities = getAtlasMetaData<constructor<any>[]>(DatabaseEnums.ENTITY_ADD, this);
    reflectionEntities.forEach((entity: constructor<any>) => this.addIfNotExists(entity));
  }

  /**
   * Connect to database
   *
   */
  public async connect(): Promise<void> {
    if (this.connected || !this.config.entities.length) return;

    return createConnection(this.config).then(() => {
      UtilsService.log(`Registered all entities for ~lg~Database~w~ - ~y~[${this.config.entities.length}]~w~`);
      UtilsService.logLoaded('DatabaseService');
      this.connected = true;
    });
  }

  /**
   * Add entity if not exists
   *
   * @param {constructor<any>} entity
   * @private
   */
  private addIfNotExists(entity: constructor<any>) {
    if (!this.config.entities.includes(entity)) {
      this.config.entities.push(entity);
    }
  }
}
