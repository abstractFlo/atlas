import { Vector3 } from 'alt-server';
import { DiscordUserModel } from '../../modules';

export interface PlayerInterface {

  /**
   * Contains the discord token for authentication
   *
   */
  discordToken: string;

  /**
   * Contains the discord user model
   */
  discord: DiscordUserModel;

  /**
   * Contains the player login state
   */
  pendingLogin: boolean;


  /**
   * Contains if player hasModel
   */
  hasModel: boolean;

  /**
   * Return the token for discord authentication
   */
  tokenData: string;


  /**
   * Set position with model safely
   *
   * @param {Vector3} position
   * @param {string} model
   */
  setSafePos(position: Vector3, model?: string): void;

  /**
   * Set realtime for player
   *
   * @param {Date} date
   */
  setRealtime(date: Date): void;

  /**
   * Emit event directly to current player
   *
   * @param {string} eventName
   * @param args
   */
  emit(eventName: string, ...args: any[]): void;

  /**
   * Emit event directly to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  emitGui(eventName: string, ...args: any[]): void;

  /**
   * Emit event on nextTick to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  emitGuiNextTick(eventName: string, ...args: any[]): void;
}


