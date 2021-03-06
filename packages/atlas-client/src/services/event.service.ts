import {
  AutoloadAfter,
  BaseEventService,
  CommandService,
  EventEnum,
  EventModel,
  FrameworkEvent,
  UtilsService
} from '@abstractflo/atlas-shared';
import { singleton } from 'tsyringe';
import { emit, emitServer, offServer, onceServer, onServer } from 'alt-client';
import { KeyEventService } from './key-event.service';

@AutoloadAfter({ methodName: 'loadEvents' })
@singleton()
export class EventService extends BaseEventService {

  /**
   * Contains all key event keys
   *
   * @type {string[]}
   * @private
   */
  private keyEvents: string[] = [
    EventEnum.KEY_DOWN,
    EventEnum.KEY_UP
  ];

  constructor(
      protected readonly commandService: CommandService,
      private readonly keyEventService: KeyEventService
  ) {
    super(commandService);
  }

  /**
   * Emit event to server
   *
   * @param {string} name
   * @param args
   */
  public emitServer(name: string, ...args: any[]): void {
    emitServer(name, ...args);
  }

  /**
   * Unsubscribe from server event
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public offServer(name: string, listener: (...args: any[]) => void): void {
    offServer(name, listener);
  }

  /**
   * Receive event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onServer(name: string, listener: (...args: any[]) => void): void {
    onServer(name, listener);
  }

  /**
   * Receive once event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onceServer(name: string, listener: (...args: any[]) => void): void {
    onceServer(name, listener);
  }

  /**
   * Receive gui event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onGui(eventName: string, listener: (...args: any[]) => void): void {
    emit(FrameworkEvent.EventService.GuiOn, eventName, listener);
  }

  /**
   * Override startEventListener
   *
   * @protected
   */
  protected startEventListeners() {
    super.startEventListeners();

    UtilsService.nextTick(() =>
        this.resolveAndLoadEvents(
            this.keyEvents,
            'KeyEvents',
            this.startKeyEvents.bind(this)
        )
    );
  }

  /**
   * Start the key event resolver
   *
   * @param {EventModel[]} events
   * @private
   */
  private startKeyEvents(events: EventModel[]): void {
    const eventType = events[0].type;
    this.keyEventService.setupCommands(events);

    this.on(eventType, (key: number) => {
      this.keyEventService.run(key, eventType);
    });
  }
}
