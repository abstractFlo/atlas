import { KeyEventModel } from '../models/key-event.model';
import { EventService } from './event.service';
import { container, singleton } from 'tsyringe';
import { LoaderService, StringResolver, UtilsService } from '@abstractFlo/shared';

@StringResolver
@singleton()
export class KeyEventService {

  /**
   * Contains all key events
   *
   * @type {Map<string, KeyEventModel>}
   */
  public events: Map<string, KeyEventModel> = new Map<string, KeyEventModel>();

  constructor(
      private readonly eventService: EventService
  ) {}

  /**
   * Start the event loop
   */
  public start(done: CallableFunction): void {

    if (this.eventTypeExist('keyup') || this.eventTypeExist('keydown')) {
      UtilsService.log('Started ~y~KeyEventService~w~');

      if (this.eventTypeExist('keyup')) {
        this.eventService.on('keyup', this.keyup.bind(this));
      }

      if (this.eventTypeExist('keydown')) {
        this.eventService.on('keydown', this.keydown.bind(this));
      }

      UtilsService.log('Started ~lg~KeyEventService~w~ => All registered keyevents now available');
    }

    done();
  }

  /**
   * Add event to events array
   *
   * @param {string} type
   * @param key
   * @param target
   * @param {string} methodName
   */
  public add(type: string, key: number, target: string, methodName: string): void {
    const keyUnique = `${type}_${key}`;

    if (this.events.has(keyUnique)) {
      return;
    }

    if (this.events.size === 0) {
      const loaderService = container.resolve(LoaderService);
      loaderService.add('afterBootstrap', 'start', this.constructor.name);
    }

    const event = new KeyEventModel().cast({ key, type, target, methodName });
    this.events.set(keyUnique, event);
  }

  /**
   * Run key events
   *
   * @param {string} keyUnique
   */
  public run(keyUnique: string): void {
    if (this.events.has(keyUnique)) {
      const event = this.events.get(keyUnique);
      const instance = container.resolve<any>(event.target);

      instance[event.methodName].bind(instance);
    }
  }

  /**
   * Check if given key exists in events array
   *
   * @param {"keyup" | "keydown"} type
   * @return {boolean}
   * @private
   */
  private eventTypeExist(type: 'keyup' | 'keydown'): boolean {
    return !!Array.from(this.events.values()).filter((event: KeyEventModel) => event.type === type);
  }

  /**
   * Run keyup event
   *
   * @param {number} key
   * @private
   */
  private keyup(key: number): void {
    this.run(`keyup_${key}`);
  }

  /**
   * Run keydown event
   *
   * @param {number} key
   * @private
   */
  private keydown(key: number): void {
    this.run(`keydown_${key}`);
  }
}
