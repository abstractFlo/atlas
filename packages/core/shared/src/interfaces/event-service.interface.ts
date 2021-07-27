export interface EventServiceInterface {

  /**
   * Receive event from client/server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   * @param {boolean} resetable
   */
  on(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  on(name: string, listener: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Receive event from client
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onClient?(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  onClient?(name: string, listener: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Receive event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onServer?(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  onServer?(name: string, listener: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Receive event once time from client/server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  once(name: string, listener: (...args: any[]) => void): void;

  /**
   * Receive event once time from client
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onceClient?(name: string, listener: (...args: any[]) => void): void;

  /**
   * Receive event once time from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onceServer?(name: string, listener: (...args: any[]) => void): void;

  /**
   * Unsubscribe event from client/server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  off?(name: string, listener: (...args: any[]) => void): void;

  off?(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  off?(name: string, listener?: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Unsubscribe event from client
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  offClient?(name: string, listener: (...args: any[]) => void): void;

  offClient?(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  offClient?(name: string, listener?: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Unsubscribe event from server
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  offServer?(name: string, listener: (...args: any[]) => void): void;

  offServer?(name: string, listener: (...args: any[]) => void, resetable: boolean): void;

  offServer?(name: string, listener?: (...args: any[]) => void, resetable?: boolean): void;

  /**
   * Emit event client/server
   * @param {string} name
   * @param args
   */
  emit(name: string, ...args: any[]): void;

  /**
   * Emit event to server
   *
   * @param {string} name
   * @param args
   */
  emitServer?(name: string, ...args: any[]): void;
}
