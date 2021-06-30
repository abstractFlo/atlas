import { Cast, castToNumber, castToString, JsonEntityModel } from '../libs/json-entity';

export class TimerModel extends JsonEntityModel {
  @Cast({ from: castToString() })
  identifier: string;

  @Cast({ from: castToString() })
  type: 'nextTick' | 'everyTick' | 'interval' | 'timeout';

  @Cast({ from: castToString() })
  methodName: string;

  @Cast({ from: castToString() })
  targetName: string;

  @Cast({ from: castToNumber() })
  duration: number | null = null;
}
