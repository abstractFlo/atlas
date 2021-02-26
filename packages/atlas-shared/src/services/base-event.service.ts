import { container } from 'tsyringe';
import { EventModel } from '../models';
import { EventConstants } from '../constants';
import { constructor } from '../types';
import { EventServiceInterface } from '../interfaces';
import { UtilsService } from './utils.service';

export abstract class BaseEventService implements EventServiceInterface {

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
   * Contains all meta change keys
   *
   * @type {string[]}
   * @private
   */
  private metaChangeEvents: string[] = [
    EventConstants.STREAM_SYNCED_META_CHANGE,
    EventConstants.SYNCED_META_CHANGE
  ];

  /**
   * Contains all colShape keys
   *
   * @type {string[]}
   * @private
   */
  private colShapeEvents: string[] = [
    EventConstants.ENTITY_ENTER_COLSHAPE,
    EventConstants.ENTITY_LEAVE_COLSHAPE
  ];

  /**
   * Contains all game entity keys
   *
   * @type {string[]}
   * @private
   */
  private gameEntityEvents: string[] = [
    EventConstants.GAME_ENTITY_CREATE,
    EventConstants.GAME_ENTITY_DESTROY
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
   * Load up all events
   *
   * @param {Function} done
   */
  public load(done: CallableFunction): void {
    this.loadBaseEvents();

    done();
  }

  /**
   * Load and start all base evens
   *
   * @private
   */
  private loadBaseEvents(): void {
    let loaded = false;
    this.baseEvents.forEach((key: string) => {
      const events = this.getMetaData(key);

      if (!events.length) return;

      this.startBaseMethod(events);
      loaded = true;
    });

    if (loaded) {
      UtilsService.logLoaded('BaseEvents');
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
   * Return all event models for given key
   *
   * @param {string} key
   * @return {EventModel[]}
   * @private
   */
  private getMetaData(key: string): EventModel[] {
    return Reflect.getMetadata(key, this) || [];
  }
}
