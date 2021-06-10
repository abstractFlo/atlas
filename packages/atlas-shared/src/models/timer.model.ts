import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';

export class TimerModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  public identifier: string;

  @Cast({ from: castToString() })
  public type: 'nextTick' | 'everyTick' | 'interval' | 'timeout';

  @Cast({ from: castToString() })
  public methodName: string;

  @Cast({ from: castToString() })
  public targetName: string;

  @Cast({ from: castToNumber() })
  public duration: number | null = null;
}
