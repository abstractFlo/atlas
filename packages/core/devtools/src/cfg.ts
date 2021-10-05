import { Config, Dict } from 'cfg-reader';

/**
 * Return a config value from given config file
 *
 * @param {string} pathToConfig
 * @param {string} key
 * @param {number} valueType
 * @return {ValueType}
 */
export function readKeyFromCfg<ValueType>(pathToConfig: string, key: string): ValueType {
  const config = new Config(pathToConfig);
  return config.getOfType<ValueType>(key);
}

/**
 * Parse complete config value and return config instance
 *
 * @param {string} path
 * @return {Config}
 */
export function readCfg(path: string): Config {
  return new Config(path);
}

/**
 * Create new temp cfg file they don't exists on filesystem
 * @param data
 * @return {Config}
 */
export function createTempCfg(data: { [key: string]: any }): Config {
  return new Config('tmp.cfg', data);
}

/**
 * Remove all not used characters from cfg string
 *
 * @param {string} cfg
 * @return {string}
 */
export function sanitizedCfg(cfg: string): string {
  return cfg.replace(/\\/g, '');
}

/**
 * Generate cfg config string
 *
 * @param {[p: string]: any} data
 * @return {string}
 */
export function cfgFromObject(data: Dict): string {
  return createTempCfg(data).serialize(false, false);
}