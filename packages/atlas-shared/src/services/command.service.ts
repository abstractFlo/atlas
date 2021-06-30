import { container, singleton } from 'tsyringe';
import { EventModel } from '../models/event.model';

@singleton()
export class CommandService {
  /**
   * Contains all commands
   *
   * @type {Map<string, EventModel>}
   * @private
   */
  private commands: Map<string, EventModel> = new Map<string, EventModel>();

  /**
   * Contains the command prefix
   *
   * @type {string}
   * @private
   */
  private prefix: string = '/';

  /**
   * Load the commands at runtime from decorated meta data
   *
   * @private
   */
  public setupCommands(events: EventModel[]): void {
    events.forEach((event: EventModel) => this.add(event));
  }

  /**
   * Setup new prefix for commandConsole
   *
   * @param {string} prefix
   */
  public setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  /**
   * Search for command and process if exists
   *
   * @param {string} cmd
   * @param {any[]} args
   * @private
   */
  public run(cmd: string, ...args: any[]): void {
    const command = cmd.slice(this.prefix.length);
    const commandEntry = this.commands.get(command);

    if (!cmd.startsWith(this.prefix) || !commandEntry) return;

    const instances = container.resolveAll<any>(commandEntry.targetName);

    instances.forEach(async (instance) => {
      const instanceMethod = instance[commandEntry.methodName];

      if (!instanceMethod) return;

      const method = instanceMethod.bind(instance);
      await method(...args);
    });
  }

  /**
   * Add new command to pool if not exists
   *
   * @param {EventModel} event
   * @private
   */
  private add(event: EventModel): void {
    if (this.commands.has(event.eventName)) return;

    this.commands.set(event.eventName, event);
  }
}
