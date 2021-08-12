import { Arguments, Argv, CommandModule } from 'yargs';

export const PluginRemoveCommand: CommandModule = {
  /**
   * Command Name
   */
  command: 'plugin:remove <author/repo>',

  /**
   * Command Alias
   */
  aliases: 'pr',

  /**
   * Command Description
   */
  describe: 'Remove a installed plugin',

  builder(yargs: Argv): Argv {
    return yargs;
  },

  /**
   * Process the Command
   */
  async handler(_args: Arguments<any>): Promise<void> {

  }
};
