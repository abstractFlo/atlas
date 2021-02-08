import { container, instanceCachingFactory, singleton } from 'tsyringe';
import { UtilsService } from './utils.service';
import { constructor } from 'tsyringe/dist/typings/types';

@singleton()
export class ModuleLoaderService {

  private pool: Map<string, string[]> = new Map<string, string[]>();

  /**
   * Add new entity name to pool to prevent multiple load and register same script
   *
   * @param {constructor<any>} entity
   */
  public add(entity: constructor<any>): void {
    if (!this.pool.has(entity.name)) {
      this.pool.set(entity.name, [entity.name]);

      if (entity.name.endsWith('Module')) {
        UtilsService.logLoaded(entity.name);
      }

    } else {
      const poolEntry = this.pool.get(entity.name);
      this.pool.set(entity.name, [...poolEntry, entity.name]);
    }

    if (!container.isRegistered(entity.name)) {
      container.register(entity.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(entity)) });
      container.resolve(entity);
    }
  }

}
