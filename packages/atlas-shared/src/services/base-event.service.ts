import { container } from 'tsyringe';
import { EventModel } from '../models';
import { EventConstants } from '../constants';
import { constructor } from '../types';
import { EventServiceInterface } from '../interfaces';
import { UtilsService } from './utils.service';

export abstract class BaseEventService implements EventServiceInterface {

  /**
   * Contains all meta change keys
   *
   * @type {string[]}
   * @protected
   */
  protected metaChangeEvents: string[] = [
    EventConstants.STREAM_SYNCED_META_CHANGE,
    EventConstants.SYNCED_META_CHANGE
  ];
  /**
   * Contains all colShape keys
   *
   * @type {string[]}
   * @protected
   */
  protected colShapeEvents: string[] = [
    EventConstants.ENTITY_ENTER_COLSHAPE,
    EventConstants.ENTITY_LEAVE_COLSHAPE
  ];
  /**
   * Contains all game entity keys
   *
   * @type {string[]}
   * @protected
   */
  protected gameEntityEvents: string[] = [
    EventConstants.GAME_ENTITY_CREATE,
    EventConstants.GAME_ENTITY_DESTROY
  ];
  /**
   * Contains all base event keys
   *
   * @type {string[]}
   * @private
   */
  private baseEvents: string[] = [
    EventConstants.ON,
    EventConstants.ONCE,
    EventConstants.ON_CLIENT,
    EventConstants.ONCE_CLIENT,
    EventConstants.ON_SERVER,
    EventConstants.ONCE_SERVER,
    EventConstants.ON_GUI
  ];

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
   * Return all event models for given key
   *
   * @param {string} key
   * @return {EventModel[]}
   * @private
   */
  protected getMetaData(key: string): EventModel[] {
    return Reflect.getMetadata(key, this) || [];
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
  protected handleMetaChangeEvents<T extends { type: number }>(events: EventModel[], entity: T, key: string, value: any, oldValue: any) {
    events.forEach((event: EventModel) => {

      // stop if not the same type
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
   * Load and start all base evens
   *
   * @private
   */
  protected loadBaseEvents(done: CallableFunction): void {
    let loaded = false;
    this.baseEvents.forEach((key: string) => {
      const events = this.getMetaData(key);

      if (!events.length) return;

      this.startBaseMethod(events);

      UtilsService.logRegisteredHandlers(events[0].type, events.length);
      loaded = true;
    });

    if (loaded) {
      UtilsService.logLoaded('BaseEvents');
    }

    done();
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
}
