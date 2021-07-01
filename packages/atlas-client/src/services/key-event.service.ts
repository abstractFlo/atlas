import { container, singleton } from 'tsyringe';
import { constructor, EventModel, ValidateOptionsModel } from '@abstractflo/atlas-shared';
import { localPlayer } from '../helpers';

@singleton()
export class KeyEventService {
  /**
   * Contains all keyEvents categorized by eventType
   *
   * @type {Map<string, EventModel[]>}
   * @private
   */
  private keyEvents: Map<string, EventModel[]> = new Map<string, EventModel[]>();

  /**
   * Setup all given key events
   *
   * @param {EventModel[]} events
   */
  public setupCommands(events: EventModel[]) {
    events.forEach((event: EventModel) => this.add(event));
  }

  /**
   * Run the key event
   *
   * @param {number} key
   * @param {string} eventType
   */
  public run(key: number, eventType: string): void {
    const keyEvents = this.keyEvents.get(eventType);
    const dummyValidateOptions = new ValidateOptionsModel().cast({
      keyboardKey: key,
    });
    const dummyKeyEvent = new EventModel().cast({
      validateOptions: dummyValidateOptions,
    });
    const existingEvent = this.keyExists(keyEvents, dummyKeyEvent);

    if (!existingEvent) return;

    const instances = container.resolveAll<constructor<any>>(existingEvent.targetName);
    instances.forEach(async (instance: constructor<any>) => {
      const instanceMethod = instance[existingEvent.methodName];

      if (!instanceMethod) return;

      const method = instanceMethod.bind(instance);
      await method(localPlayer);
    });
  }

  /**
   * Add new keyEvent to map
   *
   * @param {EventModel} event
   * @private
   */
  private add(event: EventModel): void {
    if (!this.keyEvents.has(event.type)) {
      this.keyEvents.set(event.type, []);
    }

    const keyEvents = this.keyEvents.get(event.type);
    const keyExists = !!this.keyExists(keyEvents, event);

    if (keyExists) return;

    keyEvents.push(event);
  }

  /**
   * Return if given key exists in given key collection
   *
   * @param {EventModel[]} keyEvents
   * @param {EventModel} event
   * @return {EventModel | undefined}
   * @private
   */
  private keyExists(keyEvents: EventModel[], event: EventModel): EventModel | undefined {
    return keyEvents.find((keyEvent: EventModel) => keyEvent.validateOptions.keyboardKey === event.validateOptions.keyboardKey);
  }
}
