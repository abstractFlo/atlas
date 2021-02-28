import { container, singleton } from 'tsyringe';
import { Autoload, AutoloaderEnums, UtilsService } from '@abstractflo/atlas-shared';
import { ConnectionOptions, createConnection } from 'typeorm';
import { ConfigService } from './config.service';
import { Subject } from 'rxjs';

@Autoload(AutoloaderEnums.BEFORE_BOOT, { methodName: 'resolveAndConnect', doneCheckTimeout: 1000 * 10 })
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
  private entitiesSetupComplete: boolean = false;

  private doneCallback: Subject<CallableFunction> = new Subject<Function>();

  constructor(
      private readonly configService: ConfigService
  ) {

  }

  protected resolveAndConnect(done: CallableFunction): void {
    this.setupEntities();

    const interval = setInterval(() => {
      if (this.entitiesSetupComplete) {
        this.connect(done);
        clearInterval(interval);
      }
    }, 50);
  }

  /**
   * Connect to database
   *
   * @param {Function} done
   * @private
   */
  private connect(done: CallableFunction): void {
    if (this.connected || !this.config.entities.length) return done();

    createConnection(this.config).then(() => {
      UtilsService.log(`Registered all entities for ~lg~Database~w~ - ~y~[${this.config.entities.length}]~w~`);
      UtilsService.logLoaded('DatabaseService');
      this.connected = true;
      return done();
    });
  }

  /**
   * Setup the database entities from container and reflection
   *
   * @private
   */
  private setupEntities() {
    try {
      let entities = [];
      entities = [...entities, ...container.resolve<Function[]>('server.database.entities')];
      this.config.entities.push(...entities);
    } catch {}


    this.entitiesSetupComplete = true;
  }
}
