import { emit, emitServer, Entity, offServer, onceServer, onServer } from 'alt-client';
import { BaseEventService, EntityHandleModel, FrameworkEvent, StringResolver } from '@abstractflo/shared';
import { singleton } from 'tsyringe';

@StringResolver
@singleton()
export class EventService extends BaseEventService {

  /**
   * Emit event to server
   *
   * @param {string} name
   * @param args
   */
  public emitServer(name: string, ...args: any[]): void {
    emitServer(name, ...args);
  }

  /**
   * Unsubscribe from server event
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public offServer(name: string, listener: (...args: any[]) => void): void {
    offServer(name, listener);
  }

  /**
   * Receive event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onServer(name: string, listener: (...args: any[]) => void): void {
    onServer(name, listener);
  }

  /**
   * Receive once event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onceServer(name: string, listener: (...args: any[]) => void): void {
    onceServer(name, listener);
  }

  /**
   * Receive gui event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onGui(eventName: string, listener: (...args: any[]) => void): void {
    emit(FrameworkEvent.EventService.GuiOn, eventName, listener);
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
        case ['syncedMetaChange', 'streamSyncedMetaChange', 'gameEntityCreate', 'gameEntityDestroy'].includes(type):
          this.handleMetaChangeMethods<Entity>(entity, entity.type, handlers, ...args);
          break;
      }
    });
  }

}
