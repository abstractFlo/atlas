import { Cast, castToString, JsonEntityModel } from '@abstractFlo/shared';

export class WebviewEventModel extends JsonEntityModel {

  @Cast({ from: castToString() })
  eventName: string;

  @Cast({ from: castToString() })
  targetName: string;

  @Cast({ from: castToString() })
  methodName: string;

}
