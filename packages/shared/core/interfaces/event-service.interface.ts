import { EventModel } from '../models';

export interface EventServiceInterface {

  /**
   * Contains all registered events
   */
  events: EventModel[];

  /**
   * Start listen events
   */
  start(): void;

  /**
   * Add event to events array
   *
   * @param {string} type
   * @param {string} eventName
   * @param {string} targetName
   * @param {string} methodName
   */
  add(type: string, eventName: string, targetName: string, methodName: string): void;

  /**
   * Receive event from client/server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  on(name: string, listener: (...args: any[]) => void): void;

  /**
   * Receive event from client
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onClient?(name: string, listener: (...args: any[]) => void): void;

  /**
   * Receive event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  onServer?(name: string, listener: (...args: any[]) => void): void;

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
  off(name: string, listener: (...args: any[]) => void): void;

  /**
   * Unsubscribe event from client
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  offClient?(name: string, listener: (...args: any[]) => void): void;

  /**
   * Unsubscribe event from server
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  offServer?(name: string, listener: (...args: any[]) => void): void;

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
