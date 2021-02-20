import { BaseEventService, EntityHandleModel, FrameworkEvent, StringResolver } from '@abstractflo/atlas-shared';
import { container, singleton } from 'tsyringe';
import { Colshape, emitClient, Entity, offClient, onceClient, onClient, Player } from 'alt-server';

@StringResolver
@singleton()
export class EventService extends BaseEventService {

  /**
   * Emit event to client
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
   * Listen handlers for given type
   *
   * @param {string} type
   * @param {EntityHandleModel[]} handlers
   * @protected
   */
  protected listenHandlerForType(type: string, handlers: EntityHandleModel[]) {
    this.on(type, (...args: any[]) => {
      const entity = args.shift();

      switch (true) {
        case ['syncedMetaChange', 'streamSyncedMetaChange'].includes(type):
          this.handleMetaChangeMethods<Entity>(entity, entity.type, handlers, true, ...args);
          break;

        case ['entityEnterColshape', 'entityLeaveColshape'].includes(type):
          this.handleColShapeMethods(entity, handlers, args.shift(), ...args);
          break;
      }
    });
  }

  /**
   * Handle all colShape events
   *
   * @param {Colshape} colShape
   * @param {EntityHandleModel[]} handlers
   * @param entity
   * @param args
   * @protected
   */
  protected handleColShapeMethods(colShape: Colshape, handlers: EntityHandleModel[], entity: Entity, ...args: any[]): void {
    handlers.forEach((handler: EntityHandleModel) => {

      // Stop if not the same colshape type
      const hasSameType = colShape.colshapeType === handler.options.colShapeType;
      if (!hasSameType) return;

      // Stop if name is set and not the same
      const hasSameName = handler.options.name !== undefined && colShape.name === handler.options.name;
      if (!hasSameName) return;

      // Stop if entity is set and not the same
      const hasSameEntity =
          handler.options.entity !== undefined && this.isEntityType(entity.type, handler.options.entity);

      if (!hasSameEntity) return;

      const instances = container.resolveAll<any>(handler.targetName);

      instances.forEach((instance) => {
        const method: CallableFunction = instance[handler.methodName].bind(instance);

        method(entity, ...args);
      });

    });
  }

}
