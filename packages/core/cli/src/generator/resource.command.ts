import { Arguments, Argv, CommandModule } from 'yargs';

export const ResourceCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'resource <type> <name>',

  /**
   * Command Alias
   */
  aliases: 'r',

  /**
   * Command description
   */
  describe: 'Generate new resource',

  /**
   * Command Setup
   * @param {Argv} yargs
   * @return {Argv}
   */
  builder(yargs: Argv): Argv {
    return yargs
        .wrap(140)
        .option('standalone', {
          describe: 'Standalone Resource. Only available on game resource create',
          default: false,
          alias: 's',
          type: 'boolean'
        });
  },

  /**
   * Process the command
   */
  async handler(args: Arguments<{ name: string, type: string, standalone: boolean }>): Promise<void> {
    console.log(args);
  }
};
