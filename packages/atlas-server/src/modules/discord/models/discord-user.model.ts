import { Cast, castToBoolean, castToNumber, castToString, JsonEntityModel } from '@abstractflo/atlas-shared';

export class DiscordUserModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public id: string;

  @Cast({ from: castToString() })
  public username: string;

  @Cast({ from: castToString() })
  public avatar: string;

  @Cast({ from: castToString() })
  public discriminator: string;

  @Cast({ from: castToNumber() })
  public public_flags: number;

  @Cast({ from: castToNumber() })
  public flags: number;

  @Cast({ from: castToString() })
  public locale: string;

  @Cast({ from: castToBoolean() })
  public mfa_enabled: boolean;

  @Cast({ from: castToString() })
  public avatarUrl = '/images/128.jpg';
}
