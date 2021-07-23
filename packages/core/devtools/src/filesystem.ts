import { CopyOptions, ExistsResult, FindOptions, FSJetpack } from 'fs-jetpack/types';
import jetpack from 'fs-jetpack';
import { render, renderFile } from 'ejs';
import { dotCase, normalize, pascalCase } from './string';
import { errorMessage, successMessage } from './terminal';

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
 * Render ejs from given string
 *
 * @param {string} templateString
 * @param {[p: string]: any} replacers
 * @return {Promise<string>}
 */
export async function renderTemplateFromString(templateString: string, replacers: { [key: string]: any }): Promise<string> {
  return await render(templateString, replacers, { async: true });
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
 * Install helper for creating files and folders
 *
 * @param path
 * @param installConfig
 * @param force
 * @param fsJetpack
 */
export function dirAndFileInstaller<T = any>(path: string, installConfig: (DirAndFileInstaller & T)[], force: boolean = false, fsJetpack: FSJetpack = jetpack): void {
  let jetpack = fsJetpack.cwd(path);

  if (!force && jetpack.exists('')) {
    return errorMessage(jetpack.path(''), 'Already Exists');
  }

  installConfig
      .forEach((step: { name: string, file?: any }) => {
        if (!step.file) {
          jetpack.dir(step.name);
        } else {
          jetpack.file(step.name, {
            content: step.file === 'empty' ? '' : step.file
          });
        }

        successMessage(jetpack.path(step.name), 'Created');
      });
}

/**
 * Copy given source to destination
 *
 * @param {string} source
 * @param {string} destination
 * @param {CopyOptions} options
 */
export function copy(source: string, destination: string, options: CopyOptions = { overwrite: true }): void {
  return fsJetpack().copy(source, destination, options);
}

/**
 * Interface for dirAndFileInstaller function
 */
export interface DirAndFileInstaller {
  name: string;
  file?: string | object | number | boolean;
}
