import { Arguments, Argv, CommandModule } from 'yargs';
import {
  convertNameType, errorMessage,
  fsJetpack,
  renderTemplateFromPath,
  stderr,
  successMessage
} from '@abstractflo/atlas-devtools';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { red } from 'colorette';
import baseFileCreator from './baseFileCreator';

export const ComponentCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'component <name>',

  /**
   * Command Alias
   */
  aliases: 'c',

  /**
   * Command description
   */
  describe: 'Generate new component',

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
        '-component',
        'import { Component } from \'@abstractflo/atlas-shared\'',
        '@Component'
    );
  }
};
