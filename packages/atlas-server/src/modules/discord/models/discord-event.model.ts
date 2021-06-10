import { Cast, castToString, JsonEntityModel } from '@abstractflo/atlas-shared';

export class DiscordEventModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public eventName: string;

  @Cast({ from: castToString() })
  public targetName: string;

  @Cast({ from: castToString() })
  public methodName: string;
}
