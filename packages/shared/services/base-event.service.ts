import { EventModel, EventServiceInterface, UtilsService } from '@abstractFlo/shared';
import { container, singleton } from 'tsyringe';

@singleton()
export class BaseEventService implements EventServiceInterface {

  /**
   * Contains all events
   *
   * @type {EventModel[]}
   */
  public events: EventModel[] = [];

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
    let availableDecoratorListenerTypes = this.getAvailableDecoratorListenerTypes();
    availableDecoratorListenerTypes.push('on', 'once', 'onGui');

    if (availableDecoratorListenerTypes.includes(type)) {
      const event = new EventModel().cast({ type, eventName, targetName, methodName });
      this.events.push(event);
    }
  }

  /**
   * Receive event from server
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public on(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOn(eventName, listener);
  }

  /**
   * Receive once event from server
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public once(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOnce(eventName, listener);
  }
  
  /**
   * Unsubscribe from server event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public off(eventName: string, listener: (...args: any[]) => void): void {
    UtilsService.eventOff(eventName, listener);
  }

  /**
   * Emit event inside server environment
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]): void {
    UtilsService.eventEmit(eventName, ...args);
  }

  /**
   * Return all available listener types for decorators
   *
   * @returns {string[]}
   * @private
   */
  public getAvailableDecoratorListenerTypes(): string[] {
    return [];
  }

}
