import { Cast, castToString, JsonEntityModel } from '../../core';

export class DiscordEventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  eventName: string;

  @Cast({ from: castToString() })
  targetName: string;

  @Cast({ from: castToString() })
  methodName: string;

}
