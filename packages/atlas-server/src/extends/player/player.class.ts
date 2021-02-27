import { DateTimeDay, DateTimeHour, DateTimeMinute, DateTimeMonth, DateTimeSecond, Player } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { container } from 'tsyringe';
import { EventService } from '../../services';
import { FrameworkEvent, UtilsService } from '@abstractflo/atlas-shared';

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
  emitGui(eventName: string, ...args: any[]): void {
    const eventService = container.resolve(EventService);
    eventService.emitGui(this, eventName, ...args);
  }

  /**
   * Emit event on nextTick to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  emitGuiNextTick(eventName: string, ...args: any[]): void {
    UtilsService.setTimeout(() => this.emitGui(eventName, args), 25);
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
