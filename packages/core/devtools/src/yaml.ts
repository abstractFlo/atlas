import { dump, load } from 'js-yaml';
import { fsJetpack } from './filesystem';

/**
 * Read given path as yaml and convert to json
 *
 * @param {string} path
 * @return {object}
 */
export function readYamlAsJson(path: string): Promise<{ path: string, message: string } | object> {
  const jetpack = fsJetpack();

  return new Promise((resolve, reject) => {

    if (!jetpack.exists(path)) {
      reject({ path: jetpack.path(path), message: 'Not Exists' });
    }

    const content = jetpack.read(path, 'utf8');

    resolve(load(content) as object);
  });
}

/**
 * Convert yaml to json object
 *
 * @param {string} content
 * @return {object}
 */
export function yamlToJson(content: string): object {
  return load(content) as object;
}

/**
 * Convert json to yaml and store on given path
 *
 * @param {string} path
 * @param {object} content
 * @param {boolean} force
 */
export function writeJsonToYaml(path: string, content: object, force: boolean = false): Promise<{ path: string, message: string }> {
  return new Promise((resolve, reject) => {
    const jetpack = fsJetpack();

    if (!force && jetpack.exists(path)) {
      reject({ path: jetpack.path(path), message: 'Already Exists' });
    }

    const yamlContent = dump(content, { quotingType: '"', lineWidth: 120 });
    jetpack.write(path, yamlContent);
    resolve({ path: jetpack.path(path), message: 'Created:' });
  });
}

/**
 * Convert json to yaml
 *
 * @param {object} content
 * @return {any}
 */
export function jsonToYaml(content: object): string {
  return dump(content, { quotingType: '"', lineWidth: 120 });
}


/**
 * Append new content to existing yaml
 *
 * @param {string} path
 * @param {object} content
 */
export async function appendJsonToYaml(path: string, content: object): Promise<{ path: string, message: string }> {
  const oldContent = await readYamlAsJson(path);
  const appendContent = { ...oldContent, ...content };

  return await writeJsonToYaml(path, appendContent, true);
}
