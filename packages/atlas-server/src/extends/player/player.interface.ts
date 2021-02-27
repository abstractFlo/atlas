export interface PlayerInterface {

  /**
   * Set realtime for player
   *
   * @param {Date} date
   */
  setRealTime(date: Date): void;

  /**
   * Emit event directly to current player
   *
   * @param {string} eventName
   * @param args
   */
  emit(eventName: string, ...args: any[]): void;

  /**
   * Emit event directly to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  emitGui(eventName: string, ...args: any[]): void;

  /**
   * Emit event on nextTick to current player gui
   *
   * @param {string} eventName
   * @param args
   */
  emitGuiNextTick(eventName: string, ...args: any[]): void;
}


