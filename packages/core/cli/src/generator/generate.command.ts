import { Argv, CommandModule } from 'yargs';
import { ComponentCommand } from './classes/component.command';
import { ServiceCommand } from './classes/service.command';
import { ModuleCommand } from './classes/module.command';
import { ResourceCommand } from './resource.command';

export const GenerateCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'generate',

  /**
   * Command description
   */
  describe: 'Generate service, modules and components',

  /**
   * Command Alias
   */
  aliases: 'g',

  /**
   * Command Setup
   * @param {Argv} yargs
   * @return {Argv}
   */
  builder(yargs: Argv): Argv {
    return yargs
        .wrap(100)
        .demandCommand()
        .command(ComponentCommand)
        .command(ServiceCommand)
        .command(ModuleCommand)
        .command(ResourceCommand);
  },

  /**
   * Process the command
   */
  handler(): void {}
};
