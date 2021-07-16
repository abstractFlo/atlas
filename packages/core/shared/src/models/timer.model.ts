import { Cast, JsonEntityModel } from '../libs/json-entity';


export class TimerModel extends JsonEntityModel {
  @Cast()
  public identifier: string;

  @Cast()
  public type: 'nextTick' | 'everyTick' | 'interval' | 'timeout';

  @Cast()
  public methodName: string;

  @Cast()
  public targetName: string;

  @Cast()
  public duration: number | null = null;
}
