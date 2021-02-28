import { container, singleton } from 'tsyringe';
import { UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection } from 'typeorm';
import { ConfigService } from './config.service';

@singleton()
export class DatabaseService {
  /**
   * Contains the database config
   *
   * @type {}
   * @private
   */
  private config: ConnectionOptions = {
    ...this.configService.get('database'),
    entities: []
  };

  /**
   * Contains the connection state
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  constructor(
      private readonly configService: ConfigService
  ) {}

  /**
   * Setup the database entities from container and reflection
   *
   * @private
   */
  public setupEntities(): void {
    try {
      let entities = [];
      entities = [...entities, ...container.resolve<Function[]>('server.database.entities')];
      this.config.entities.push(...entities);
    } catch (e) {}

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
}
