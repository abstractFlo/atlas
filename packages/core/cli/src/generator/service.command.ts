import { Arguments, Argv, CommandModule } from 'yargs';
import baseFileCreator from './baseFileCreator';

export const ServiceCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'service <name>',

  /**
   * Command Alias
   */
  aliases: 's',

  /**
   * Command description
   */
  describe: 'Generate service',

  /**
   * Command Setup
   * @param {Argv} yargs
   * @return {Argv}
   */
  builder(yargs: Argv): Argv {
    return yargs;
  },

  /**
   * Process the command
   */
  async handler(args: Arguments<{ name: string }>): Promise<void> {
    await baseFileCreator(
        args.name,
        '-service',
        'import { Singleton } from \'@abstractflo/atlas-shared\'',
        '@Singleton'
    );
  }
};
