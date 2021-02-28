import { container, singleton } from 'tsyringe';
import { Autoload } from '../decorators/loader.decorator';
import { AutoloaderEnums } from '../constants';
import { constructor } from '../types';
import { ModuleLoaderEnum } from '../constants/module-loader.constant';
import { getAtlasMetaData } from '../decorators/helpers';

@Autoload(AutoloaderEnums.AFTER_BOOT, { methodName: 'load' })
@singleton()
export class ModuleLoaderService {

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
