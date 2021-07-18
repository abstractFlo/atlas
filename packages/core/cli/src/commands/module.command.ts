import { Arguments, CommandModule } from 'yargs';
import { ejsClassTemplate, moduleClass } from '../helpers/file-object-stubs';
import {
  convertNameType,
  errorMessage,
  fsJetpack,
  renderTemplateFromString,
  successMessage
} from '@abstractflo/atlas-devtools';

export const ModuleCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'generate:module <name>',

  /**
   * Command Alias
   */
  aliases: 'gm',

  /**
   * Command description
   */
  describe: 'Generate new module',

  /**
   * Process the command
   */
  async handler(args: Arguments<{ name: string }>): Promise<void> {
    const converted = convertNameType(args.name, '-module');

    if (fsJetpack().exists(converted.completePath)) {
      return errorMessage(converted.completePath, 'Already exists');
    }

    const template = await renderTemplateFromString(
        ejsClassTemplate,
        { className: converted.className, ...moduleClass }
    );

    fsJetpack().file(converted.completePath, { content: template });
    successMessage(converted.completePath, 'Created');

  }
};
