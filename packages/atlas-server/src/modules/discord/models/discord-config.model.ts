import { Cast, castToString, JsonEntityModel } from '@abstractflo/atlas-shared';

export class DiscordConfigModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public client_id: string;

  @Cast({ from: castToString() })
  public client_secret: string;

  @Cast({ from: castToString() })
  public bot_secret: string;

  @Cast({ from: castToString() })
  public server_id: string;

  @Cast({ from: castToString() })
  public redirect_url: string;

  @Cast({ from: castToString() })
  public auth_url: string;

  @Cast({ from: castToString() })
  public auth_token_url: string;

  @Cast({ from: castToString() })
  public user_me_url: string;

  @Cast()
  public presences: unknown;
}
