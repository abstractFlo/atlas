import { container, singleton } from 'tsyringe';
import { join } from 'path';
import { get, set } from 'lodash';
import { readJSONSync } from 'fs-extra';

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
   * @type {string}
   * @private
   */
  private path: string = join(container.resolve<string>('server.config.path.file'), this.file);

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
    this.config = readJSONSync(this.path);
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
    const config = {...this.customConfig, ...this.config};
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
