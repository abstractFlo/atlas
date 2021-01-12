import { container, singleton } from 'tsyringe';
import { CommandModel } from '../core';
import { UtilsService } from './utils.service';
import { BaseEventService } from './base-event.service';
import { StringResolver } from '../decorators/string-resolver.decorator';

@StringResolver
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
   * Contains the prefix for commands
   *
   * @type {string}
   * @private
   */
  private prefix: string = '/';


  /**
   * Add new command to commands array
   *
   * @param {string} cmd
   * @param {string} methodName
   * @param {string} target
   */
  public add(cmd: string, methodName: string, target: string): void {
    if (this.commands.has(cmd)) {
      return;
    }

    const command = new CommandModel().cast({ methodName, target });
    this.commands.set(cmd, command);
  }

  /**
   * Run the command if exists
   *
   * @param {string} cmd
   */
  public run(cmd: string): void {
    let command = cmd.slice(this.prefix.length);

    if (cmd.startsWith(this.prefix) && this.commands.has(command)) {
      const commandEntry = this.commands.get(command);
      const instance = container.resolve<any>(commandEntry.target);

      instance[commandEntry.methodName].bind(instance).apply(this, this.cmdArgs);
    }
  }

  /**
   * Set the command prefix if default does not fit your needs
   *
   * @param {string} prefix
   */
  public setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  /**
   * Start consoleCommand listening process
   */
  public start(): void {
    const eventService = container.resolve(BaseEventService);
    eventService.on('consoleCommand', this.consoleCommand.bind(this));
  }

  /**
   * Autostart command service
   *
   * @param {Function} done
   */
  public autoStart(done: CallableFunction): void {
    if (this.commands.size > 0) {
      UtilsService.log('Starting ~y~CommandService Decorator~w~');
      this.start();
      UtilsService.log('Started ~lg~CommandService Decorator~w~');
    }
    done();
  }

  /**
   * Set arguments for current console command call
   *
   * @param args
   * @private
   */
  private setArguments(args: any): void {
    this.cmdArgs = args;
  }

  /**
   * Run consoleCommand
   *
   * @param {string} cmd
   * @param args
   * @private
   */
  private consoleCommand(cmd: string, ...args: any[]): void {
    this.setArguments(args);
    this.run(cmd);
  }
}
