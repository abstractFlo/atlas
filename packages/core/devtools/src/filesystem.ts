import { ExistsResult, FindOptions, FSJetpack } from 'fs-jetpack/types';
import jetpack from 'fs-jetpack';
import { isAbsolute, relative, resolve } from 'path';
import { renderFile } from 'ejs';
import { dotCase, normalize, pascalCase } from './string';
import { dump, load } from 'js-yaml';

/**
 * Check if given path exists under current working dir
 *
 * @param {string} path
 * @param {FSJetpack} fsJetpack
 */
export function hasFolder(path: string, fsJetpack: FSJetpack = jetpack): ExistsResult {
  return fsJetpack.exists(path);
}

/**
 * Find a file or folder in given path
 *
 * @param {string} folder
 * @param {FindOptions} options
 * @param {FSJetpack} fsJetpack
 * @return Promise<string[]>
 */
export function findByMatching(folder: string, options: FindOptions, fsJetpack: FSJetpack = jetpack): Promise<string[]> {
  return fsJetpack.findAsync(folder, options);
}


/**
 * Return the jetpack instance
 *
 */
export function fsJetpack(): FSJetpack {
  return jetpack;
}

/**
 * Resolve given path by fs-jetpack
 *
 * @param {string[]} pathParts
 * @param {FSJetpack} fsJetpack
 * @return {string}
 */
export function resolvePath(pathParts: string[], fsJetpack: FSJetpack = jetpack): string {
  return fsJetpack.path(...pathParts);
}

/**
 * Get the relativeId for given id
 *
 * @param {string} id
 * @return {string}
 */
export function relativeId(id: string) {
  if (!isAbsolute(id)) return id;
  return relative(resolve(), id);
}

/**
 * Render ejs template from given path
 *
 * @param {string} template
 * @param {[p: string]: any} replacers
 * @return {Promise<string>}
 */
export async function renderTemplateFromPath(template: string, replacers: { [key: string]: any }): Promise<string> {
  return await renderFile(template, replacers);
}

/**
 * Convert given name and type to useable object for file creation
 *
 * @param {string} name
 * @param {string} type
 * @return {className: string, path: string, fileName: string, completePath: string}
 */
export function convertNameType(name: string, type: string): { className: string, path: string, fileName: string, completePath: string } {
  const lowerName = name.toLowerCase();
  const sanitized = normalize(lowerName);
  const splitted = sanitized.split('/');

  let className = splitted.pop();

  if (!className.endsWith(type)) {
    className += type;
  }

  const fileName = `${dotCase(className)}.ts`;

  return {
    className: pascalCase(className),
    fileName,
    path: splitted.join('/'),
    completePath: [...splitted, fileName].join('/')
  };

}

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
