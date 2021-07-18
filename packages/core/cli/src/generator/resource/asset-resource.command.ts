import { Arguments, CommandModule } from 'yargs';
import { cfgFromObject, dirAndFileInstaller, normalize, paramCase, sanitizedCfg } from '@abstractflo/atlas-devtools';
import { assetPackResource } from '../../file-object-stubs';

export const AssetResourceCommand: CommandModule = {

  /**
   * Command Name
   */
  command: 'asset <name>',

  /**
   * Command Alias
   */
  aliases: 'a',

  /**
   * Command Description
   */
  describe: 'Generate new Asset-Pack Resource',


  /**
   * Process the command
   *
   * @param {Arguments<{name: string}>} args
   * @return {Promise<void>}
   */
  async handler(args: Arguments<{ name: string }>) {
    const resourceName = normalize(args.name).split('/').pop();

    dirAndFileInstaller(args.name, [
      { name: 'assets/.gitkeep', file: 'empty' },
      { name: 'altas-resource.json', file: { name: paramCase(resourceName) } },
      { name: 'resource.cfg', file: sanitizedCfg(cfgFromObject(assetPackResource)) }
    ]);
  }

};
