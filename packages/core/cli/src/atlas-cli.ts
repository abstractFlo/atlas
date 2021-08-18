import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { NewCommand } from './commands/new.command';
import { BuildCommand } from './commands/build.command';
import { GameResourceCommand } from './commands/game-resource.command';
import { DlcResourceCommand } from './commands/dlc-resource.command';
import { AssetResourceCommand } from './commands/asset-resource.command';
import { ComponentCommand } from './commands/component.command';
import { ModuleCommand } from './commands/module.command';
import { ServiceCommand } from './commands/service.command';
import { PluginInstallCommand } from './commands/plugin-install.command';
import { PluginUpdateCommand } from './commands/plugin-update.command';
import { PluginRemoveCommand } from './commands/plugin-remove.command';
import { errorMessage, fsJetpack } from '@abstractflo/atlas-devtools';
import { pathToFileURL } from 'url';

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

program.command({
  command: 'foo',
  describe: 'foo Command',
  handler: () => {

    const pluginFile = fsJetpack().path('plugins/abstractflo/atlas-test-plugin/myFile.js');
    const fileUrl = pathToFileURL(pluginFile);
    import(fileUrl.href).then(m => m);

  }
});

program
    .help('h')
    .alias('h', 'help')
    .fail((msg: string, _err: Error, _yargs: Argv) => {
      msg ? errorMessage(msg) : program.showHelp();

      process.exit(1);
    })
    .argv;
