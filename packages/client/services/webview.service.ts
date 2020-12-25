import { container, singleton } from 'tsyringe';
import { WebView } from 'alt-client';
import { LoggerService, UtilsService } from '@abstractFlo/shared';
import { EventService } from './event.service';
import { WebviewEventModel } from '../models';
import { Observable, Subject } from 'rxjs';

@singleton()
export class WebviewService {

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
  private webviewReadySubject$: Subject<boolean> = new Subject<boolean>();

  /**
   * The event name for sending from webview to server
   *
   * e.g: gui:emit:server
   *
   * @type {string}
   * @private
   */
  private webviewToServerEventName: string = container.resolve<string>('alt.webview.server.eventName');

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
    this.createInstance();
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
   * Return the webview ready subject as observable
   *
   * @returns {Observable<boolean>}
   */
  public initialize(): Observable<boolean> {
    return this.webviewReadySubject$;
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
      this.eventService.emitServer('gui:emit:server', eventName, ...args);
    });
  }

  /**
   * Listen to events from decorator
   *
   * @private
   */
  private listenGuiOnEvent() {
    this.eventService.on('gui:on', (eventName: string, listener: (...args: any[]) => void) => {
      this.webview.on(eventName, listener);
    });
  }

  /**
   * Emit event from server to gui use client as bridge
   *
   * @private
   */
  private listenToServerSendGuiEvent(): void {
    this.eventService.onServer('server:emit:gui', (eventName: string, ...args: any[]) => {
      UtilsService.nextTick(() => {
        this.webview.emit(eventName, ...args);
      });
    });
  }
}
