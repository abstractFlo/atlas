import { Config } from 'cfg-reader';

/**
 * Return a config value from given config file
 *
 * @param {string} pathToConfig
 * @param {string} key
 * @return {T}
 */
export function readKeyFromCfg<T = unknown>(pathToConfig: string, key: string): T {
  const config = new Config(pathToConfig, {});
  return config.getOfType(key);
}

/**
 * Parse complete config value and return config instance
 *
 * @param {string} path
 * @return {Config}
 */
export function readCfg(path: string): Config {
  return new Config(path, false);
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
export function cfgFromObject(data: { [key: string]: any }): string {
  return createTempCfg(data).serialize();
}
