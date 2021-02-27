import { container, singleton } from 'tsyringe';
import { Autoload } from '../decorators/loader.decorator';
import { AutoloaderEnums } from '../constants';
import { constructor } from '../types';
import { ModuleLoaderEnum } from '../constants/module-loader.constant';

@Autoload(AutoloaderEnums.AFTER_BOOT, { methodName: 'load' })
@singleton()
export class ModuleLoaderService {

  public load(done: CallableFunction): void {
    this.loadImports();
    this.loadComponents();
    done();
  }


  /**
   * Return registered constructors by key
   *
   * @param {string} key
   * @return {constructor<any>[]}
   * @private
   */
  private getMetaData(key: string): constructor<any>[] {
    return Reflect.getMetadata(key, this) || [];
  }

  /**
   * Resolve all components
   *
   * @private
   */
  private loadComponents(): void {
    const components = this.getMetaData(ModuleLoaderEnum.COMPONENTS);
    components.forEach((component: constructor<any>) => container.resolve(component));
  }

  /**
   * Resolve all imports
   *
   * @private
   */
  private loadImports(): void {
    const imports = this.getMetaData(ModuleLoaderEnum.IMPORTS);
    imports.forEach((importedModule: constructor<any>) => container.resolve(importedModule));
  }
}
