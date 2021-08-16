import { Arguments, Argv, CommandModule } from 'yargs';
import {
  env,
  errorMessage,
  executeCommand,
  fsJetpack,
  PackageJson,
  PackageJsonDep,
  projectPkgJson,
  successMessage,
  writeProjectPkgJson
} from '@abstractflo/atlas-devtools';
import { axiosNoCacheOptions, downloadBranch, extractBranch } from '../helpers/plugin-command.helper';
import axios from 'axios';
import inquirer from 'inquirer';


export const PluginInstallCommand: CommandModule = {
  /**
   * Command Name
   */
  command: 'plugin:install <source> [dest]',

  /**
   * Command Alias
   */
  aliases: 'pi',

  /**
   * Command Description
   */
  describe: 'Download a plugin from github',

  builder(yargs: Argv): Argv {
    return yargs
        .check((args: Arguments<{ source: string, dest: string }>) => {
          if(args.source.includes('/')) return true;
          throw new Error('Please provide author and repo name, e.g abstractflo/atlas-plugin-test');
        })
        .positional(
            'source', {
              describe: 'Author and Repo name optional with branch hash',
              type: 'string'
            })
        .example(
            'plugin:install foo/bar#main .',
            'Install the plugin from github author <foo> and repo <bar> from branch <main> '
        )
        .positional('dest', {
          describe: 'Destination where the plugin would be installed',
          type: 'string',
          default: env<string>('ATLAS_PLUGIN_FOLDER', 'plugins')
        });
  },

  /**
   * Process the Command
   */
  async handler(args: Arguments<{ source: string, dest: string }>): Promise<void> {
    let [authorRepo, branch] = args.source.split('#');

    const rawBaseUrl = `https://raw.githubusercontent.com/${authorRepo}`;
    const apiBaseUrl = `https://api.github.com/repos/${authorRepo}`;
    const getDownloadUrl = (ref: string) => `https://github.com/${authorRepo}/archive/refs/heads/${ref}.tar.gz`;


    try {
      branch = await checkIfRepoExists(apiBaseUrl, branch);
      const pluginPkgJson = await getPackageJson(rawBaseUrl, branch);
      checkIfIsValidAtlasPackage(pluginPkgJson);

      const tmpDir = fsJetpack().tmpDir();

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

      await downloadBranch(getDownloadUrl(branch), authorRepo.replace('/', '_'), authorRepo, tmpDir);
      await extractBranch(authorRepo.replace('/', '_'), authorRepo, tmpDir);

      successMessage('Download complete, install dependencies...');

      const command = env<string>('ATLAS_PLUGIN_INSTALLER_BIN', 'yarn') === 'yarn'
          ? 'yarn'
          : 'npm install';

      await executeCommand(
          command,
          'There is an error while installing your dependencies',
          { stdio: 'inherit' }
      );

      successMessage('Installation done', 'Complete');

    } catch (err) {
      errorMessage(err.message);
    }
  }
};


/**
 * Create inquirer message
 *
 * @param pluginPkg
 * @param pluginVersion
 * @param projectVersion
 * @return {{name: any, type: string, message: string, choices: ({name: string, value: any} | {name: string, value: any})[]}}
 */
function createQuestion(pluginPkg, pluginVersion, projectVersion) {
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
async function selectPluginPackageVersion(
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
async function checkIfRepoExists(apiBaseUrl: string, branch: string): Promise<string> {
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
async function getPackageJson(rawBaseUrl: string, branch: string): Promise<PackageJson> {

  try {
    const { data } = await axios.get(`${rawBaseUrl}/${branch}/package.json`, axiosNoCacheOptions);
    return data;

  } catch (err) {
    throw new Error('This plugin is not a valid atlas-plugin. Contact the author if you think this is a failure.');
  }
}

/**
 * Check if plugin has atlas-plugin key
 *
 * @param {PackageJson} pluginPkgJson
 */
function checkIfIsValidAtlasPackage(pluginPkgJson: PackageJson): void {
  const hasKey = Reflect.has(pluginPkgJson, 'atlas-plugin');
  const isValid = Reflect.get(pluginPkgJson, 'atlas-plugin');

  if (hasKey && isValid) return;

  throw new Error('This plugin is not a valid atlas-plugin. Contact the author if you think this is a failure.');
}
