import { Argv, CommandModule } from 'yargs';
import { GameResourceCommand } from './resource/game-resource.command';
import { DlcResourceCommand } from './resource/dlc-resource.command';
import { AssetResourceCommand } from './resource/asset-resource.command';

export const ResourceCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'resource',

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
        .wrap(120)
        .demandCommand()
        .command(GameResourceCommand)
        .command(DlcResourceCommand)
        .command(AssetResourceCommand);
  },

  /**
   * Process the command
   */
  handler() {}
};
