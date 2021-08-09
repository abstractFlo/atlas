import { constructor, getFrameworkMetaData, Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { AnnotationMappingProvider, Configuration, SessionFactory } from 'hydrate-mongodb';
import mongoDB from 'mongodb';
import { Internals } from '../internals';
import { ConfigInterface } from '../interfaces/config.interface';


@Singleton
export class MongoDbService {

  /**
   * Contains the hydrate mongodb config
   * @type {Configuration}
   * @private
   */
  private mongoConfig: Configuration = new Configuration();

  /**
   * Contains the annotation mapping provider
   *
   * @type {AnnotationMappingProvider}
   * @private
   */
  private annotationMappingProvider: AnnotationMappingProvider = new AnnotationMappingProvider();

  /**
   * Containst the connection state
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  /**
   * Contains the hydrate-mongodb client
   *
   * @type {SessionFactory}
   * @private
   */
  private client: SessionFactory;

  /**
   * Receive hydrate-mongodb entities and connect to mongo db
   *
   * @return {Promise<void>}
   */
  @Init()
  public connect(): Promise<void> {
    return new Promise(async (resolve) => {
      const entities = await this.getEntities();
      const connectionString = this.getConnectionString();

      if (this.connected || !entities || !connectionString) return resolve();

      this.annotationMappingProvider.addModules(entities);
      this.mongoConfig.addMapping(this.annotationMappingProvider);
      this.mongoConfig.databaseName = this.getConfig('schema');

      const client = await mongoDB.MongoClient.connect(connectionString, { useUnifiedTopology: true, loggerLevel: 'error' });

      this.mongoConfig.createSessionFactory(
          client,
          (error: Error | undefined, sessionFactory: SessionFactory | undefined) => {
            if (error) throw error;

            this.client = sessionFactory;

            UtilsService.logRegisteredHandlers('MongoDbService', entities.length);
            UtilsService.logLoaded('MongoDbService');
            this.connected = true;

            resolve();
          }
      );
    });
  }

  /**
   * Return the connection string
   *
   * @return {string}
   * @private
   */
  private getConnectionString(): string {
    const config = this.getConfig();
    const connectionString = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.schema}`;

    return config.connectionString || connectionString;
  }

  /**
   * Return the hydrate-mongodb Client
   *
   * @return {SessionFactory}
   */
  public getClient(): SessionFactory {
    return this.client;
  }

  /**
   * Get and resolve reflection entities
   *
   * @return {Promise<void>}
   * @private
   */
  private getEntities(): Promise<void | constructor<any>[]> {
    return new Promise((resolve) => {
      let reflectionEntities = getFrameworkMetaData<constructor<any>[]>(Internals.DATABASE_ENTITIES, this) || [];
      return resolve(reflectionEntities);
    });
  }

  /**
   * Return MongoDB Connection Options
   * @return {ConfigInterface}
   * @private
   */
  private getConfig(): ConfigInterface;

  /**
   * Return a specific key from config or null
   * @param {string} key
   * @return {string | null}
   * @private
   */
  private getConfig(key: string): string | null;

  /**
   * Return the MongoDB Connection Options or a key
   *
   * @param {string} key
   * @return {string | ConfigInterface | null}
   * @private
   */
  private getConfig(key?: string): string | null | ConfigInterface {
    const config = {
      user: process.env.MONGODB_USER,
      schema: process.env.MONGODB_SCHEMA,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      host: process.env.MONGODB_HOST,
      connectionString: process.env.MONGODB_CONNECTION_STRING
    };

    return key ? config[key] || null : config;
  }
}
