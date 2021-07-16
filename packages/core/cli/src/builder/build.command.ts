import { Arguments, Argv, CommandModule } from 'yargs';
import { Builder } from './builder';
import { ResourceConfigCreator, ResourceManager } from '@abstractflo/atlas-devtools';

export const BuildCommand: CommandModule = {
  command: 'build',
  describe: 'Build your gamemode',
  builder(yargs: Argv): Argv {
    return yargs.option('watch', {
      alias: 'w',
      describe: 'Watch file changes',
      default: false,
      type: 'boolean'
    });
  },
  async handler(args: Arguments<{ watch: boolean }>): Promise<void> {
    const builder = new Builder(args.watch);
    const manager = new ResourceManager();

    const availableResources = await manager.findAvailableResources();
    const configs = new ResourceConfigCreator(availableResources).getConfigs();

    await builder.run(configs);
  }
};
