import { Arguments, Argv, CommandModule } from 'yargs';

export const PluginUpdateCommand: CommandModule = {
  /**
   * Command Name
   */
  command: 'plugin:update <author/repo>',

  /**
   * Command Alias
   */
  aliases: 'pu',

  /**
   * Command Description
   */
  describe: 'Update a plugin from github',

  builder(yargs: Argv): Argv {
    return yargs;
  },

  /**
   * Process the Command
   */
  async handler(_args: Arguments<any>): Promise<void> {

  }
};
