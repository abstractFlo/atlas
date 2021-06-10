import { Cast, castToNumber, castToString, JsonEntityModel } from '@abstractflo/atlas-shared';

export class AccessTokenModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public access_token: string;

  @Cast({ from: castToString() })
  public token_type: string;

  @Cast({ from: castToNumber() })
  public expires_in: number;

  @Cast({ from: castToString() })
  public refresh_token: string;

  @Cast({ from: castToString() })
  public scope: string;
}
