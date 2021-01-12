import * as alt from 'alt-client';
import { BaseObjectType, Entity } from 'alt-client';
import { BaseEventService, FrameworkEvent, UtilsService } from '@abstractFlo/shared';
import { container, singleton } from 'tsyringe';
import { GameEntityHandleModel } from '../models/game-entity-handle.model';

@singleton()
export class EventService extends BaseEventService {

  private gameEntityHandle: GameEntityHandleModel[] = [];

  /**
   * Override start method and include entity create
   */
  public start(done: CallableFunction) {
    if (this.gameEntityHandle.length) {
      const onCreateHandler = this.gameEntityHandle.filter((handle: GameEntityHandleModel) => handle.type === 'gameEntityCreate');
      const onDestroyHandler = this.gameEntityHandle.filter((handle: GameEntityHandleModel) => handle.type === 'gameEntityDestroy');

      if(onCreateHandler.length || onDestroyHandler.length) {
        UtilsService.log('Starting ~y~GameEntityHandle Decorator~w~');
        if (onCreateHandler.length) {
          this.listenGameEntityCreate(onCreateHandler);
        }

        if (onDestroyHandler.length) {
          this.listenGameEntityDestroy(onDestroyHandler);
        }
        UtilsService.log('Started ~lg~GameEntityHandle Decorator~w~');
      }
    }

    super.start(done);
  }

  /**
   * Emit event to server
   *
   * @param {string} name
   * @param args
   */
  public emitServer(name: string, ...args: any[]): void {
    alt.emitServer(name, ...args);
  }

  /**
   * Unsubscribe from server event
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public offServer(name: string, listener: (...args: any[]) => void): void {
    alt.offServer(name, listener);
  }

  /**
   * Receive event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onServer(name: string, listener: (...args: any[]) => void): void {
    alt.onServer(name, listener);
  }

  /**
   * Receive once event from server
   *
   * @param {string} name
   * @param {(...args: any[]) => void} listener
   */
  public onceServer(name: string, listener: (...args: any[]) => void): void {
    alt.onceServer(name, listener);
  }

  /**
   * Receive gui event
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public onGui(eventName: string, listener: (...args: any[]) => void): void {
    alt.emit(FrameworkEvent.EventService.GuiOn, eventName, listener);
  }

  /**
   * Add new game entity create to array
   *
   * @param {string} type
   * @param {BaseObjectType} entityType
   * @param {string} targetName
   * @param {string} methodName
   * @private
   */
  public addGameEntityMethods(type: string, entityType: BaseObjectType, targetName: string, methodName: string) {
    let availableDecoratorListenerTypes = this.getGameEntityDecoratorTypes();

    if (availableDecoratorListenerTypes.includes(type)) {
      const entityCreate = new GameEntityHandleModel().cast({ type, targetName, methodName, entityType });
      this.gameEntityHandle.push(entityCreate);
    }
  }

  /**
   * Return all available listener types for decorators
   *
   * @returns {string[]}
   * @private
   */
  protected getAvailableDecoratorListenerTypes(): string[] {
    return ['onServer', 'onceServer'];
  }

  /**
   * Return all available listener for gameEntity Events
   * @returns {string[]}
   */
  protected getGameEntityDecoratorTypes(): string[] {
    return ['gameEntityCreate', 'gameEntityDestroy'];
  }

  /**
   * Listen for game entity create
   *
   * @param {GameEntityHandleModel[]} onCreateHandler
   * @private
   */
  private listenGameEntityCreate(onCreateHandler: GameEntityHandleModel[]) {
    alt.on('gameEntityCreate', (entity: Entity) => {
      this.handleGameEntityMethods(entity, onCreateHandler);
    });
  }

  /**
   * Listen for game entity destroy
   *
   * @param {GameEntityHandleModel[]} onCreateHandler
   * @private
   */
  private listenGameEntityDestroy(onCreateHandler: GameEntityHandleModel[]) {
    alt.on('gameEntityDestroy', (entity: Entity) => {
      this.handleGameEntityMethods(entity, onCreateHandler);
    });
  }

  /**
   * Check and call given handlers
   *
   * @param {Entity} entity
   * @param {GameEntityHandleModel[]} handlers
   * @private
   */
  private handleGameEntityMethods(entity: Entity, handlers: GameEntityHandleModel[]) {
    handlers.forEach((handler: GameEntityHandleModel) => {
      if (entity.type === handler.entityType) {
        const instance = container.resolve<any>(handler.targetName);
        const method = instance[handler.methodName].bind(instance);
        method(entity);
      }
    });
  }
}
