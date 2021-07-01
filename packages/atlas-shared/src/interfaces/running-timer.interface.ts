export interface RunningTimerInterface {
  type: 'everyTick' | 'nextTick' | 'interval' | 'timeout';
  identifier: number;
}
