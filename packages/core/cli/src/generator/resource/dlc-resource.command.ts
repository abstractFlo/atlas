import { Arguments, Argv, CommandModule } from 'yargs';
import { cfgFromObject, dirAndFileInstaller, normalize, sanitizedCfg } from '@abstractflo/atlas-devtools';
import { streamCfg } from '../../file-object-stubs';
import {
  baseData, clothesStreamCfg, clothesTmpFiles,
  generateDirAndFileSetup,
  interiorProxiesStreamCfg,
  interiorProxiesTmpFiles,
  mloTmpFiles, pedStreamCfg, pedTmpFiles, soundStreamCfg, soundTmpFiles, tattooStreamCfg, tattooTmpFiles,
  vehicleStreamCfg,
  vehicleTmpFiles,
  weaponStreamCfg,
  weaponTmpFiles
} from './dlc-resource.helper';

export const DlcResourceCommand: CommandModule = {

  /**
   * Command Name
   */
  command: 'dlc <name>',

  /**
   * Command Description
   */
  describe: 'Generate new Dlc Resource like vehicle, weapons....',

  /**
   * Setup command
   * @param {Argv} yargs
   * @return {Argv}
   */
  builder(yargs: Argv): Argv {
    return yargs.option('type', {
      choices: ['vehicle', 'weapon', 'cloth', 'tattoo', 'mlo', 'ped', 'sound', 'proxi', 'base'],
      type: 'string',
      default: 'base'
    });
  },

  /**
   * Process the command
   *
   * @param {Arguments<{name: string}>} args
   * @return {Promise<void>}
   */
  async handler(args: Arguments<{ name: string, type: string }>) {
    const resourceName = normalize(args.name).split('/').pop();
    let streamData = [];

    switch (args.type) {
      case 'vehicle':
        streamData = generateDirAndFileSetup(
            vehicleTmpFiles(resourceName),
            vehicleStreamCfg(resourceName),
            baseData(resourceName, args.type)
        );
        break;

      case 'weapon':
        streamData = generateDirAndFileSetup(
            weaponTmpFiles(resourceName),
            weaponStreamCfg(resourceName),
            baseData(resourceName, args.type)
        );
        break;

      case 'cloth':
        streamData = generateDirAndFileSetup(
            clothesTmpFiles(resourceName),
            clothesStreamCfg(resourceName),
            baseData(resourceName, args.type, false)
        );
        break;

      case 'tattoo':
        streamData = generateDirAndFileSetup(
            tattooTmpFiles(resourceName),
            tattooStreamCfg(resourceName),
            baseData(resourceName, args.type, false)
        );
        break;

      case 'mlo':
        streamData = generateDirAndFileSetup(
            mloTmpFiles(resourceName),
            streamCfg,
            baseData(resourceName, args.type)
        );
        break;

      case 'proxi':
        streamData = generateDirAndFileSetup(
            interiorProxiesTmpFiles(resourceName),
            interiorProxiesStreamCfg(),
            baseData(resourceName, args.type, false)
        );
        break;

      /*case 'map':
        streamData = generateDirAndFileSetup(
            weaponTmpFiles(resourceName),
            weaponStreamCfg(resourceName),
            baseData(resourceName, args.type)
        );
        break;*/

      case 'ped':
        streamData = generateDirAndFileSetup(
            pedTmpFiles(resourceName),
            pedStreamCfg(),
            baseData(resourceName, args.type, false)
        );
        break;

      case 'sound':
        streamData = generateDirAndFileSetup(
            soundTmpFiles(),
            soundStreamCfg(),
            baseData(resourceName, args.type, false)
        );
        break;

      default:
        streamData = [{ name: 'stream.cfg', file: sanitizedCfg(cfgFromObject(streamCfg)) }];
        break;
    }

    dirAndFileInstaller(args.name, streamData);
  }
};
