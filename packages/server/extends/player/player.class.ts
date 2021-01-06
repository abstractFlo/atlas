import { DateTimeDay, DateTimeHour, DateTimeMinute, DateTimeMonth, DateTimeSecond, Player, Vector3 } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { container } from 'tsyringe';
import { EventService } from '../../services';
import { DiscordUserModel } from '../../modules/discord/models';
import { UtilsService } from '@abstractFlo/shared';

export class PlayerClass extends Player implements PlayerInterface {

  /**
   * Contains if player hasModel
   *
   * @type {boolean}
   */
  hasModel: boolean;

  /**
   * Contains the discord token for authentication
   *
   */
  discordToken: string;

  /**
   * Contains the discord user model
   */
  discord: DiscordUserModel = new DiscordUserModel();

  /**
   * Contains the player login state
   */
  pendingLogin: boolean = false;

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
  public setRealtime(date: Date): void {

    this.setDateTime(
        date.getDate() as DateTimeDay,
        date.getMonth() as DateTimeMonth,
        date.getFullYear(),
        date.getHours() as DateTimeHour,
        date.getMinutes() as DateTimeMinute,
        date.getSeconds() as DateTimeSecond
    );

    const eventName = container.resolve<string>('alt.Player.setRealtime.eventName')

    this.emit(eventName, 60000);
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
