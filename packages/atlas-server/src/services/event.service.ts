import {
  Autoload,
  AutoloaderConstants,
  BaseEventService,
  FrameworkEvent,
  StringResolver
} from '@abstractflo/atlas-shared';
import { singleton } from 'tsyringe';
import { emitClient, offClient, onceClient, onClient, Player } from 'alt-server';

@Autoload(AutoloaderConstants.AFTER_BOOT, { methodName: 'load' })
@StringResolver
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
}
