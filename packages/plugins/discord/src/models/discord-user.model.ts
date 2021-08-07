import { Cast, JsonEntityModel } from '@abstractflo/atlas-shared';

export class DiscordUserModel extends JsonEntityModel {

  @Cast()
  id: string;

  @Cast()
  username: string;

  @Cast()
  avatar: string;

  @Cast()
  discriminator: string;

  @Cast()
  public_flags: number;

  @Cast()
  flags: number;

  @Cast()
  locale: string;

  @Cast()
  mfa_enabled: boolean;

  @Cast()
  avatarUrl: string = '/images/128.jpg';

}
