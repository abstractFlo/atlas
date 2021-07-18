import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { NewCommand } from './commands/new.command';
import { BuildCommand } from './commands/build.command';
import { GameResourceCommand } from './commands/game-resource.command';
import { DlcResourceCommand } from './commands/dlc-resource.command';
import { AssetResourceCommand } from './commands/asset-resource.command';
import { ComponentCommand } from './commands/component.command';
import { ModuleCommand } from './commands/module.command';
import { ServiceCommand } from './commands/service.command';


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
program.command(NewCommand);


program
    .help('h')
    .alias('h', 'help')
    .fail(() => program.showHelp())
    .argv;
