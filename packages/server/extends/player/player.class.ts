import { DateTimeDay, DateTimeHour, DateTimeMinute, DateTimeMonth, DateTimeSecond, Player, Vector3 } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { container } from 'tsyringe';
import { EventService } from '../../services';

export class PlayerClass extends Player implements PlayerInterface {

  /**
   * Contains if player hasModel
   *
   * @type {boolean}
   */
  hasModel: boolean;

  /**
   * Return the token for discord authentication
   *
   * @returns {string}
   */
  public get tokenData(): string {
    return JSON.stringify(`${this.ip}${this.hwidHash}${this.hwidExHash}`);
  }

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
   * Set realtime for player
   *
   * @param {Date} date
   */
  public setRealtime(date: Date): void {

    this.setDateTime(
        date.getDate() as DateTimeDay,
        date.getMonth() as DateTimeMonth,
        date.getFullYear(),
        date.getHours() as DateTimeHour,
        date.getMinutes() as DateTimeMinute,
        date.getSeconds() as DateTimeSecond
    );

    this.emit('player:set:ms:per:game:minute', 60000);
  }

  /**
   * Set position with model safely
   *
   * @param {Vector3} position
   * @param {string} model
   */
  public setSafePos(position: Vector3, model: string = 'mp_m_freemode_01'): void {
    if (!this.hasModel) {
      this.hasModel = true;
      this.pos = position;
      this.model = model;
    }

    this.pos = position;
  }


}
