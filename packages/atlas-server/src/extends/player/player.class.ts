import { DateTimeDay, DateTimeHour, DateTimeMinute, DateTimeMonth, DateTimeSecond, Player } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { container } from 'tsyringe';
import { FrameworkEvent, UtilsService } from '@abstractflo/atlas-shared';
import { EventService } from '../../services/event.service';

/**
 * Extend Player with more methods and properties
 */
export class PlayerClass extends Player implements PlayerInterface {

  /**
   * Emit event directly to current player
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]) {
    const eventService = container.resolve(EventService);
    eventService.emitClient(this, eventName, ...args);
  }

  /**
   * Emit event directly to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  public emitGui(eventName: string, ...args: any[]): void {
    const eventService = container.resolve(EventService);
    eventService.emitGui(this, eventName, ...args);
  }

  /**
   * Emit event on nextTick to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  public emitGuiNextTick(eventName: string, ...args: any[]): void {
    UtilsService.setTimeout(() => this.emitGui(eventName, ...args), 25);
  }

  /**
   * Route webview for player
   *
   * @param {string} routeName
   * @param args
   */
  public guiRouteTo(routeName: string, ...args: any[]): void {
    this.emit(FrameworkEvent.EventService.GuiChangeRoute, routeName, ...args);
  }

  /**
   * Show gui cursor for player
   */
  public guiShowCursor(): void {
    this.emit(FrameworkEvent.EventService.GuiShowCursor);
  }

  /**
   * Remove cursor for player
   */
  public guiRemoveCursor(): void {
    this.emit(FrameworkEvent.EventService.GuiRemoveCursor);
  }

  /**
   * Remove all cursors for player
   */
  public guiRemoveAllCursors(): void {
    this.emit(FrameworkEvent.EventService.GuiRemoveAllCursors);
  }

  /**
   * Focus gui for player
   */
  public guiFocus(): void {
    this.emit(FrameworkEvent.EventService.GuiFocus);
  }

  /**
   * Unfocus gui for player
   */
  public guiUnfocus(): void {
    this.emit(FrameworkEvent.EventService.GuiUnfocus);
  }

  /**
   * Set realtime for player
   *
   * @param {Date} date
   */
  public setRealTime(date: Date): void {

    this.setDateTime(
        date.getDate() as DateTimeDay,
        date.getMonth() as DateTimeMonth,
        date.getFullYear(),
        date.getHours() as DateTimeHour,
        date.getMinutes() as DateTimeMinute,
        date.getSeconds() as DateTimeSecond
    );

    this.emit(FrameworkEvent.Player.SetRealTime, 60000);
  }

}
