import { Cast, castToNumber, castToString, JsonEntityModel } from '../../core';

export class AccessTokenModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  access_token: string;

  @Cast({ from: castToString() })
  token_type: string;

  @Cast({ from: castToNumber() })
  expires_in: number;

  @Cast({ from: castToString() })
  refresh_token: string;

  @Cast({ from: castToString() })
  scope: string;

}
