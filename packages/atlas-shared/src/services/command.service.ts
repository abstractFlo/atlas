import { CommandModel } from '../models';
import { container, singleton } from 'tsyringe';
import { AutoloaderEnums, CommandEnums } from '../constants';
import { Autoload } from '../decorators/loader.decorator';
import { UtilsService } from './utils.service';

@Autoload(AutoloaderEnums.AFTER_BOOT, { methodName: 'start' })
@singleton()
export class CommandService {

  /**
   * Contains all commands
   *
   * @type {Map<string, CommandModel>}
   * @private
   */
  private commands: Map<string, CommandModel> = new Map<string, CommandModel>();

  /**
   * Contains the arguments for command
   *
   * @type {string[]}
   * @private
   */
  private cmdArgs: string[] = [];

  /**
   * Contains the command prefix
   *
   * @type {string}
   * @private
   */
  private prefix: string = '/';

  /**
   * Start the command handler
   */
  public start(done: CallableFunction): void {
    this.load();

    if (this.commands.size === 0) return done();

    UtilsService.eventOn('consoleCommand', this.consoleCommand.bind(this));
    UtilsService.logRegisteredHandlers('consoleCommand', this.commands.size);
    UtilsService.logLoaded('CommandService');

    done();
  }

  /**
   * Load the commands at runtime from decorated meta data
   *
   * @private
   */
  private load(): void {
    const commands: CommandModel[] = Reflect.getMetadata(CommandEnums.CONSOLE_COMMAND, this) || [];

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
   * Setup command arguments
   *
   * @param args
   * @private
   */
  private setArguments(args: any): void {
    this.cmdArgs = args;
  }

  /**
   * Process the console command
   *
   * @param {string} cmd
   * @param args
   * @private
   */
  private consoleCommand(cmd: string, ...args: any[]): void {
    this.setArguments(args);
    this.run(cmd);
  }

  /**
   * Search for command and process if exists
   *
   * @param {string} cmd
   * @private
   */
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
