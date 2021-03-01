import { singleton } from 'tsyringe';
import { get, set } from 'lodash';
import { UtilsService } from '@abstractflo/atlas-shared';
import path from 'path';
import { env } from '../helpers';

@singleton()
export class ConfigService {

  /**
   * Contains the config object
   *
   * @type {{[p: string]: any}}
   * @private
   */
  private config: { [id: string]: any };

  private pathToFolder = path.resolve(env('CONFIG_FOLDER', 'config'));

  public async init(): Promise<void> {
    UtilsService.log(this.pathToFolder);
  }

  /**
   * Return config value
   *
   * e.g: this.configService.get('my.awesome.config.flag', 'myDefaultValue')
   *
   * @param {string} key
   * @param defaultValue
   * @returns {any}
   */
  public get(key: string, defaultValue: any = null): any {
    return get(this.config, key, defaultValue);
  }

  /**
   * Set a custom config key
   *
   * @param {string} key
   * @param value
   * @return {object}
   */
  public set(key: string, value: any) {
    this.config = set(this.config, key, value);
  }

}
