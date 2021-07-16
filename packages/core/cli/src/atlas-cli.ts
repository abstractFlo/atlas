import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {NewCommand} from "./commands/new.command";
import {GenerateCommand} from "./generator/generate.command";
import {BuildCommand} from "./builder/build.command";


const program = yargs(hideBin(process.argv))
	.scriptName('atlas')
	.usage('Usage: $0 <cmd> [options]')
	.detectLocale(false)
	.demandCommand();

program.command(NewCommand);
program.command(GenerateCommand);
program.command(BuildCommand);


program
	.help('h')
	.alias('h', 'help')
	.fail(() => program.showHelp())
	.argv;
