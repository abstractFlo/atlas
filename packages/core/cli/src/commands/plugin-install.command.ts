import { Arguments, Argv, CommandModule } from 'yargs';
import { errorMessage, fsJetpack, runHook, successMessage } from '@abstractflo/atlas-devtools';
import {
  checkIfIsValidAtlasPackage,
  checkIfPluginAlreadyExists,
  checkIfRepoExists,
  getPackageJson, githubApiBaseUrl, githubRawBaseUrl, processInstallDeps,
  setupAndDownloadPlugin
} from '../helpers/plugin-command.helper';
import { green } from 'colorette';


export const PluginInstallCommand: CommandModule = {
  /**
   * Command Name
   */
  command: 'plugin:install <source>',

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
          if (args.source.includes('/')) return true;
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
      checkIfPluginExists(authorRepo);

      branch = await checkIfRepoExists(apiUrl, branch);
      const pluginPkgJson = await getPackageJson(baseUrl, branch);

      checkIfIsValidAtlasPackage(pluginPkgJson);

      await setupAndDownloadPlugin(authorRepo, branch, pluginPkgJson, tmpDir);

      await runHook('preinstall', authorRepo)
      await processInstallDeps();
      await runHook('postinstall', authorRepo)

      successMessage('Installation done', 'Complete');

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
function checkIfPluginExists(authorRepo: string): void {
  const pluginExists = checkIfPluginAlreadyExists(authorRepo);

  if (pluginExists) {
    throw new Error(`Plugin ${authorRepo} already exists.\nIf you want to update: ${green(`atlas plugin:update ${authorRepo}`)}`);
  }
}

