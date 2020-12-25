import { Vector3 } from 'alt-server';

export interface PlayerInterface {

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
   */
  setRealtime(): void;

  /**
   * Emit event directly to current player
   *
   * @param {string} eventName
   * @param args
   */
  emit(eventName: string, ...args: any[]): void;
}


