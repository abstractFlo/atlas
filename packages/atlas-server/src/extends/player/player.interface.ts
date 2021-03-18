/**
 * Extend Player with more methods and properties
 */
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

  /**
   * Route webview for player
   *
   * @param {string} routeName
   * @param args
   */
  guiRouteTo(routeName: string, ...args: any[]): void;

  /**
   * Show gui cursor for player
   */
  guiShowCursor(): void;

  /**
   * Remove cursor for player
   */
  guiRemoveCursor(): void;

  /**
   * Remove all cursors for player
   */
  guiRemoveAllCursors(): void;

  /**
   * Focus gui for player
   */
  guiFocus(): void;

  /**
   * Unfocus gui for player
   */
  guiUnfocus(): void;
}


