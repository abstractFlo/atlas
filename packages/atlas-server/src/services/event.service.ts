import {
  Autoload,
  AutoloaderConstants,
  BaseEventService,
  constructor,
  EventModel,
  FrameworkEvent,
  UtilsService
} from '@abstractflo/atlas-shared';
import { container, singleton } from 'tsyringe';
import { Colshape, emitClient, Entity, offClient, onceClient, onClient, Player } from 'alt-server';

@Autoload(AutoloaderConstants.AFTER_BOOT, { methodName: 'loadBaseEvents' })
@Autoload(AutoloaderConstants.AFTER_BOOT, { methodName: 'loadMetaChangeEvents' })
@Autoload(AutoloaderConstants.AFTER_BOOT, { methodName: 'loadColShapeEvents' })
@singleton()
export class EventService extends BaseEventService {

  /**
   * Emit event to one or all players
   *
   * @param {Player | null} player
   * @param {string} eventName
   * @param args
   */
  public emitClient(player: Player | null, eventName: string, ...args: any[]): void {
    emitClient(player, eventName, ...args);
  }

  /**
   * Emit event to gui use client as bridge
   *
   * @param {Player | null} player
   * @param {string} eventName
   * @param args
   */
  public emitGui(player: Player | null, eventName: string, ...args: any[]): void {
    emitClient(player, FrameworkEvent.EventService.ServerEmitGui, eventName, ...args);
  }

  /**
   * Unsubscribe from client event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public offClient(eventName: string, listener: (...args: any[]) => void): void {
    offClient(eventName, listener);
  }

  /**
   * Receive event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onClient(eventName: string, listener: (...args: any[]) => void): void {
    onClient(eventName, listener);
  }

  /**
   * Receive once event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onceClient(eventName: string, listener: (...args: any[]) => void): void {
    onceClient(eventName, listener);
  }

  /**
   * Load all metaChange events from reflection and start listen
   *
   * @param {Function} done
   * @protected
   */
  protected loadMetaChangeEvents(done: CallableFunction): void {
    let loaded = false;

    this.metaChangeEvents.forEach((key: string) => {
      const events = this.getMetaData(key);

      if (!events.length) return;
      this.startMetaChangeEvents(events);

      UtilsService.logRegisteredHandlers(events[0].type, events.length);

      loaded = true;
    });

    if (loaded) {
      UtilsService.logLoaded('MetaChangeEvents');
    }


    done();
  }

  /**
   * Load all colShape events from reflection an start listen
   *
   * @param {Function} done
   * @protected
   */
  protected loadColShapeEvents(done: CallableFunction): void {
    let loaded = false;

    this.colShapeEvents.forEach((key: string) => {
      const events = this.getMetaData(key);

      if (!events.length) return;

      this.startColShapeEvents(events);
      UtilsService.logRegisteredHandlers(events[0].type, events.length);

      loaded = true;
    });

    if (loaded) {
      UtilsService.logLoaded('ColShapeEvents');
    }

    done();
  }

  /**
   * Start the meta change event listener
   *
   * @param {EventModel[]} events
   * @private
   */
  private startMetaChangeEvents(events: EventModel[]): void {
    const eventType = events[0].type;

    this.on(eventType, (entity: Entity, key: string, value: any, oldValue: any) => {
      this.handleMetaChangeEvents(events, entity, key, value, oldValue);
    });
  }

  /**
   * Start the meta change event listener
   *
   * @param {EventModel[]} events
   * @private
   */
  private startColShapeEvents(events: EventModel[]): void {
    const eventType = events[0].type;

    this.on(eventType, (colShape: Colshape, entity: Entity) => {
      this.handleColShapeEvents(events, colShape, entity);
    });
  }

  /**
   * Handle all colShape events
   *
   * @param {EventModel[]} events
   * @param {Colshape} colShape
   * @param {Entity} entity
   * @private
   */
  private handleColShapeEvents(events: EventModel[], colShape: Colshape, entity: Entity): void {
    events.forEach((event: EventModel) => {
      // Stop if not the same type
      if (!(colShape.colshapeType === event.validateOptions.colShapeType)) return;

      // Stop if name is set and not the same
      if (!(event.validateOptions.name !== undefined && colShape.name === event.validateOptions.name)) return;

      // Stop if entity is set not the the same
      if (!(
          event.validateOptions.entity !== undefined &&
          this.isEntityType(entity.type, event.validateOptions.entity))
      ) return;

      const instances = container.resolveAll<constructor<any>>(event.targetName);

      instances.forEach(async (instance: constructor<any>) => {
        const instanceMethod = instance[event.methodName];
        if (!instanceMethod) return;

        const method = instanceMethod.bind(instance);
        await method(colShape, entity);
      });

    });
  }
}

