import { container, instanceCachingFactory, singleton } from 'tsyringe';
import { UtilsService } from './utils.service';
import { constructor } from 'tsyringe/dist/typings/types';

@singleton()
export class ModuleLoaderService {

  /**
   * All entities added by module decorator
   *
   * @type {Map<string, string[]>}
   * @private
   */
  private pool: Map<string, string[]> = new Map<string, string[]>();

  /**
   * Add new entity name to pool to prevent multiple load and register same script
   *
   * @param {constructor<any>} entity
   */
  public add(entity: constructor<any>): void {
    this.addToPool(entity);
    this.registerIfNotExists(entity);
    this.resolve(entity);
  }

  /**
   * Add entity to pool
   *
   * @param {constructor<any>} entity
   * @private
   */
  private addToPool(entity: constructor<any>) {
    if (!this.pool.has(entity.name)) {
      this.pool.set(entity.name, [entity.name]);

      if (entity.name.endsWith('Module')) {
        UtilsService.logLoaded(entity.name);
      }

    } else {
      const poolEntry = this.pool.get(entity.name);
      this.pool.set(entity.name, [...poolEntry, entity.name]);
    }
  }

  /**
   * Register entity if not exists as string
   *
   * @param {constructor<any>} entity
   * @private
   */
  private registerIfNotExists(entity: constructor<any>) {
    if (container.isRegistered(entity.name)) return;

    container.register(entity.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(entity)) });
  }

  /**
   * Resolve all files if they not module
   * @param {constructor<any>} entity
   * @private
   */
  private resolve(entity: constructor<any>) {
    if (entity.name.endsWith('Module')) return;

    container.resolve(entity.name);
  }
}
