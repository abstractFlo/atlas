import { container, instanceCachingFactory, singleton } from 'tsyringe';
import { UtilsService } from './utils.service';
import { constructor } from 'tsyringe/dist/typings/types';

@singleton()
export class ModuleLoaderService {

  private pool: Set<string> = new Set<string>();

  /**
   * Add new entity name to pool to prevent multiple load and register same script
   *
   * @param {constructor<any>} entity
   */
  public add(entity: constructor<any>): void {
    if (!this.pool.has(entity.name)) {
      this.pool.add(entity.name);

      container.register(entity.name, { useFactory: instanceCachingFactory<any>(c => c.resolve(entity)) });

      if (entity.name.endsWith('Module')) {
        UtilsService.logLoaded(entity.name);
      }
    }
  }

}
