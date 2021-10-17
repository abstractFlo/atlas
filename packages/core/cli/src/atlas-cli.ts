import yargs, { Argv, CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DlcResourceCommand } from './commands/dlc-resource.command';
import { NewCommand } from './commands/new.command';
import { errorMessage, fsJetpack, pluginFolderName, resolveAndLoadFile } from '@abstractflo/atlas-devtools';
import { ComponentCommand } from './commands/component.command';
import { PluginUpdateCommand } from './commands/plugin-update.command';
import { GameResourceCommand } from './commands/game-resource.command';
import { AssetResourceCommand } from './commands/asset-resource.command';
import { ModuleCommand } from './commands/module.command';
import { BuildCommand } from './commands/build.command';
import { PluginRemoveCommand } from './commands/plugin-remove.command';
import { ServiceCommand } from './commands/service.command';
import { PluginInstallCommand } from './commands/plugin-install.command';

const program = yargs(hideBin(process.argv))
    .scriptName('atlas')
    .usage('Usage: $0 <cmd> [options]')
    .detectLocale(false)
    .demandCommand()
    .wrap(120);

program.command(BuildCommand);
program.command(GameResourceCommand);
program.command(DlcResourceCommand);
program.command(AssetResourceCommand);
program.command(ComponentCommand);
program.command(ModuleCommand);
program.command(ServiceCommand);
program.command(PluginInstallCommand);
program.command(PluginUpdateCommand);
program.command(PluginRemoveCommand);
program.command(NewCommand);


async function bootstrap() {
  ///// TEST HOOKS
  // GITHUB INSTALLED PLUGINS
  if(fsJetpack().exists(pluginFolderName)) {
    const commandExtends = [];
    const githubPlugins = fsJetpack().find(pluginFolderName, {
      matching: [
        '!node_modules',
        '!node_modules/**',
        'package.json'
      ],
      files: true,
      directories: false,
      recursive: true
    });

    githubPlugins.forEach((plugin: string) => {
      const packageJson = fsJetpack().read(plugin, 'json');
      if (!packageJson?.atlas?.commands) return;

      commandExtends.push(fsJetpack().path(plugin.replace('package.json', ''), packageJson.atlas.commands));
    });

    const rootPackageJson = fsJetpack().read('package.json', 'json');
    const installedPackages = [...Object.keys(rootPackageJson.dependencies), ...Object.keys(rootPackageJson.devDependencies)];

    installedPackages.forEach((packageName: string) => {

      const packageJsonPath = fsJetpack().cwd('node_modules').path(packageName, 'package.json');

      if (!fsJetpack().exists(packageJsonPath)) return;
      const installedPackageJson = fsJetpack().read(packageJsonPath, 'json');

      if (!installedPackageJson?.atlas?.commands) return;
      commandExtends.push(fsJetpack().path(
          packageJsonPath.replace('package.json', ''),
          installedPackageJson.atlas.commands
      ));

    });

    for (const commandFile of commandExtends) {
      const file: any = await resolveAndLoadFile(commandFile);
      const resolvedFile = file.default || file;

      Object.values(resolvedFile).forEach((command: CommandModule) => {
        program.command(command);
      });
    }
  }
//// END TEST HOOKS

  program
      .help('h')
      .alias('h', 'help')
      .fail((msg: string, _err: Error, _yargs: Argv) => {
        msg ? errorMessage(msg) : program.showHelp();
        //process.exit(1);
      })
      .argv;
}


bootstrap();


