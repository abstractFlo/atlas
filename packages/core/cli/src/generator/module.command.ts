import { Arguments, Argv, CommandModule } from 'yargs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  convertNameType,
  errorMessage,
  fsJetpack,
  renderTemplateFromPath,
  successMessage
} from '@abstractflo/atlas-devtools';
import baseFileCreator from './baseFileCreator';

export const ModuleCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'module <name>',

  /**
   * Command Alias
   */
  aliases: 'm',

  /**
   * Command description
   */
  describe: 'Generate new module',

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
        '-module',
        'import { Module } from \'@abstractflo/atlas-shared\'',
        '@Module({})'
    );
  }
};
