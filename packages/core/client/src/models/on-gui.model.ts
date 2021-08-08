import { Cast, JsonEntityModel } from '@abstractflo/atlas-shared';

export class OnGuiModel extends JsonEntityModel {

  @Cast()
  eventName: string;

  @Cast()
  targetName: string;

  @Cast()
  methodName: string;

  @Cast()
  identifier: string;
}
