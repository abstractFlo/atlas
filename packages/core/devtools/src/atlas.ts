import { fsJetpack } from './filesystem';
import { get, set } from 'lodash';
import { AtlasRcInterface } from './interfaces/atlas-rc.interface';
import { PackageJson } from './types';

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


/**
 * Read the package json from project
 */
export const projectPkgJson: PackageJson = fsJetpack().read('package.json', 'json') as PackageJson;

/**
 * Write content to project package.json
 * @param {PackageJson} content
 */
export function writeProjectPkgJson(content: PackageJson): void {
  fsJetpack().write('package.json', content);
}
