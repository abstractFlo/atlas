import {CommandModule} from "yargs";

export const NewCommand: CommandModule = {
	command: 'new',
	describe: 'Scaffold new atlas project',
	handler(): void {
		console.log("Scaffold new atlas project")
	}
}
