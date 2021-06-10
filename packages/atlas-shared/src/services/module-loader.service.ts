import { container, singleton } from 'tsyringe';
import { AutoloadAfter } from '../decorators/loader.decorator';
import { ModuleLoaderEnum } from '../constants/module-loader.constant';
import { getAtlasMetaData } from '../decorators/helpers';
import { constructor } from '../types/constructor';

@AutoloadAfter({ methodName: 'load' })
@singleton()
export class ModuleLoaderService {
  /**
   * Load all needed imports and components
   *
   * @param {Function} done
   */
  public load(done: CallableFunction): void {
    this.loadImports();
    this.loadComponents();
    done();
  }

  /**
   * Resolve all components
   *
   * @private
   */
  private loadComponents(): void {
    const components = getAtlasMetaData<constructor<any>[]>(ModuleLoaderEnum.COMPONENTS, this);
    components.forEach((component: constructor<any>) => container.resolve(component));
  }

  /**
   * Resolve all imports
   *
   * @private
   */
  private loadImports(): void {
    const imports = getAtlasMetaData<constructor<any>[]>(ModuleLoaderEnum.IMPORTS, this);
    imports.forEach((importedModule: constructor<any>) => container.resolve(importedModule));
  }
}
