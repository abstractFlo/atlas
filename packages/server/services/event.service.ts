import { BaseEventService, UtilsService } from '@abstractFlo/shared';
import { singleton } from 'tsyringe';
import * as alt from 'alt-server';
import { Player } from 'alt-server';

@singleton()
export class EventService extends BaseEventService {

  /**
   * Emit event to client
   *
   * @param {alt.Player | null} player
   * @param {string} eventName
   * @param args
   */
  public emitClient(player: alt.Player | null, eventName: string, ...args: any[]): void {
    alt.emitClient(player, eventName, ...args);
  }

  /**
   * Unsubscribe from client event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public offClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.offClient(eventName, listener);
  }

  /**
   * Receive event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.onClient(eventName, listener);
  }


  /**
   * Receive once event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onceClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.onceClient(eventName, listener);
  }

  /**
   * Receive gui event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onGui(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.logError('TODO Fix ServerSide OnGUI');
  }

  /**
   * Return all available listener types for decorators
   *
   * @returns {string[]}
   * @private
   */
  public getAvailableDecoratorListenerTypes(): string[] {
    return ['onClient', 'onceClient'];
  }

}
