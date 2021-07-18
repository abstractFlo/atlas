import { Argv, CommandModule } from 'yargs';
import { ComponentCommand } from './component.command';
import { ServiceCommand } from './service.command';
import { ModuleCommand } from './module.command';
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
