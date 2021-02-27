import { container, singleton } from 'tsyringe';
import { EventModel } from '../models';
import { EventEnum } from '../constants';
import { constructor } from '../types';
import { EventServiceInterface } from '../interfaces';
import { UtilsService } from './utils.service';
import { Entity } from 'alt-server';
import { CommandService } from './command.service';
import { getAtlasMetaData } from '../decorators';

@singleton()
export class BaseEventService implements EventServiceInterface {


  /**
   * Contains all events where first param is an entity
   *
   * @type {string[]}
   * @protected
   */
  protected entityChangeEvents: string[] = [
    EventEnum.STREAM_SYNCED_META_CHANGE,
    EventEnum.SYNCED_META_CHANGE,
    EventEnum.GAME_ENTITY_CREATE,
    EventEnum.GAME_ENTITY_DESTROY
  ];
  /**
   * Contains all colShape keys
   *
   * @type {string[]}
   * @protected
   */
  protected colShapeEvents: string[] = [
    EventEnum.ENTITY_ENTER_COLSHAPE,
    EventEnum.ENTITY_LEAVE_COLSHAPE
  ];
  /**
   * Contains all base event keys
   *
   * @type {string[]}
   * @private
   */
  private baseEvents: string[] = [
    EventEnum.ON,
    EventEnum.ONCE,
    EventEnum.ON_CLIENT,
    EventEnum.ONCE_CLIENT,
    EventEnum.ON_SERVER,
    EventEnum.ONCE_SERVER,
    EventEnum.ON_GUI
  ];

  constructor(
      private readonly commandService: CommandService
  ) {}

  /**
   * Emit event server/client
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]): void {
    UtilsService.eventEmit(eventName, ...args);
  }

  /**
   * Unsubscribe from server/client event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public off(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOff(eventName, listener);
  }

  /**
   * Receive event from server/client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public on(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOn(eventName, listener);
  }

  /**
   * Receive once event from server/client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public once(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOnce(eventName, listener);
  }

  /**
   * Load up the event service with all needed parts
   *
   * @param {Function} done
   */
  public loadEvents(done: CallableFunction): void {
    this.startEventListeners();
    done();
  }

  /**
   * Start needed event listeners
   *
   * @protected
   */
  protected startEventListeners(): void {
    UtilsService.nextTick(() => {
      this.resolveAndLoadEvents(
          this.baseEvents,
          'BaseEvents',
          this.startBaseMethod.bind(this)
      );
    });

    UtilsService.nextTick(() =>
        this.resolveAndLoadEvents(
            this.entityChangeEvents,
            'EntityChangeEvents',
            this.startMetaChangeEvents.bind(this)
        )
    );

    UtilsService.nextTick(() =>
        this.resolveAndLoadEvents(
            [EventEnum.CONSOLE_COMMAND],
            'ConsoleCommandEvents',
            this.startConsoleCommandEvents.bind(this)
        )
    );
  }

  /**
   * Handle all meta change events
   * @param {EventModel[]} events
   * @param {Entity} entity
   * @param {string} key
   * @param {any} value
   * @param {any} oldValue
   * @protected
   */
  protected handleMetaChangeEvents<T extends { type: number }>(events: EventModel[], entity: T, key?: string, value?: any, oldValue?: any) {
    events.forEach((event: EventModel) => {

      // stop if not same type
      if (!this.isEntityType(entity.type, event.validateOptions.entity)) return;

      const hasMetaKey = event.validateOptions.metaKey !== undefined && key === event.validateOptions.metaKey;
      const instances = container.resolveAll<constructor<any>>(event.targetName);

      const args = [key, value, oldValue];

      if (hasMetaKey) {
        args.shift();
      }

      instances.forEach(async (instance: constructor<any>) => {
        const instanceMethod = instance[event.methodName];
        if (!instanceMethod) return;

        const method = instanceMethod.bind(instance);

        await method(entity, ...args);
      });
    });
  }

  /**
   * Check if given entity has given type
   *
   * @param {number} entityType
   * @param {string} type
   * @protected
   */
  protected isEntityType(entityType: number, type: number): boolean {
    return entityType === type;
  }

  /**
   * Resolve and load events
   *
   * @param {string[]} keys
   * @param {string} eventCategoryName
   * @param {Function} callback
   * @protected
   */
  protected resolveAndLoadEvents(keys: string[], eventCategoryName: string, callback: CallableFunction): void {
    let loaded = false;

    keys.forEach((key: string) => {
      const events = getAtlasMetaData<EventModel[]>(key, this);

      if (!events.length) return;

      callback(events);

      UtilsService.logRegisteredHandlers(events[0].type, events.length);
      loaded = true;
    });

    if (loaded) {
      UtilsService.logLoaded(eventCategoryName);
    }
  }

  /**
   * Start all base methods
   *
   * @param {EventModel[]} events
   * @private
   */
  private startBaseMethod(events: EventModel[]): void {
    events.forEach((event: EventModel) => {
      const instances = container.resolveAll<constructor<any>>(event.targetName);
      const internalMethod = this[event.type];

      if (!internalMethod) return;

      instances.forEach(async (instance: constructor<any>) => {
        if (!instance[event.methodName]) return;

        const instanceMethod = instance[event.methodName].bind(instance);
        const method = internalMethod.bind(this, event.eventName, instanceMethod);

        await method();
      });
    });
  }

  /**
   * Start the meta change event listener
   *
   * @param {EventModel[]} events
   * @private
   */
  private startMetaChangeEvents<T extends { type: number }>(events: EventModel[]): void {
    const eventType = events[0].type;

    this.on(eventType, (entity: T, key?: string, value?: any, oldValue?: any) => {
      this.handleMetaChangeEvents(events, entity, key, value, oldValue);
    });
  }

  /**
   * Handle all consoleCommands
   *
   * @param {EventModel[]} events
   * @private
   */
  private startConsoleCommandEvents(events: EventModel[]): void {
    this.commandService.setupCommands(events);

    this.on(
        'consoleCommand',
        this.commandService.run.bind(this.commandService)
    );
  }
}
