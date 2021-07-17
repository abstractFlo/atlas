import { Arguments, Argv, CommandModule } from 'yargs';
import { writeJsonToYaml } from '@abstractflo/atlas-devtools';
import { dockerCompose } from '../file-object-stubs';

export const NewCommand: CommandModule = {

  /**
   * Command Name
   */
  command: 'new',

  /**
   * Command Alias
   */
  aliases: 'n',

  /**
   * Command Description
   */
  describe: 'Scaffold new atlas project',

  builder(yargs: Argv): Argv {
    return yargs
        .option('docker', {
          describe: 'Enable Docker Support',
          alias: 'd',
          type: 'boolean',
          default: false
        });
  },

  /**
   * Process the Command
   */
  async handler(args: Arguments<{ docker: boolean }>): Promise<void> {
    const isDocker = args.docker;

    try {
      await writeJsonToYaml('docker-compose-test.yml', dockerCompose, true);
    } catch (err) {
      console.error(err);
    }

  }
};
