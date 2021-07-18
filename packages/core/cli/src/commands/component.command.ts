import { Arguments, CommandModule } from 'yargs';
import {
  convertNameType,
  errorMessage,
  fsJetpack,
  renderTemplateFromString,
  successMessage
} from '@abstractflo/atlas-devtools';
import { componentClass, ejsClassTemplate } from '../helpers/file-object-stubs';

export const ComponentCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'generate:component <name>',

  /**
   * Command Alias
   */
  aliases: 'gc',

  /**
   * Command description
   */
  describe: 'Generate new component',

  /**
   * Process the command
   */
  async handler(args: Arguments<{ name: string }>): Promise<void> {
    const converted = convertNameType(args.name, '-component');

    if (fsJetpack().exists(converted.completePath)) {
      return errorMessage(converted.completePath, 'Already exists');
    }

    const template = await renderTemplateFromString(
        ejsClassTemplate,
        { className: converted.className, ...componentClass }
    );

    fsJetpack().file(converted.completePath, { content: template });
    successMessage(converted.completePath, 'Created');

  }
};
