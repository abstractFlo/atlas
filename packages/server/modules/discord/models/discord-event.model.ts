import { Cast, castToString, JsonEntityModel } from '@abstractFlo/shared';

export class DiscordEventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  eventName: string;

  @Cast({ from: castToString() })
  targetName: string;

  @Cast({ from: castToString() })
  methodName: string;

}
