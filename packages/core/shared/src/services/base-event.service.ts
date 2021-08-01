import { EventServiceInterface } from '../interfaces/event-service.interface';
import { EventModel } from '../models/event.model';
import { CommandService } from './command.service';
import { UtilsService } from './utils.service';
import { constructor } from '../interfaces/constructor.interface';
import { getFrameworkMetaData } from '../decorators/helpers';
import { Internal } from '../internal';
import { app } from '../di-container';
import { Singleton } from '../decorators/framework-di.decorator';

@Singleton
export class BaseEventService implements EventServiceInterface {
  /**
   * Contains all events where first param is an entity
   *
   * @type {string[]}
   * @protected
   */
  protected entityChangeEvents: string[] = [
    Internal.Events_Stream_Synced_Meta_Change,
    Internal.Events_Synced_Meta_Change,
    Internal.Events_Game_Entity_Create,
    Internal.Events_Game_Entity_Destroy
  ];

  /**
   * Contains all colShape keys
   *
   * @type {string[]}
   * @protected
   */
  protected colShapeEvents: string[] = [Internal.Events_Entity_Enter_Col_Shape, Internal.Events_Entity_Leave_Col_Shape];

  /**
   * Contains the off event methods
   *
   * @type {Map<string, any>}
   * @private
   */
  protected offEventsMap: Map<string, CallableFunction[]> = new Map<string, CallableFunction[]>();

  /**
   * Contains all base event keys
   *
   * @type {string[]}
   * @private
   */
  private baseEvents: string[] = [
    Internal.Events_On,
    Internal.Events_Once,
    Internal.Events_On_Client,
    Internal.Events_Once_Client,
    Internal.Events_On_Server,
    Internal.Events_Once_Server
  ];
  /**
   * Contains the off event keys
   * @type {string[]}
   * @private
   */
  private offEvents: string[] = [
    Internal.Events_Off,
    Internal.Events_OffServer,
    Internal.Events_OffClient
  ];

  constructor(protected readonly commandService: CommandService) {}

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
   * Off Event Implementation
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public off(eventName: string): void;
  public off(eventName: string, listener: (...args: any[]) => void): void;
  public off(eventName: string, listener?: (...args: any[]) => void): void {
    listener
        ? UtilsService.eventOff(eventName, listener)
        : this.processOffEvent(eventName, this.offEventsMap);
  }

  /**
   * Receive event from server/client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   * @param {boolean} resetable
   */
  public on(eventName: string, listener: (...args: any[]) => void, resetable: boolean): void;
  public on(eventName: string, listener: (...args: any[]) => void): void;
  public on(eventName: string, listener: (...args: any[]) => void, resetable?: boolean): void {
    UtilsService.eventOn(eventName, listener);

    if (resetable) {
      this.registerAnonymusOffEvents(this.off, eventName, listener);
    }
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
   * Resolve and load events
   *
   * @param {string[]} keys
   * @param {string} eventCategoryName
   * @param {Function} callback
   * @protected
   */
  public resolveAndLoadEvents(keys: string[], eventCategoryName: string, callback: CallableFunction): Promise<void> {
    let loaded = false;
    let internalNumber = 0;

    return new Promise((resolve, reject) => {
      try {
        if (keys.length === 0) resolve();

        keys.forEach((key: string, index: number) => {
          const events = getFrameworkMetaData<EventModel[]>(key, app.resolve(BaseEventService));
          internalNumber = index;

          if (!events.length) return;

          callback(events);

          UtilsService.logRegisteredHandlers(events[0].type, events.length);
          loaded = true;

        });

        if (loaded) {
          UtilsService.logLoaded(eventCategoryName);
        }

        if (internalNumber + 1 === keys.length) resolve();


      } catch (e) {
        UtilsService.logError('Something went wrong', e);
        reject();
      }
    });
  }

  /**
   * Start needed event listeners
   *
   * @return {Promise<void>}
   * @protected
   */
  protected async startEventListeners(): Promise<void> {
    await this.resolveAndLoadEvents(this.baseEvents, 'BaseEvents', this.startBaseMethod.bind(this));
    await this.resolveAndLoadEvents(this.offEvents, 'OffEvents', this.registerOffEvents.bind(this));

    await this.resolveAndLoadEvents(
        this.entityChangeEvents,
        'EntityChangeEvents',
        this.startMetaChangeEvents.bind(this)
    );

    await this.resolveAndLoadEvents(
        [Internal.Events_Console_Command],
        'ConsoleCommandEvents',
        this.startConsoleCommandEvents.bind(this)
    );
  }

  /**
   * Handle all meta change events
   *
   * @param {EventModel[]} events
   * @param {Entity} entity
   * @param {string} key
   * @param {any} value
   * @param {any} oldValue
   * @protected
   */
  protected handleMetaChangeEvents<T extends { type: number }>(
      events: EventModel[],
      entity: T,
      key?: string,
      value?: any,
      oldValue?: any
  ) {
    events.forEach((event: EventModel) => {
      // stop if not same type
      if (!this.isEntityType(entity.type, event.validateOptions.entity)) return;

      const hasMetaKey = event.validateOptions.metaKey !== undefined && key === event.validateOptions.metaKey;
      const instances = app.resolveAll<constructor<any>>(event.targetName);
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
   * Register anonymus methods for off events
   *
   * @param {string} eventName
   * @param {Function} internalMethod
   * @param {(...args: any[]) => void} listener
   * @protected
   */
  protected registerAnonymusOffEvents(internalMethod: Function, eventName: string, listener: (...args: any[]) => void): void {
    const alreadyRegisteredMethods = this.offEventsMap.get(eventName) || [];
    const method = internalMethod.bind(this, eventName, listener);
    alreadyRegisteredMethods.push(method);
    this.offEventsMap.set(eventName, alreadyRegisteredMethods);
  }

  /**
   * Process the offEvent handler
   *
   * @param {string} eventName
   * @param offEventsMap
   * @private
   */
  protected processOffEvent(eventName: string, offEventsMap: Map<string, CallableFunction[]>): void {
    const methods = offEventsMap.get(eventName) || [];

    if (!methods.length) return;

    methods.forEach(async (method: CallableFunction) => {
      await method();
    });
  }

  /**
   * Start all base methods
   *
   * @param {EventModel[]} events
   * @private
   */
  private startBaseMethod(events: EventModel[]): void {
    events.forEach((event: EventModel) => {
      const instances = app.resolveAll<constructor<any>>(event.targetName);
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
   * Register methods as off events reference
   *
   * @param {EventModel[]} events
   * @private
   */
  private registerOffEvents(events: EventModel[]): void {
    events.forEach((event: EventModel) => {
      const instances = app.resolveAll<constructor<any>>(event.targetName);
      const internalMethod = this[event.type];
      const alreadyRegisteredMethods = this.offEventsMap.get(event.eventName) || [];

      if (!internalMethod) return;

      instances.forEach(async (instance: constructor<any>) => {
        if (!instance[event.methodName]) return;

        const instanceMethod = instance[event.methodName].bind(instance);
        const method = internalMethod.bind(this, event.eventName, instanceMethod);
        alreadyRegisteredMethods.push(method);
        this.offEventsMap.set(event.eventName, alreadyRegisteredMethods);
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

    this.on('consoleCommand', this.commandService.run.bind(this.commandService));
  }
}
