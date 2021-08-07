import { Cast, JsonEntityModel } from '@abstractflo/atlas-shared';

export class AccessTokenModel extends JsonEntityModel {

  @Cast()
  access_token: string;

  @Cast()
  token_type: string;

  @Cast()
  expires_in: number;

  @Cast()
  refresh_token: string;

  @Cast()
  scope: string;
}
