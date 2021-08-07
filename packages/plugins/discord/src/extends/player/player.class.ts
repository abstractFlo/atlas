import { Player } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { DiscordUserModel } from '../../models/discord-user.model';

export class PlayerClass extends Player implements PlayerInterface {

  /**
   * The discord token for auth
   */
  discordToken: string;

  /**
   * Contains if the user wait for login
   */
  pendingLogin: boolean = false;
  /**
   * The discord user
   */
  discordUser: DiscordUserModel;

  /**
   * Token Data for auth
   */
  get tokenData(): string {
    const tokenData = [this.ip, this.hwidHash, this.hwidExHash];
    return JSON.stringify(`${tokenData.join('')}`);
  }

}
