import { fsJetpack, resolveAndLoadFile } from './filesystem';
import { PackageJson, PackageJsonAtlas } from './types';
import { env } from './environment';

/**
 * Read the complete atlas.json file if exists
 *
 * @return {Promise<object>}
 */
export function getAtlasRc() {
  const pathToAtlasRc = fsJetpack().path('atlas-rc.json');
  return fsJetpack().read(pathToAtlasRc, 'json');
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

/**
 * Return the plugin folder name
 *
 * @type {string}
 */
export const pluginFolderName = env<string>('ATLAS_PLUGIN_FOLDER', 'plugins');

/**
 * Check if a hook exists in given package.json
 *
 * @param {keyof Omit<PackageJsonAtlas, "cli">} hookType
 * @param {PackageJson} packageJson
 */
export function getHookByType(hookType: keyof PackageJsonAtlas, packageJson: PackageJson): string | undefined {
  return packageJson?.atlas[hookType];
}

/**
 * Check if the hook ends with .js extension and exist
 * @param {string} hook
 * @return {boolean}
 */
export function checkIfValidHook(hook: string): void {
  const isHookFile = hook?.endsWith('.js');
  const fileExists = fsJetpack().exists(hook);

  if (fileExists && isHookFile) return;

  throw new Error(`File does not exists in ${hook}`);
}

/**
 * Run a hook for given hook type
 *
 * @param {keyof PackageJsonAtlas} hookType
 * @param {string} plugin
 * @return {Promise<void>}
 */
export async function runHook(hookType: keyof PackageJsonAtlas, plugin: string): Promise<void> {
  const hookPath = fsJetpack().cwd(pluginFolderName, plugin);
  const preinstall = getHookByType(
      hookType,
      hookPath.read('package.json', 'json')
  );

  const hookFile = hookPath.path(preinstall);

  checkIfValidHook(hookFile);
  await resolveAndLoadFile(hookFile);
}
