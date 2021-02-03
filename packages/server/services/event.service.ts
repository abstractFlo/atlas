import { BaseEventService, EntityHandleModel, FrameworkEvent, StringResolver } from '@abstractFlo/shared';
import { singleton } from 'tsyringe';
import { emitClient, Entity, offClient, onceClient, onClient, Player } from 'alt-server';

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
    this.on(type, (entity: Entity, ...args: any[]) => {
      this.handleMethods<Entity>(entity, handlers, ...args);
    });
  }

  /**
   * Check entity type
   *
   * @param {Entity} entity
   * @param {number} type
   * @return {boolean}
   * @protected
   */
  protected isEntityType(entity: Entity, type: number): boolean {
    return entity.type === type;
  }
}
