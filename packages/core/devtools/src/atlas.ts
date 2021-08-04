import { fsJetpack } from './filesystem';
import { get, set } from 'lodash';
import { AtlasRcInterface } from './interfaces/atlas-rc.interface';

/**
 * Read the complete atlas.json file if exists
 *
 * @return {Promise<object>}
 */
export function getAtlasRc() {
  const file = require.resolve(fsJetpack().path('atlas-rc.cjs'));
  const content = require(file);

  return content as AtlasRcInterface;
}

/**
 * Get a config key from atlas.json
 *
 * @param {string} key
 * @param defaultValue
 * @return {any}
 */
export function getKeyFromAtlasRc(key: string, defaultValue?: any) {
  const config = getAtlasRc();

  return get(config, key, defaultValue);
}

/**
 * Create new config key
 *
 * @param {string} key
 * @param value
 */
export function setKeyToAtlasRc(key: string, value: any) {
  let config = getAtlasRc();
  config = set(config, key, value);
  fsJetpack().write('atlas-rc.cjs', config, { jsonIndent: 2 });
}

