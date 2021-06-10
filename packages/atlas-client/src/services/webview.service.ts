import { container, singleton } from 'tsyringe';
import {
  AutoloadAfter,
  constructor,
  EventEnum,
  EventModel,
  FrameworkEvent,
  UtilsService
} from '@abstractflo/atlas-shared';
import { showCursor, WebView } from 'alt-client';
import { EventService } from './event.service';

@AutoloadAfter({ methodName: 'load', doneCheckTimeout: 1000 * 10 })
@singleton()
export class WebviewService {
  /**
   * Contains all webview events
   *
   * @type {EventModel[]}
   * @private
   */
  private events: EventModel[] = [];

  /**
   * Contains the webview instance
   *
   * @type {WebView}
   * @private
   */
  private webview: WebView;

  /**
   * Contains the routeTo eventName
   * @type {string}
   * @private
   */
  private routeToEventName: string | null = null;

  /**
   * Current cursor count
   *
   * @type {number}
   * @private
   */
  private cursorCount = 0;

  /**
   * The event name for sending from webview to server
   *
   * e.g: gui:emit:server
   *
   * @type {string}
   * @private
   */
  private webviewToServerEventName: string = FrameworkEvent.EventService.GuiEmitServer;

  /**
   * Contains webview url
   *
   * @type {string}
   * @private
   */
  private url: string | null = null;

  /**
   * Contains the doneCallback
   *
   * @type {Function}
   * @private
   */
  private doneCallback: CallableFunction;

  public constructor(private readonly eventService: EventService) {}

  /**
   * Emit the route change to webview
   *
   * @param {string} route
   * @param args
   */
  public routeTo(route: string, ...args: any[]): WebviewService {
    this.emit(this.routeToEventName, route, ...args);
    return this;
  }

  /**
   * Return the webview  instance
   *
   * @returns {WebView}
   */
  public getWebView(): WebView {
    return this.webview;
  }

  /**
   * Show cursor
   */
  public showCursor(): WebviewService {
    showCursor(true);
    this.cursorCount += 1;

    return this;
  }

  /**
   * Remove Cursor
   */
  public removeCursor(): WebviewService {
    if (this.cursorCount > 0) {
      showCursor(false);
      this.cursorCount -= 1;
    }

    return this;
  }

  /**
   * Remove all cursors
   */
  public removeAllCursors(): WebviewService {
    for (let i = 0; i < this.cursorCount; i++) {
      showCursor(false);
    }

    this.cursorCount = 0;

    return this;
  }

  /**
   * Emit event to webview
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]): WebviewService {
    this.webview.emit(eventName, ...args);
    return this;
  }

  /**
   * Listen to event from webview
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} listener
   */
  public on(eventName: string, listener: (...args: any[]) => void): void {
    this.webview.on(eventName, listener);
  }

  /**
   * Destroy the webview instance
   */
  public destroy(): void {
    this.webview.destroy();
  }

  /**
   * Set webview in focus
   *
   * @return {WebviewService}
   */
  public focus(): WebviewService {
    this.webview.focus();

    return this;
  }

  /**
   * Set webview in focus
   *
   * @return {WebviewService}
   */
  public unfocus(): WebviewService {
    this.webview.unfocus();

    return this;
  }

  /**
   * Start listen for webview events
   *
   * @param {Function} done
   * @protected
   */
  protected load(done: CallableFunction): void {
    this.doneCallback = done;
    this.setupWebview();
  }

  /**
   * Setup events from reflection
   *
   * @protected
   */
  private setupEvents(): void {
    this.eventService.resolveAndLoadEvents(
      [EventEnum.ON_GUI],
      'WebViewEvents',
      (events: EventModel[]) => (this.events = events)
    );
  }

  /**
   * Setup the webview
   *
   * @private
   */
  private setupWebview(): void {
    try {
      this.routeToEventName = container.resolve<string>('alt.webview.routeTo.eventName');
      this.url = container.resolve<string>('alt.webview.url');
      this.startWebview();
    } catch (e) {
      this.doneCallback();
    }
  }

  /**
   * Create webview and wait for ready event
   *
   * @private
   */
  private startWebview(): void {
    this.webview = new WebView(this.url, false);

    this.webview.on('load', () => {
      this.setupEvents();

      UtilsService.nextTick(() => {
        this.startListenEvents();
        this.sendEventToServer();
        this.listenToServerSendGuiEvent();

        this.doneCallback();
      });
    });
  }

  /**
   * Listen all events
   *
   * @private
   */
  private startListenEvents(): void {
    this.events.forEach((event: EventModel) => {
      const instances = container.resolveAll<constructor<any>>(event.targetName);

      this.webview.on(event.eventName, (...args: any[]) => {
        instances.forEach(async (instance: constructor<any>) => {
          const instanceMethod = instance[event.methodName];

          if (!instanceMethod) return;

          const method = instanceMethod.bind(instance);
          await method(...args);
        });
      });
    });
  }

  /**
   * Send event to server from webview
   *
   * @private
   */
  private sendEventToServer() {
    this.webview.on(this.webviewToServerEventName, (eventName: string, ...args: any[]) => {
      this.eventService.emitServer(eventName, ...args);
    });
  }

  /**
   * Emit event from server to gui use client as bridge
   *
   * @private
   */
  private listenToServerSendGuiEvent(): void {
    this.eventService.onServer(FrameworkEvent.EventService.ServerEmitGui, (eventName: string, ...args: any[]) => {
      UtilsService.nextTick(() => {
        this.webview.emit(eventName, ...args);
      });
    });
  }
}
