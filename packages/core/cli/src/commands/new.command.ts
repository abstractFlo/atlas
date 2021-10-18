import { dirname } from 'path';
import { Arguments, Argv, CommandModule } from 'yargs';
import { fileURLToPath } from 'url';
import {
  createTempCfg,
  dirAndFileInstaller,
  DirAndFileInstaller,
  fsJetpack,
  jsonToYaml,
  sanitizedCfg
} from '@abstractflo/atlas-devtools';
import { atlasJson, dockerCompose, pkgJsonStub, serverCfgBase, tsConfig, tsEslint } from '../helpers/file-object-stubs';
import { gameResourceInstallerFiles } from '../helpers/game-resource.helper';

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

    let installConfig = (await newProjectInstaller(args.name))
        .filter(
            (item: DirAndFileInstaller & { dockerOnly?: boolean }) => docker ? item : !item.dockerOnly
        );

    dirAndFileInstaller(args.name, installConfig, force);
    dirAndFileInstaller(
        `${args.name}/resources`,
        await gameResourceInstallerFiles('gamemode', true),
        force
    );
  }
};

/**
 * Project Installer
 */
async function newProjectInstaller(name: string): Promise<{ name: string, file: string | Record<any, any>, dockerOnly?: boolean }[]> {
  return [
    { name: 'tsconfig.json', file: tsConfig },
    { name: 'tsconfig.eslint.json', file: tsEslint },
    { name: 'package.json', file: await pkgJsonStub(name) },
    { name: '.env', file: getStubFile('stubs/env') },
    { name: 'atlas.json', file: atlasJson },
    { name: 'retail/server.cfg', file: getServerCfgBase().replace(/}/g, '#}') },
    { name: '.docker/Dockerfile', file: getStubFile('stubs/Dockerfile'), dockerOnly: true },
    { name: 'docker-compose.yaml', file: jsonToYaml(dockerCompose), dockerOnly: true }
  ];
}

/**
 * Read a stub file
 *
 * @param {string} path
 * @return {string}
 */
function getStubFile(path: string): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return fsJetpack()
      .cwd(currentDir, '..')
      .read(path, 'utf8');
}

/**
 * Prepare config
 * @return {string}
 */
function getServerCfgBase(): string {
  const cfg = createTempCfg(serverCfgBase).serialize();
  return sanitizedCfg(cfg);
}

