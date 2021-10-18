import { Arguments, Argv, CommandModule } from 'yargs';
import { DirAndFileInstaller, dirAndFileInstaller, normalize } from '@abstractflo/atlas-devtools';
import { gameResourceInstallerFiles } from '../helpers/game-resource.helper';

export const GameResourceCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'generate:game <name>',

  /**
   * Command alias
   */
  aliases: 'gg',

  /**
   * Command description
   */
  describe: 'Generate new game resource',

  /**
   * Setup command
   *
   * @param {Argv} yargs
   * @return {Argv}
   */
  builder(yargs: Argv): Argv {
    return yargs
        .wrap(120)
        .option('standalone', {
          alias: 's',
          describe: 'Is standalone resource',
          type: 'boolean',
          default: false
        });
  },

  /**
   * Process the command
   *
   * @param {Arguments} args
   * @return {Promise<void>}
   */
  async handler(args: Arguments<{ name: string, standalone: boolean }>) {
    const installFiles = await gameResourceInstallerFiles('.', args.standalone);

    dirAndFileInstaller<{ standalone?: boolean }>(
        args.name,
        installFiles
            .filter((item: DirAndFileInstaller & { standalone?: boolean }) => args.standalone ? item : !item.standalone)
    );

  }

};
