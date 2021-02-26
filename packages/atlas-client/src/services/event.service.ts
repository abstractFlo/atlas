import { Autoload, AutoloaderConstants, BaseEventService, FrameworkEvent } from '@abstractflo/atlas-shared';
import { singleton } from 'tsyringe';
import { emit, emitServer, offServer, onceServer, onServer } from 'alt-client';

@Autoload(AutoloaderConstants.AFTER_BOOT, { methodName: 'load' })
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
}
