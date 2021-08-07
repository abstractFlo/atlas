import { DiscordUserModel } from '../../models/discord-user.model';

export interface PlayerInterface {

  /**
   * The discord token for auth
   */
  discordToken: string;

  /**
   * Contains if the user wait for login
   */
  pendingLogin: boolean;

  /**
   * Token Data for auth
   */
  tokenData: string;

  /**
   * The discord user
   */
  discordUser: DiscordUserModel;

}
