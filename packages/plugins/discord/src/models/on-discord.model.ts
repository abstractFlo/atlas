import { Cast, JsonEntityModel } from '@abstractflo/atlas-shared';

export class OnDiscordModel extends JsonEntityModel {

  @Cast()
  public eventName: string;

  @Cast()
  public methodName: string;

  @Cast()
  public targetName: string;

}
