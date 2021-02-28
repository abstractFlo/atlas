import { container, singleton } from 'tsyringe';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { ConfigService } from './config.service';
import { defer, from, Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { LoggerService, StringResolver } from '@abstractflo/atlas-shared';

@StringResolver
@singleton()
export class DatabaseService {

  /**
   * Contains db connection options
   *
   * @type {ConnectionOptions}
   */
  public config: ConnectionOptions = {
    ...this.configService.get('database'),
    entities: []
  };

  /**
   * Database entities
   *
   * @type {Function[]}
   * @private
   */
  private entities: Function[];

  /**
   * Contains the connection observable
   *
   * @type {Observable<Connection>}
   * @private
   */
  private serviceObservable$: Observable<Connection> = new Observable<Connection>();

  /**
   * Internal variable to set the create state
   *
   * @type {boolean}
   * @private
   */
  private created: boolean = false;

  constructor(
      private readonly configService: ConfigService,
      private readonly loggerService: LoggerService
  ) {
    this.setupEntities();
    this.connect();
  }

  /**
   * Return the service observable
   *
   * @returns {Observable<Connection>}
   * @private
   */
  public initialize(): Observable<Connection> {
    return this.serviceObservable$;
  }

  /**
   * Autostart the service
   *
   * @param {Function} done
   */

  /**
   * Create the database connection observable
   *
   * @private
   */
  private connect() {
    this.serviceObservable$ = this.created
        ? this.initialize()
        : this.create();
  }

  /**
   * Create new database connection and share between each subscriber
   *
   * @returns {Observable<Connection>}
   * @private
   */
  private create(): Observable<Connection> {
    this.created = true;

    return defer(() => {
      this.loggerService.starting('DatabaseService');
      return from(createConnection(this.config));
    }).pipe(share(), tap(() => this.loggerService.started('DatabaseService')));
  }

  /**
   * Setup entities for database
   *
   * @private
   */
  private setupEntities() {
    try {
      this.entities = container.resolve<Function[]>('server.database.entities');
    } catch (e) {
      this.entities = [];
    }

    this.config.entities.push(...this.entities);
  }
}
