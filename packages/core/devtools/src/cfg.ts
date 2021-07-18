import { Config, ValueType } from 'cfg-reader';

/**
 * Return a config value from given config file
 *
 * @param {string} pathToConfig
 * @param {string} key
 * @param {number} valueType
 * @return {ValueType}
 */
export function readKeyFromCfg(pathToConfig: string, key: string, valueType: ValueType): ValueType {
  const config = new Config(pathToConfig, false);
  return config.getOfType(key, valueType);
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
 * Cfg-Reader types
 * @type {{Number: number, Dict: number, List: number, String: number, Boolean: number}}
 */
export const CfgValueType = {
  Boolean: 0,
  Number: 1,
  String: 2,
  List: 3,
  Dict: 4
};
