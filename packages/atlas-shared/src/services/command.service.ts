import { CommandModel } from '../models/command.model';
import { KEYS } from '../constants/decorator.constants';
import { container, singleton } from 'tsyringe';
//@ts-ignore
import * as alt from 'alt-server';

@singleton()
export class CommandService {

  private commands: Map<string, CommandModel> = new Map<string, CommandModel>();


  private cmdArgs: string[] = [];

  private prefix: string = '/';

  public start(): void {
    this.load();
    alt.on('consoleCommand', this.consoleCommand.bind(this));
  }

  private load(): void {
    const commands = this.getCommandsFromMeta();
    commands.forEach((command: CommandModel) => {
      this.add(command);
    });
  }

  /**
   * Add new command to pool if not exists
   *
   * @param {CommandModel} command
   * @private
   */
  private add(command: CommandModel): void {
    if (this.commands.has(command.name)) return;

    this.commands.set(command.name, command);
  }

  /**
   * Return the command models from meta data
   *
   * @return {CommandModel[]}
   * @private
   */
  private getCommandsFromMeta(): CommandModel[] {
    return Reflect.getMetadata(KEYS.COMMANDS, this) || [];
  }

  private setArguments(args: any): void {
    this.cmdArgs = args;
  }

  private consoleCommand(cmd: string, ...args: any[]): void {
    this.setArguments(args);
    this.run(cmd);
  }

  private run(cmd: string) {
    const command = cmd.slice(this.prefix.length);
    const commandEntry = this.commands.get(command);

    if (!cmd.startsWith(this.prefix) || !commandEntry) return;

    const instances = container.resolveAll<any>(commandEntry.target);

    instances.forEach((instance) => {
      if (!instance[commandEntry.methodName]) return;

      instance[commandEntry.methodName].bind(instance).apply(this, this.cmdArgs);
    });
  }
}
