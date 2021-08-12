import { Arguments, Argv, CommandModule } from 'yargs';
import { env, errorMessage, projectPkgJson } from '@abstractflo/atlas-devtools';
import { axiosNoCacheOptions, getDefaultBranch } from '../helpers/plugin-command.helper';
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

    const baseUrl = `https://github.com/${authorRepo}`;
    const apiBaseUrl = `https://api.github.com/repos/${authorRepo}`;
    const getDownloadUrl = (ref: string) => `${apiBaseUrl}/tarball/${ref}`;

    if (!branch) {
      branch = await getDefaultBranch(apiBaseUrl);
    }

    try {
      const { data: pluginData } = await axios.get(`${apiBaseUrl}/contents?ref=${branch}`);
      const pkgJson = pluginData.find((path: any) => path.name === 'package.json');

      if (!pkgJson) throw new Error('This plugin does not contains a package.json');

      const { data: pkgData } = await axios.get(pkgJson.download_url, axiosNoCacheOptions);

      if (!Reflect.has(pkgData, 'atlas-plugin') || !Reflect.get(pkgData, 'atlas-plugin')) {
        throw new Error('This plugin is not a valid atlas-plugin. Contact the Author if you think this is failure.');
      }

      const mainPackages = Object.keys(projectPkgJson.dependencies);
      const pluginPackages = Object.keys(pkgData.dependencies);

      const packagesReadyForInstall = {
        dependencies:  {},
        devDependencies:  {}
      };

      const versionQuestions = [];

      pluginPackages.forEach((pluginPkg: string) => {
        if(mainPackages.includes(pluginPkg)) return;

        packagesReadyForInstall.dependencies = {
          ...packagesReadyForInstall.dependencies,
          [pluginPkg]: pkgData.dependencies[pluginPkg]
        }
      })

      pluginPackages
          .filter((pluginPkg: string) => mainPackages.includes(pluginPkg))
          .filter((pluginPkg: string) => pkgData.dependencies[pluginPkg] !== projectPkgJson.dependencies[pluginPkg])
          .forEach((pluginPkg: string) => {
            const pluginVersion = pkgData.dependencies[pluginPkg];
            const projectVersion = projectPkgJson.dependencies[pluginPkg];
            const question = createQuestion(pluginPkg, pluginVersion, projectVersion);

            versionQuestions.push(question);
          });

      const answersVersions = await inquirer.prompt(versionQuestions);

      console.log({
        ...projectPkgJson.dependencies,
        ...packagesReadyForInstall.dependencies,
        ...answersVersions,
      });

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
    message: `Please select then version of ${pluginPkg}`,
    choices: [
      { name: `plugin -> ${pluginVersion}`, value: pluginVersion},
      { name: `project -> ${projectVersion}`, value: projectVersion}
    ]
  };
}

