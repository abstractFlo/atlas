import { app, BaseEventService, constructor, EventModel, Internal, Last, Singleton } from '@abstractflo/atlas-shared';
import { Colshape, emitAllClients, emitClient, Entity, offClient, onceClient, onClient, Player } from 'alt-server';

@Singleton
export class EventService extends BaseEventService {

  /**
   * Contains the off event methods
   *
   * @type {Map<string, any>}
   * @private
   */
  protected offClientEventsMap: Map<string, CallableFunction[]> = new Map<string, CallableFunction[]>();

  /**
   * Receive event from client
   */
  public onClient(eventName: string, listener: (player: Player, ...args: any[]) => void): void;
  public onClient(eventName: string, listener: (player: Player, ...args: any[]) => void, resetable: boolean): void;
  public onClient(eventName: string, listener: (player: Player, ...args: any[]) => void, resetable?: boolean) {
    onClient(eventName, listener);

    if (resetable) {
      this.registerAnonymusOffEvents(this.offClient, eventName, listener);
    }
  }

  /**
   * Unsubscribe from client event
   */
  public offClient(eventName: string): void;
  public offClient(eventName: string, listener: (player: Player, ...args: any[]) => void): void;
  public offClient(eventName: string, listener?: (player: Player, ...args: any[]) => void) {
    listener
        ? offClient(eventName, listener)
        : this.processOffEvent(eventName, this.offClientEventsMap);
  }

  /**
   * Emit event to one or all players
   */
  public emitClient(player: Player, eventName: string, ...args: any[]): void;
  public emitClient(player: Player[], eventName: string, ...args: any[]): void;
  public emitClient(player: null, eventName: string, ...args: any[]): void {
    emitClient(player, eventName, ...args);
  }

  /**
   * Emit event to all clients
   *
   * @param {string} eventName
   * @param args
   */
  public emitAllClients(eventName: string, ...args: any[]): void {
    emitAllClients(eventName, ...args);
  }

  /**
   * Receive once event from client
   */
  public onceClient(eventName: string, listener: (player: Player, ...args: any[]) => void) {
    onceClient(eventName, listener);
  }

  /**
   * Emit Gui event to list of players
   *
   * @param {Player} player
   * @param {string} eventName
   * @param args
   */
  public emitGui(player: Player, eventName: string, ...args: any[]): void;
  public emitGui(player: Player[], eventName: string, ...args: any[]): void;
  public emitGui(player: null, eventName: string, ...args: any[]): void {
    this.emitClient(player, Internal.Events_Server_Gui, eventName, ...args);
  }

  /**
   * Emit gui event to all clients
   *
   * @param {string} eventName
   * @param args
   */
  public emitGuiAll(eventName: string, ...args: any[]): void {
    this.emitAllClients(Internal.Events_Server_Gui, eventName, ...args);
  }

  /**
   * Override base startEventListeners to fit server needs
   */
  @Last
  protected async start(): Promise<void> {
    await super.listenToEvents();

    await this.resolveAndLoadEvents(this.colShapeEvents, 'ColShapeEvents', this.listenToColShapeEvents.bind(this));
    await this.resolveAndLoadEvents(
        [Internal.Events_Gui_Server],
        'GuiServerEvents',
        this.listenToGuiServerEvents.bind(this)
    );
  }

  /**
   * Start the colShape event listener
   */
  private listenToColShapeEvents(events: EventModel[]) {
    const eventType = events[0].type;

    this.on(eventType, (colShape: Colshape, entity: Entity) => {
      this.handleColShapeEvents(events, colShape, entity);
    });
  }

  /**
   * Handle all colShape events
   */
  private handleColShapeEvents(events: EventModel[], colShape: Colshape, entity: Entity) {
    events.forEach((event: EventModel) => {
      if (colShape.colshapeType !== event.validateOptions.colShapeType) {
        return;
      }

      if (event.validateOptions.name !== undefined && colShape.name !== event.validateOptions.name) {
        return;
      }

      if (
          event.validateOptions.entity !== undefined &&
          !this.isEntityType(entity.type, event.validateOptions.entity)
      ) {
        return;
      }

      const instances = app.resolveAll<constructor<any>>(event.targetName);

      instances.forEach(async (instance: constructor<any>) => {
        const instanceMethod = instance[event.methodName];

        if (!instanceMethod) {
          return;
        }

        const method = instanceMethod.bind(instance);
        await method(colShape, entity);
      });
    });
  }

  /**
   * Start gui server events listener
   *
   * @param {EventModel[]} events
   * @private
   */
  private listenToGuiServerEvents(events: EventModel[]): void {
    this.onClient(Internal.Events_Gui_Server, (player: Player, eventName: string, ...args: any[]) => {
      const neededEvents = events.filter((event: EventModel) => event.eventName === eventName);
      this.handleGuiServerEvents(neededEvents, player, ...args);
    });
  }

  /**
   * Handle guiServer Events
   *
   * @param {EventModel[]} events
   * @param {Player} player
   * @param args
   * @private
   */
  private handleGuiServerEvents(events: EventModel[], player: Player, ...args: any[]): void {
    events.forEach((event: EventModel) => {
      const instances = app.resolveAll<constructor<any>>(event.targetName);

      instances.forEach(async (instance: constructor<any>) => {
        const instanceMethod = instance[event.methodName];

        if (!instanceMethod) return;

        const method = instanceMethod.bind(instance, player, ...args);
        await method();
      });
    });
  }
}
