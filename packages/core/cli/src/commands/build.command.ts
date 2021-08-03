import { Arguments, Argv, CommandModule } from 'yargs';
import { Builder } from '../builder/builder';
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
    const creator = new ResourceConfigCreator(availableResources).getConfigs();

    await builder.addResourcesToServerCfg(availableResources);
    await builder.run(creator);
  }
};
