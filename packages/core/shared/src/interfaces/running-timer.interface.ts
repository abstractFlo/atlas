export interface RunningTimerInterface {
	/**
	 * Type of timer
	 */
	type: 'everyTick' | 'nextTick' | 'interval' | 'timeout';

	/**
	 * Timer identifier
	 */
	identifier: number;
}
