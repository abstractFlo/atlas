import { Cast, castToBoolean, castToNumber, castToString, JsonEntityModel } from '@abstractFlo/shared';

export class DiscordUserModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  id: string;

  @Cast({ from: castToString() })
  username: string;

  @Cast({ from: castToString() })
  avatar: string;

  @Cast({ from: castToString() })
  discriminator: string;

  @Cast({ from: castToNumber() })
  public_flags: number;

  @Cast({ from: castToNumber() })
  flags: number;

  @Cast({ from: castToString() })
  locale: string;

  @Cast({ from: castToBoolean() })
  mfa_enabled: boolean;

  @Cast({from: castToString()})
  avatarUrl: string = '/images/128.jpg';
}
