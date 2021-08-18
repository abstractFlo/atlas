import { Arguments, Argv, CommandModule } from 'yargs';
import { errorMessage, fsJetpack, pluginFolderName, successMessage } from '@abstractflo/atlas-devtools';
import {
  checkIfIsValidAtlasPackage,
  checkIfPluginAlreadyExists,
  checkIfRepoExists,
  getPackageJson,
  githubApiBaseUrl,
  githubRawBaseUrl,
  processInstallOrUpdate
} from '../helpers/plugin-command.helper';
import { green, yellow } from 'colorette';


export const PluginUpdateCommand: CommandModule = {
  /**
   * Command Name
   */
  command: 'plugin:update <source>',

  /**
   * Command Alias
   */
  aliases: 'pu',

  /**
   * Command Description
   */
  describe: 'Download and update a plugin from github',

  builder(yargs: Argv): Argv {
    return yargs
        .check((args: Arguments<{ source: string, dest: string }>) => {
          if (args.source.includes('/')) return true;
          throw new Error('Please provide author and repo name, e.g abstractflo/atlas-plugin-test');
        })
        .positional(
            'source', {
              describe: 'Author and Repo name optional with branch hash',
              type: 'string'
            })
        .example(
            'plugin:update foo/bar#main .',
            'Update the plugin from github author <foo> and repo <bar> from branch <main> '
        );
  },

  /**
   * Process the Command
   */
  async handler(args: Arguments<{ source: string, dest: string }>): Promise<void> {
    let [authorRepo, branch] = args.source.split('#');

    const baseUrl = githubRawBaseUrl(authorRepo);
    const apiUrl = githubApiBaseUrl(authorRepo);
    const tmpDir = fsJetpack().tmpDir();

    try {
      checkIfPluginDoesNotExists(authorRepo);

      branch = await checkIfRepoExists(apiUrl, branch);
      const pluginPkgJson = await getPackageJson(baseUrl, branch);

      checkIfIsValidAtlasPackage(pluginPkgJson);
      checkIfPluginVersionIsSame(authorRepo, pluginPkgJson.version);

      await processInstallOrUpdate(authorRepo, branch, pluginPkgJson, tmpDir);

      successMessage('Update done', 'Complete');

    } catch (err) {
      errorMessage(err.message);
      tmpDir.remove();
    }
  }
};

/**
 * Check if the plugin already exists
 *
 * @param {string} authorRepo
 */
function checkIfPluginDoesNotExists(authorRepo: string): void {
  const pluginExists = checkIfPluginAlreadyExists(authorRepo);

  if (!pluginExists) {
    throw new Error(`Plugin ${authorRepo} does not exists.\nIf you want to install: ${green(`atlas plugin:install ${authorRepo}`)}`);
  }
}

/**
 * Check if the local version is the same as remote
 */
function checkIfPluginVersionIsSame(authorRepo: string, remoteVersion: string): void {
  const localPkgJson = fsJetpack().cwd(pluginFolderName, authorRepo).read('package.json', 'json');

  if (localPkgJson.version === remoteVersion) {
    throw new Error(`Plugin ${green(authorRepo)} is on latest version ${yellow(remoteVersion)}. No need for update`);
  }

}
