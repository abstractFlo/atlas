import { EventModel, EventServiceInterface } from '@abstractFlo/shared';
import { container, singleton } from 'tsyringe';
import * as alt from 'alt-server';

@singleton()
export class EventService implements EventServiceInterface {

  /**
   * Contains all events
   *
   * @type {EventModel[]}
   */
  public events: EventModel[] = [];

  /**
   * Contains all available listener types for decorators
   *
   * @type {string[]}
   * @private
   */
  private availableDecoratorListenerTypes: string[] = ['on', 'onClient', 'once', 'onceClient'];

  /**
   * Start event loop
   */
  public start(): void {
    this.events.forEach(async (event: EventModel) => {
      const instance = container.resolve<any>(event.targetName);
      // Need to be rewrite the typings
      //@ts-ignore
      const internalMethod = this[event.type];
      const method = internalMethod.bind(this, event.eventName, instance[event.methodName].bind(instance));

      return await method();
    });
  }

  /**
   * Add event to events array
   *
   * @param {string} type
   * @param {string} eventName
   * @param {string} targetName
   * @param {string} methodName
   */
  public add(type: string, eventName: string, targetName: string, methodName: string): void {
    if (this.availableDecoratorListenerTypes.includes(type)) {
      const event = new EventModel().cast({ type, eventName, targetName, methodName });
      this.events.push(event);
    }
  }

  /**
   * Emit event inside server environment
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]): void {
    alt.emit(eventName, ...args);
  }

  /**
   * Emit event to client
   *
   * @param {alt.Player | null} player
   * @param {string} eventName
   * @param args
   */
  public emitClient(player: alt.Player | null, eventName: string, ...args: any[]): void {
    alt.emitClient(player, eventName, ...args);
  }

  /**
   * Unsubscribe from server event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public off(eventName: string, listener: (...args: any[]) => void): void {
    alt.off(eventName, listener);
  }

  /**
   * Unsubscribe from client event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public offClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.offClient(eventName, listener);
  }

  /**
   * Receive event from server
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public on(eventName: string, listener: (...args: any[]) => void): void {
    alt.on(eventName, listener);
  }

  /**
   * Receive event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.onClient(eventName, listener);
  }

  /**
   * Receive once event from server
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public once(eventName: string, listener: (...args: any[]) => void): void {
    alt.once(eventName, listener);
  }

  /**
   * Receive once event from client
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onceClient(eventName: string, listener: (...args: any[]) => void): void {
    alt.onceClient(eventName, listener);
  }

}
