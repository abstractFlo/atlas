import { container, singleton } from 'tsyringe';
import { get, set } from 'lodash';
import { readJsonSync } from 'fs-extra';
import { join } from 'path';
import { UtilsService } from '@abstractflo/atlas-shared';

@singleton()
export class ConfigService {

  /**
   * Name for config file
   *
   * @type {string}
   * @private
   */
  private file: string = 'environment.json';

  /**
   * Path to config file
   *
   * @type {string|null}
   * @private
   */
  private path: string | null = null;

  /**
   * Contains the config object
   *
   * @type {{[p: string]: any}}
   * @private
   */
  private readonly config: { [id: string]: any };

  /**
   * Variable for custom config
   *
   * @type {{[p: string]: any}}
   * @private
   */
  private customConfig: { [id: string]: any } = {};

  constructor() {

    try {
      const configPath = container.resolve<string>('server.config.path.file');
      this.path = join(configPath, this.file);
      this.config = readJsonSync(this.path);
    } catch (e) {
      UtilsService.logError(`You must be define the server config file path inside your bootstrap`)
      UtilsService.logError(`Use method registerServerConfigPath(...)`);
      throw new Error(e);
    }


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
    const config = { ...this.customConfig, ...this.config };
    return get(config, key, defaultValue);
  }

  /**
   * Set a custom config key
   *
   * @param {string} key
   * @param value
   * @return {object}
   */
  public set(key: string, value: any) {
    this.customConfig = set(this.customConfig, key, value);
  }

}
