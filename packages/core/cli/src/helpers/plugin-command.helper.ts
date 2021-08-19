import {
  createProgressBar,
  env,
  executeCommand,
  formatBytes,
  fsJetpack,
  FSJetpack,
  PackageJson,
  PackageJsonDep,
  pluginFolderName,
  projectPkgJson,
  successMessage,
  writeProjectPkgJson
} from '@abstractflo/atlas-devtools';
import tar from 'tar';
import axios from 'axios';
import { green, yellow } from 'colorette';
import inquirer from 'inquirer';

export const axiosNoCacheOptions = {
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

/**
 * Extract the downloaded branch
 *
 * @param {string} pluginName
 * @param {string} extractTo
 * @param {FSJetpack} tmpDir
 * @return {Promise<void>}
 */
export async function extractBranch(pluginName: string, extractTo: string, tmpDir: FSJetpack): Promise<void> {
  const extractionDirPath = `${pluginFolderName}/${extractTo}`;

  fsJetpack().remove(extractionDirPath);

  const extractionDir = fsJetpack().dir(extractionDirPath);
  const writeStream = tmpDir.createReadStream(pluginName)
      .pipe(
          tar.x({
            strip: 1,
            C: extractionDir.cwd()
          })
      );

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      tmpDir.remove();
      resolve();
    });

    writeStream.on('error', () => {
      tmpDir.remove();
      reject();
    });
  });
}

/**
 * Download the branch
 *
 * @param {string} url
 * @param pluginName
 * @param downloadRef
 * @param tmpDir
 * @return {Promise<FSJetpack|void>}
 */
export async function downloadBranch(url: string, pluginName: string, downloadRef: string, tmpDir: FSJetpack): Promise<FSJetpack | void> {
  const writer = tmpDir.createWriteStream(pluginName);

  const { data, headers } = await axios.get(url, {
    responseType: 'stream',
    headers: axiosNoCacheOptions.headers
  });

  const totalLength = headers['content-length'] || 0;

  const progressBar = createProgressBar(
      '-> downloading [:bar] :percent :etas',
      {
        total: parseInt(totalLength)
      },
      `Starting download ${green(downloadRef)} [${yellow(formatBytes(totalLength))}]`
  );

  data.on('data', (chunk) => progressBar.tick(chunk.length));
  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(tmpDir));
    writer.on('error', reject);
  });

}

/**
 * Check if plugin already exists
 *
 * @param {string} authorRepo
 * @return boolean
 */
export function checkIfPluginAlreadyExists(authorRepo: string): boolean {
  const pluginPath = fsJetpack().path(pluginFolderName, authorRepo, 'package.json');

  return !!fsJetpack().exists(pluginPath);
}


/**
 * Check if plugin has atlas-plugin key
 *
 * @param {PackageJson} pluginPkgJson
 */
export function checkIfIsValidAtlasPackage(pluginPkgJson: PackageJson): void {

  if (pluginPkgJson?.atlas) return;

  throw new Error('This plugin is not a valid Atlas plugin. Contact the author if you think this is a failure.');
}


/**
 * Create inquirer message
 *
 * @param pluginPkg
 * @param pluginVersion
 * @param projectVersion
 * @return {{name: any, type: string, message: string, choices: ({name: string, value: any} | {name: string, value: any})[]}}
 */
export function createQuestion(pluginPkg, pluginVersion, projectVersion) {
  return {
    type: 'list',
    name: pluginPkg,
    message: `Please select the version of ${pluginPkg}`,
    choices: [
      { name: `plugin -> ${pluginVersion}`, value: pluginVersion },
      { name: `project -> ${projectVersion}`, value: projectVersion }
    ]
  };
}

/**
 * Return PackageJsonDep with right package versions
 *
 * @param {PackageJsonDep} mainPackages
 * @param {PackageJsonDep} pluginPackages
 * @return {Promise<PackageJsonDep>}
 */
export async function selectPluginPackageVersion(
    mainPackages: PackageJsonDep,
    pluginPackages: PackageJsonDep
): Promise<PackageJsonDep> {
  let readyForInstall = {};
  let versionQuestions = [];

  // Ready for Install Deps
  Object.keys(pluginPackages)
      .filter((pluginPkg: string) => !Object.keys(mainPackages).includes(pluginPkg))
      .forEach((pluginPkg: string) => readyForInstall = {
        ...readyForInstall,
        [pluginPkg]: pluginPackages[pluginPkg]
      });

  Object.keys(pluginPackages)
      .filter((pluginPkg: string) => Object.keys(mainPackages).includes(pluginPkg))
      .filter((pluginPkg: string) => pluginPackages[pluginPkg] !== mainPackages[pluginPkg])
      .forEach((pluginPkg: string) => {
        const pluginVersion = pluginPackages[pluginPkg];
        const projectVersion = mainPackages[pluginPkg];
        const question = createQuestion(pluginPkg, pluginVersion, projectVersion);

        versionQuestions.push(question);
      });

  const answerVersions = await inquirer.prompt(versionQuestions);

  return {
    ...mainPackages,
    ...pluginPackages,
    ...answerVersions
  };

}

/**
 * Check if repo exists and set default branch
 *
 * @param {string} apiBaseUrl
 * @param {string} branch
 * @return {Promise<Error | string>}
 */
export async function checkIfRepoExists(apiBaseUrl: string, branch: string): Promise<string> {
  try {
    const { data } = await axios.get(apiBaseUrl, axiosNoCacheOptions);
    return branch ?? data.default_branch;
  } catch (err) {
    throw Error('Could not load repository information. Please check if the repository is available publicy');
  }
}

/**
 * Return the plugin package.json
 *
 * @param {string} rawBaseUrl
 * @param {string} branch
 * @return {Promise<object>}
 */
export async function getPackageJson(rawBaseUrl: string, branch: string): Promise<PackageJson> {

  try {
    const { data } = await axios.get(`${rawBaseUrl}/${branch}/package.json`, axiosNoCacheOptions);
    return data;

  } catch (err) {
    throw new Error('This plugin is not a valid atlas-plugin. Contact the author if you think this is a failure.');
  }
}

/**
 * Return the github raw content base url
 *
 * @param {string} authorRepo
 * @return {`https://raw.githubusercontent.com/${string}`}
 */
export const githubRawBaseUrl = (authorRepo: string) => `https://raw.githubusercontent.com/${authorRepo}`;

/**
 * Return the github api base url
 *
 * @param {string} authorRepo
 * @return {`https://api.github.com/repos/${string}`}
 */
export const githubApiBaseUrl = (authorRepo: string) => `https://api.github.com/repos/${authorRepo}`;

/**
 * Return the github download url
 *
 * @param {string} authorRepo
 * @param {string} ref
 * @return {string}
 */
export const getGithubDownloadUrl = (authorRepo: string, ref: string) => `https://github.com/${authorRepo}/archive/refs/heads/${ref}.tar.gz`;

/**
 * Process the update or install
 *
 * @param {string} authorRepo
 * @param {string} branch
 * @param {PackageJson} pluginPkgJson
 * @param {FSJetpack} tmpDir
 * @return {Promise<void>}
 */
export async function setupAndDownloadPlugin(
    authorRepo: string,
    branch: string,
    pluginPkgJson: PackageJson,
    tmpDir: FSJetpack
): Promise<void> {
  const githubDownloadUrl = getGithubDownloadUrl(authorRepo, branch);
  const packagesReadyForInstall = {
    dependencies: {},
    devDependencies: {}
  };

  packagesReadyForInstall.dependencies = await selectPluginPackageVersion(
      projectPkgJson.dependencies ?? {},
      pluginPkgJson.dependencies ?? {}
  );

  packagesReadyForInstall.devDependencies = await selectPluginPackageVersion(
      projectPkgJson.devDependencies ?? {},
      pluginPkgJson.devDependencies ?? {}
  );

  writeProjectPkgJson({ ...projectPkgJson, ...packagesReadyForInstall });

  await downloadBranch(githubDownloadUrl, authorRepo.replace('/', '_'), authorRepo, tmpDir);
  await extractBranch(authorRepo.replace('/', '_'), authorRepo, tmpDir);

  successMessage('Download complete.');
}

/**
 * Exectute packagemanager install the deps
 *
 * @return {Promise<void>}
 */
export async function processInstallDeps(): Promise<void> {
  successMessage('Please wait a moment, install dependencies...');
  const command = env<string>('ATLAS_PLUGIN_INSTALLER_BIN', 'yarn') === 'yarn'
      ? 'yarn'
      : 'npm install';

  await executeCommand(
      command,
      'There is an error while installing your dependencies',
      { stdio: 'inherit' }
  );
}
