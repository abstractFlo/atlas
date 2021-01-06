import { BaseEventService } from '@abstractFlo/shared';
import { container, singleton } from 'tsyringe';
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
  public emitClient(player: Player | null, eventName: string, ...args: any[]): void {
    alt.emitClient(player, eventName, ...args);
  }

  /**
   * Emit event to gui use client as bridge
   * @param {Player | null} player
   * @param {string} eventName
   * @param args
   */
  public emitGui(player: Player | null, eventName: string, ...args: any[]): void {
    const serverEmitEventName = container.resolve<string>('eventservice:emit:gui:eventName');
    alt.emitClient(player, serverEmitEventName, eventName, ...args);
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
   * Return all available listener types for decorators
   *
   * @returns {string[]}
   * @private
   */
  public getAvailableDecoratorListenerTypes(): string[] {
    return ['onClient', 'onceClient'];
  }

}
