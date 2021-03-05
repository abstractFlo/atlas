import { Cast, castToString, JsonEntityModel } from '@abstractflo/atlas-shared';

export class DiscordConfigModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  client_id: string;

  @Cast({ from: castToString() })
  client_secret: string;

  @Cast({ from: castToString() })
  bot_secret: string;

  @Cast({ from: castToString() })
  server_id: string;

  @Cast({ from: castToString() })
  redirect_url: string;

  @Cast({ from: castToString() })
  auth_url: string;

  @Cast({ from: castToString() })
  auth_token_url: string;

  @Cast({ from: castToString() })
  user_me_url: string;

  @Cast()
  presences: Object;

}
