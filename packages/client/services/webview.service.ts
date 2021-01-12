import { container, singleton } from 'tsyringe';
import { showCursor, WebView } from 'alt-client';
import { FrameworkEvent, LoaderService, LoggerService, StringResolver, UtilsService } from '@abstractFlo/shared';
import { EventService } from './event.service';
import { WebviewEventModel } from '../models';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@StringResolver
@singleton()
export class WebviewService {

  /**
   * Current cursor count
   *
   * @type {number}
   * @private
   */
  private cursorCount: number = 0;

  /**
   * Contains the webview instance
   *
   * @type {WebView}
   * @private
   */
  private webview: WebView;

  /**
   * Contains the events for webview
   *
   * @type {WebviewEventModel[]}
   * @private
   */
  private events: WebviewEventModel[] = [];

  /**
   * Contains the ready subject for webview
   *
   * @type {Subject<boolean>}
   * @private
   */
  private webviewReadySubject$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

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
  private url: string = container.resolve<string>('alt.webview.url');

  constructor(
      private readonly loggerService: LoggerService,
      private readonly eventService: EventService
  ) {
    this.registerAutoStart();
  }

  /**
   * Add event to events array
   *
   * @param {string} eventName
   * @param {string} targetName
   * @param {string} methodName
   */
  public add(eventName: string, targetName: string, methodName: string): void {
    const event = new WebviewEventModel().cast({ eventName, targetName, methodName });
    this.events.push(event);
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
  public showCursor(): void {
    showCursor(true);
    this.cursorCount = this.cursorCount + 1;
  }

  /**
   * Remove Cursor
   */
  public removeCursor(): void {
    if (this.cursorCount > 0) {
      showCursor(false);
      this.cursorCount = this.cursorCount - 1;
    }
  }

  /**
   * Remove all cursors
   */
  public removeAllCursors(): void {
    for (let i = 0; i < this.cursorCount; i++) {
      showCursor(false);
    }

    this.cursorCount = 0;
  }

  /**
   * Start event loop
   */
  public start(): void {
    this.events.forEach((event: WebviewEventModel) => {
      const instance = container.resolve<any>(event.targetName);
      const method = instance[event.methodName].bind(instance);

      this.webview.on(event.eventName, method);
    });
  }

  /**
   * AutoStart webview service
   * @param {Function} done
   */
  public autoStart(done: CallableFunction): void {
    this.loggerService.starting('WebView');
    this.initialize()
        .subscribe(() => {
          this.loggerService.started('WebView');
          done();
        });
  }

  /**
   * Emit event to webview
   *
   * @param {string} eventName
   * @param args
   */
  public emit(eventName: string, ...args: any[]): void {
    this.webview.emit(eventName, ...args);
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
   * Return the webview ready subject as observable
   *
   * @returns {Observable<boolean>}
   * @private
   */
  private initialize(): Observable<boolean> {
    return this.webviewReadySubject$;
  }

  /**
   * Create new webview instance
   *
   * @private
   */
  private createInstance(): void {
    this.webview = new WebView(this.url, false);

    this.listenReadyEvent();
    this.sendEventToServer();
    this.listenGuiOnEvent();
    this.listenToServerSendGuiEvent();
  }

  /**
   * Listen for ready event and complete subscription
   *
   * @private
   */
  private listenReadyEvent(): void {
    this.webview.on('load', () => {
      this.webviewReadySubject$.next(true);
      this.webviewReadySubject$.complete();
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
   * Listen to events from decorator
   *
   * @private
   */
  private listenGuiOnEvent() {
    this.eventService.on(FrameworkEvent.EventService.GuiOn, (eventName: string, listener: (...args: any[]) => void) => {
      this.webview.on(eventName, listener);
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

  /**
   * Autostart the webview service after first resolution
   *
   * @private
   */
  private registerAutoStart(): void {
    container.afterResolution(WebviewService, () => {
      const loader = container.resolve(LoaderService);
      loader.add('before', 'autoStart', this.constructor.name);

      this.createInstance();
    }, { frequency: 'Once' });
  }
}
