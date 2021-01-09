import { Player } from 'alt-client';
import { PlayerInterface } from './player.interface';
import { DiscordUserModel } from '@abstractFlo/shared';

export class PlayerClass extends Player implements PlayerInterface {
  /**
   * Contains the discord user model
   */
  discord: DiscordUserModel = new DiscordUserModel();
}
