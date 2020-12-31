import { container, InjectionToken, singleton } from 'tsyringe';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { ConfigService } from './config.service';
import { defer, from, Observable } from 'rxjs';
import { LoggerService } from '@abstractFlo/shared';
import { share } from 'rxjs/operators';


@singleton()
export class DatabaseService {

  /**
   * Contains db connection options
   *
   * @type {ConnectionOptions}
   */
  public config: ConnectionOptions = {
    ...this.configService.get('database'),
    entities: container.resolve<InjectionToken[]>('server.database.entities')
  };

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

    return defer(() => from(createConnection(this.config)))
        .pipe(share());
  }
}
