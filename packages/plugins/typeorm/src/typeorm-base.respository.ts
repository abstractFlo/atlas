import { getRepository, Repository } from 'typeorm';

/**
 * Base TypeORM Respository Class
 */
export abstract class TypeOrmBaseRespository<T> {

  /**
   * Contains the entity for repository
   *
   * @type {{new(...args: any[]): T}}
   * @protected
   */
  protected entity: new (...args: any[]) => T;

  /**
   * Return the repository
   *
   * @return {Repository<T>}
   * @protected
   */
  protected get repository(): Repository<T> {
    return getRepository(this.entity);
  }

}
