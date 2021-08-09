import { QueryBuilder, Session } from 'hydrate-mongodb';
import { getMongoSession } from './helpers';

/**
 * Base MongoDB Collection
 */
export abstract class MongoDbBaseCollection<T> {

  /**
   * Contains the entity for this collection
   *
   * @type {{new(...args: any[]): T}}
   * @protected
   */
  protected entity: new (...args: any[]) => T;

  /**
   * Create a new session
   *
   * @type {Session}
   * @protected
   */
  protected session: Session = getMongoSession();

  /**
   * Return the queryBuilder for this collection
   *
   * @return {QueryBuilder<T>}
   * @protected
   */
  protected get query(): QueryBuilder<T> {
    return this.session.query<T>(this.entity);
  }
}
