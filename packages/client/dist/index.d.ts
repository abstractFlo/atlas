import { BaseEventService, EntityHandleModel, LoggerService, JsonEntityModel } from '@abstractFlo/shared';
import { WebView, BaseObjectType } from 'alt-client';

declare class EventService extends BaseEventService {
    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    emitServer(name: string, ...args: any[]): void;
    /**
     * Unsubscribe from server event
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    offServer(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onServer(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive once event from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onceServer(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive gui event
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    onGui(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Listen handlers for given type
     *
     * @param {string} type
     * @param {EntityHandleModel[]} handlers
     * @protected
     */
    protected listenHandlerForType(type: string, handlers: EntityHandleModel[]): void;
}

declare class WebviewService {
    private readonly loggerService;
    private readonly eventService;
    /**
     * Contains the routeTo eventName
     * @type {string}
     * @private
     */
    private readonly routeToEventName;
    /**
     * Current cursor count
     *
     * @type {number}
     * @private
     */
    private cursorCount;
    /**
     * Contains the webview instance
     *
     * @type {WebView}
     * @private
     */
    private webview;
    /**
     * Contains the events for webview
     *
     * @type {WebviewEventModel[]}
     * @private
     */
    private events;
    /**
     * Contains the ready subject for webview
     *
     * @type {Subject<boolean>}
     * @private
     */
    private webviewReadySubject$;
    /**
     * The event name for sending from webview to server
     *
     * e.g: gui:emit:server
     *
     * @type {string}
     * @private
     */
    private webviewToServerEventName;
    /**
     * Contains webview url
     *
     * @type {string}
     * @private
     */
    private url;
    constructor(loggerService: LoggerService, eventService: EventService);
    /**
     * Add event to events array
     *
     * @param {string} eventName
     * @param {string} targetName
     * @param {string} methodName
     */
    add(eventName: string, targetName: string, methodName: string): void;
    /**
     * Return the webview  instance
     *
     * @returns {WebView}
     */
    getWebView(): WebView;
    /**
     * Emit the route change to webview
     *
     * @param {string} route
     * @param args
     */
    routeTo(route: string, ...args: any[]): WebviewService;
    /**
     * Show cursor
     */
    showCursor(): WebviewService;
    /**
     * Remove Cursor
     */
    removeCursor(): WebviewService;
    /**
     * Remove all cursors
     */
    removeAllCursors(): WebviewService;
    /**
     * Start event loop
     *
     * @ToDo Fragwürdig warum das da ist???
     */
    start(): void;
    /**
     * AutoStart webview service
     * @param {Function} done
     */
    autoStart(done: CallableFunction): void;
    /**
     * Emit event to webview
     *
     * @param {string} eventName
     * @param args
     */
    emit(eventName: string, ...args: any[]): WebviewService;
    /**
     * Listen to event from webview
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    on(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Destroy the webview instance
     */
    destroy(): void;
    /**
     * Set webview in focus
     *
     * @return {WebviewService}
     */
    focus(): WebviewService;
    /**
     * Set webview in focus
     *
     * @return {WebviewService}
     */
    unfocus(): WebviewService;
    /**
     * Return the webview ready subject as observable
     *
     * @returns {Observable<boolean>}
     * @private
     */
    private initialize;
    /**
     * Create new webview instance
     *
     * @private
     */
    private createInstance;
    /**
     * Listen for ready event and complete subscription
     *
     * @private
     */
    private listenReadyEvent;
    /**
     * Send event to server from webview
     *
     * @private
     */
    private sendEventToServer;
    /**
     * Listen to events from decorator
     *
     * @private
     */
    private listenGuiOnEvent;
    /**
     * Emit event from server to gui use client as bridge
     *
     * @private
     */
    private listenToServerSendGuiEvent;
}

declare class KeyEventModel extends JsonEntityModel {
    target: string;
    methodName: string;
    type: 'keyup' | 'keydown';
    key: number;
}

declare class KeyEventService {
    private readonly eventService;
    /**
     * Contains all key events
     *
     * @type {Map<string, KeyEventModel>}
     */
    events: Map<string, KeyEventModel>;
    constructor(eventService: EventService);
    /**
     * Start the event loop
     */
    start(): void;
    /**
     * Autostart key event service
     *
     * @param {Function} done
     */
    autoStart(done: CallableFunction): void;
    /**
     * Add event to events array
     *
     * @param {string} type
     * @param key
     * @param target
     * @param {string} methodName
     */
    add(type: string, key: number, target: string, methodName: string): void;
    /**
     * Run key events
     *
     * @param {string} keyUnique
     */
    run(keyUnique: string): void;
    /**
     * Check if given key exists in events array
     *
     * @param {"keyup" | "keydown"} type
     * @return {boolean}
     * @private
     */
    private eventTypeExist;
    /**
     * Run keyup event
     *
     * @param {number} key
     * @private
     */
    private keyup;
    /**
     * Run keydown event
     *
     * @param {number} key
     * @private
     */
    private keydown;
}

/**
 * Add onServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnServer: (name?: string) => MethodDecorator;
/**
 * Add onceServer event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnceServer: (name?: string) => MethodDecorator;
/**
 * Add onGui event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnGui: (name?: string) => MethodDecorator;
/**
 * GameEntityCreate Decorator
 *
 * @param {BaseObjectType} entityType
 * @returns {MethodDecorator}
 * @constructor
 */
declare const GameEntityCreate: (entityType: BaseObjectType) => MethodDecorator;
/**
 * GameEntityDestroy Decorator
 *
 * @param {BaseObjectType} entityType
 * @returns {MethodDecorator}
 * @constructor
 */
declare const GameEntityDestroy: (entityType: BaseObjectType) => MethodDecorator;
/**
 * Decorate streamSyncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
declare const StreamSyncedMetaChange: (entityType: BaseObjectType, metaKey?: string) => MethodDecorator;
/**
 * Decorate syncedMetaChange event to prevent multiple instance for same event listener
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
declare const SyncedMetaChange: (entityType: BaseObjectType, metaKey?: string) => MethodDecorator;

/**
 * KeyUp Decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 * @constructor
 */
declare const KeyUp: (key: number | string) => MethodDecorator;
/**
 * KeyDown Decorator
 *
 * @param {number | string} key
 * @returns {MethodDecorator}
 * @constructor
 */
declare const KeyDown: (key: number | string) => MethodDecorator;

interface WebviewInterface {
    /**
     * Simple method for webview routing
     *
     * @param {string} route
     * @param args
     */
    routeTo(route: string, ...args: any[]): void;
}

declare module 'alt-client' {
    interface WebView extends WebviewInterface {
    }
}

export { EventService, GameEntityCreate, GameEntityDestroy, KeyDown, KeyEventService, KeyUp, OnGui, OnServer, OnceServer, StreamSyncedMetaChange, SyncedMetaChange, WebviewService };
