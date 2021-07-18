import { dirname } from 'path';
import { Arguments, Argv, CommandModule } from 'yargs';
import { fileURLToPath } from 'url';
import {
  createTempCfg,
  dirAndFileInstaller,
  DirAndFileInstaller,
  fsJetpack,
  jsonToEnv,
  jsonToYaml,
  sanitizedCfg
} from '@abstractflo/atlas-devtools';
import { atlasJson, baseEnv, dockerCompose, pkgJson, serverCfgBase, tsConfig, tsEslint } from '../file-object-stubs';

export const NewCommand: CommandModule = {

  /**
   * Command Name
   */
  command: 'new <name>',

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
        })
        .option('force', {
          describe: 'This remove existing files!',
          type: 'boolean',
          default: false
        });
  },

  /**
   * Process the Command
   */
  async handler(args: Arguments<{ name: string, docker: boolean, force: boolean }>): Promise<void> {
    const { docker, force } = args;
    const installConfig = newProjectInstaller.filter(
        (item: DirAndFileInstaller & { dockerOnly?: boolean }) => docker ? item : !item.dockerOnly
    );

    dirAndFileInstaller(args.name, installConfig, force);
  }
};

/**
 * Project Installer
 */
const newProjectInstaller = [
  { name: 'resources' },
  { name: 'retail' },
  { name: 'tsconfig.json', file: tsConfig },
  { name: 'tsconfig.eslint.json', file: tsEslint },
  { name: 'package.json', file: pkgJson },
  { name: '.env', file: jsonToEnv(baseEnv) },
  { name: 'docker-compose.yaml', file: jsonToYaml(dockerCompose), dockerOnly: true },
  { name: '.docker/Dockerfile', file: dockerFile(), dockerOnly: true },
  { name: 'retail/server.cfg', file: getServerCfgBase().replace(/}/g, '#}') },
  { name: 'atlas.json', file: atlasJson }
];

/**
 * Read docker file
 *
 * @return {string}
 */
function dockerFile(): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return fsJetpack()
      .cwd(currentDir, '..')
      .read('stubs/Dockerfile', 'utf8');
}

/**
 * Prepare config
 * @return {string}
 */
function getServerCfgBase(): string {
  const cfg = createTempCfg(serverCfgBase).serialize();
  return sanitizedCfg(cfg);
}
