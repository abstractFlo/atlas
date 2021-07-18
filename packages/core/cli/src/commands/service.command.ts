import { Arguments, CommandModule } from 'yargs';
import {
  convertNameType,
  errorMessage,
  fsJetpack,
  renderTemplateFromString,
  successMessage
} from '@abstractflo/atlas-devtools';
import { ejsClassTemplate, serviceClass } from '../helpers/file-object-stubs';

export const ServiceCommand: CommandModule = {

  /**
   * Command name
   */
  command: 'generate:service <name>',

  /**
   * Command Alias
   */
  aliases: 'gs',

  /**
   * Command description
   */
  describe: 'Generate service',

  /**
   * Process the command
   */
  async handler(args: Arguments<{ name: string }>): Promise<void> {
    const converted = convertNameType(args.name, '-service');

    if (fsJetpack().exists(converted.completePath)) {
      return errorMessage(converted.completePath, 'Already exists');
    }

    const template = await renderTemplateFromString(
        ejsClassTemplate,
        { className: converted.className, ...serviceClass }
    );

    fsJetpack().file(converted.completePath, { content: template });
    successMessage(converted.completePath, 'Created');

  }
};
