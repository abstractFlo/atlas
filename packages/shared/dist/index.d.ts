import { InjectionToken } from 'tsyringe';
import { Subject } from 'rxjs';
import { constructor } from 'tsyringe/dist/typings/types';

declare function altLibRegister(lib: any): void;
declare function setupServerConfigPath(path: string): void;
declare function setupServerDatabaseEntities(entities: InjectionToken[]): void;
declare function setupWebviewRegistry(url: string, routeToEventName: string): void;
declare function setDiscordApiServerPort(port: number): void;

declare type CastCallback = (currentValue: any, jsonObject: any) => any;
interface CastConfig {
    property?: string;
    from?: CastCallback;
    to?: CastCallback;
    readOnly?: CastCallback | boolean;
    trim?: boolean;
}
/**
 * allow casting json properties from and to object
 * @param {CastConfig} config
 * @returns {(t: any, p: (string)) => void}
 * @constructor
 */
declare function Cast(config?: CastConfig): (t: any, p: string | symbol) => void;

/**
 * automatic cast json to entity model
 */
declare class JsonEntityModel {
    /**
     * create relations
     * @param {IRelationInfo} relationInfo
     * @param json
     * @param {boolean} mapping [default:true]
     * @returns {JsonEntityModel | JsonEntityModel[] | undefined}
     */
    private static createRelations;
    /**
     * parse json data to model class based on @Cast decorator
     * @param {object | null} json
     * @param {boolean} mapping [default:true]
     * @returns {this}
     */
    cast(json: {
        [key: string]: any;
    } | null, mapping?: boolean): this;
}

/**
 * Allows to automatically cast sub models to array of related Model class instances
 *
 * ```typescript
 *  class Author extends BaseModel {
 *      // ...
 *      ＠HasMany(Book)
 *      ＠Cast() books: Book[];
 *      // ...
 *  }
 * ```
 *
 * @param model ModelClass
 */
declare function HasMany(model: typeof JsonEntityModel): (target: any, propertyKey: string | symbol) => void;
/**
 * Allows to automatically cast sub models to related Model class instance
 *
 * ```typescript
 *  class Book extends BaseModel {
 *      // ...
 *      ＠HasOne(Author)
 *      ＠Cast() author: Author;
 *      // ...
 *  }
 *  ```
 *
 * @param model ModelClass
 */
declare function HasOne(model: typeof JsonEntityModel): (target: any, propertyKey: string | symbol) => void;

/**
 * get callback for easy null checks
 * @returns {(v: any) => boolean}
 */
declare function isNull(): (v: any) => boolean;
/**
 * get callback for converting to boolean, accept bool or trueValue with default string '1'
 * @param {any} trueValue
 * @returns {(v: any) => boolean}
 */
declare function castToBoolean(trueValue?: any): (v: any) => boolean;
/**
 * get callback for converting from boolean to string (default strings '0', '1')
 * @param {any} trueValue
 * @param {any} falseValue
 * @returns {(v: any) => string}
 */
declare function castBooleanToString(trueValue?: any, falseValue?: any): (v: any) => string;
/**
 * get callback for converting to number (float|int) or null
 * @param {boolean} keepNull
 * @returns {(v: any) => (number | null)}
 */
declare function castToNumber(keepNull?: boolean): (v: any) => number | null;
/**
 * get callback for converting from json
 * @param {boolean} keepNull
 * @return {(v: any) => (object | null)}
 */
declare function castFromJson(keepNull?: boolean): (v: any) => object | null;
/**
 * get callback for converting to string or null
 * @param {boolean} keepNull
 * @param {string} standard
 * @returns {(v: any) => (string | null)}
 */
declare function castToString(keepNull?: boolean, standard?: string): (v: any) => string | null;

interface ModuleOptionsDecoratorInterface {
    imports?: any[];
    components?: any[];
}

declare class ValidateOptionsModel extends JsonEntityModel {
    eventAddTo: 'base' | 'gameEntity' | 'metaChange' | 'colShape';
    entity: number;
    metaKey: string;
    colShapeType: number;
    name: string;
}

interface EventServiceInterface {
    /**
     * Autostart listen events
     */
    autoStart(done: CallableFunction): void;
    /**
     * Add event to events array
     *
     * @param {string} type
     * @param {string} targetName
     * @param {string} methodName
     * @param options
     */
    add(type: string, targetName: string, methodName: string, options: ValidateOptionsModel): void;
    /**
     * Receive event from client/server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    on(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onClient?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onServer?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event once time from client/server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    once(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event once time from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onceClient?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event once time from server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    onceServer?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe event from client/server
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    off(name: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe event from client
     *
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    offClient?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe event from server
     * @param {string} name
     * @param {(...args: any[]) => void} listener
     */
    offServer?(name: string, listener: (...args: any[]) => void): void;
    /**
     * Emit event client/server
     * @param {string} name
     * @param args
     */
    emit(name: string, ...args: any[]): void;
    /**
     * Emit event to server
     *
     * @param {string} name
     * @param args
     */
    emitServer?(name: string, ...args: any[]): void;
    /**
     * Handle game entity events
     *
     * @param {string} type
     * @param {string} target
     * @param {string} methodName
     * @param {ValidateOptionsModel} options
     */
    addHandlerMethods?(type: string, target: string, methodName: string, options: ValidateOptionsModel): void;
}

declare class ModuleOptionsDecoratorModel extends JsonEntityModel {
    imports: any[];
}

declare class QueueItemModel extends JsonEntityModel {
    target: string;
    methodName: string;
    doneCheckIntervalTime: number;
}

declare class QueueModel extends JsonEntityModel {
    before: Map<string, QueueItemModel>;
    beforeCount: Subject<number>;
    after: Map<string, QueueItemModel>;
    afterCount: Subject<number>;
    afterBootstrap: Map<string, QueueItemModel>;
    afterBootstrapCount: Subject<number>;
}

declare class EventModel extends JsonEntityModel {
    type: string;
    eventName: string;
    methodName: string;
    targetName: string;
}

declare class CommandModel extends JsonEntityModel {
    target: string;
    methodName: string;
}

/**
 * Register class as string injection token and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @returns {ClassDecorator}
 * @constructor
 */
declare function Module(options?: ModuleOptionsDecoratorInterface): (constructor: constructor<any>) => constructor<any>;

/**
 * Add method to before queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
declare const Before: (doneCheckIntervalTime?: number) => MethodDecorator;
/**
 * Add method to after queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
declare const After: (doneCheckIntervalTime?: number) => MethodDecorator;
/**
 * Add method to afterBootstrap queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
declare const AfterBootstrap: (doneCheckIntervalTime?: number) => MethodDecorator;

declare class DiscordConfigModel extends JsonEntityModel {
    client_id: string;
    client_secret: string;
    bot_secret: string;
    server_id: string;
    redirect_url: string;
    auth_url: string;
    auth_token_url: string;
    user_me_url: string;
    presences: Object;
}

declare class DiscordEventModel extends JsonEntityModel {
    eventName: string;
    targetName: string;
    methodName: string;
}

declare class DiscordUserModel extends JsonEntityModel {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    avatarUrl: string;
}

declare class AccessTokenModel extends JsonEntityModel {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

declare class EntityHandleModel extends EventModel {
    options: ValidateOptionsModel;
}

/**
 * Add on event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const On: (name?: string) => MethodDecorator;
/**
 * Add once event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const Once: (name?: string) => MethodDecorator;
/**
 * Helper for adding events
 *
 * @param {Object} target
 * @param {string} type
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @param options
 * @returns {PropertyDescriptor | void}
 */
declare function validateEventExistsAndPush<T>(target: Object, type: string, propertyKey: string, descriptor: PropertyDescriptor, options: ValidateOptionsModel): PropertyDescriptor | void;

/**
 * Register command inside command.service
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const Cmd: (name?: string) => MethodDecorator;

/**
 * Register class as string injection token
 *
 * @param {constructor<any>} constructor
 * @returns {constructor<any>}
 * @constructor
 */
declare const StringResolver: (constructor: any) => any;

declare class LoaderService {
    /**
     * Contains the complete loading queue
     *
     * @type {QueueModel}
     * @private
     */
    private queue;
    /**
     * Contains the beforeCount observable
     *
     * @type {Observable<number>}
     * @private
     */
    private readonly beforeCount$;
    /**
     * Contains the afterCount observable
     *
     * @type {Observable<number>}
     * @private
     */
    private readonly afterCount$;
    /**
     * Contains the afterBootstrapCount observable
     *
     * @type {Observable<number>}
     * @private
     */
    private readonly afterBootstrapCount$;
    /**
     * Contains the starting subject for booting
     *
     * @type {Subject<boolean>}
     * @private
     */
    private readonly startingSubject;
    /**
     * Contains the starting observable with default pipe
     * @type {Observable<boolean>}
     * @private
     */
    private startingSubject$;
    /**
     * Contains the finish subject to declare finish loading state
     *
     * @type {Subject<boolean>}
     * @private
     */
    private readonly finishSubject$;
    /**
     * Check if loader run on serverSide
     *
     * @type {boolean}
     * @private
     */
    private readonly isServerSide;
    /**
     * Return the loader queue status
     *
     * @returns {string}
     */
    debug(): string;
    /**
     * Do something after finish booting
     *
     * @param {(...args: any[]) => void} callback
     */
    afterComplete(callback: (...args: any[]) => void): void;
    /**
     * Add new resolver to queue
     *
     * @param {"before" | "after" | "afterBootstrap"} type
     * @param key
     * @param target
     * @param doneCheckIntervalTime
     */
    add(type: 'before' | 'after' | 'afterBootstrap', key: string, target: string, doneCheckIntervalTime?: number): void;
    /**
     * Bootstrap complete system
     *
     * @param {InjectionToken} target
     * @returns {LoaderService}
     */
    bootstrap<T>(target: InjectionToken): LoaderService;
    /**
     * Resolve all from queue
     */
    private resolve;
    /**
     * Done callback handler for before and after methods
     *
     * @param {Map<string, QueueItemModel>} property
     * @param {Subject<number>} propertyCount
     * @param doneCheckIntervalId
     * @param {string | null} key
     * @private
     */
    private doneCallback;
    /**
     * Process the queue for given property
     *
     * @param {Map<string, any>} property
     * @param {Subject<number>} propertyCount
     * @private
     */
    private processWork;
    /**
     * Process one item from queue
     *
     * @param {Map<string, QueueItemModel>} property
     * @param {Subject<number>} propertyCount
     * @return {Promise<void>}
     * @private
     */
    private processQueueItem;
}

declare class UtilsService {
    /**
     * Auto clear setTimeout
     *
     * @param {Function} listener
     * @param {number} duration
     */
    static setTimeout(listener: CallableFunction, duration: number): void;
    /**
     * Run an interval
     *
     * @param {Function} listener
     * @param {number} milliseconds
     * @returns {number}
     */
    static setInterval(listener: CallableFunction, milliseconds: number): number;
    /**
     * Run an everyTick Timer
     *
     * @param {Function} listener
     * @returns {number}
     */
    static everyTick(listener: CallableFunction): number;
    /**
     * Run an interval and clear after duration
     *
     * @param {Function} listener
     * @param {number} milliseconds
     * @param intervalDuration
     * @returns {number}
     */
    static autoClearInterval(listener: CallableFunction, milliseconds: number, intervalDuration: number): void;
    /**
     * Next tick
     * @param {Function} listener
     */
    static nextTick(listener: CallableFunction): void;
    /**
     * Clear given interval
     *
     * @param {number} interval
     * @returns {void}
     */
    static clearInterval(interval: number): void;
    /**
     * Clear given timeout
     *
     * @param {number} timeout
     * @returns {void}
     */
    static clearTimeout(timeout: number): void;
    /**
     * Clear given nextTick
     *
     * @param {number} tick
     * @returns {void}
     */
    static clearNextTick(tick: number): void;
    /**
     * Clear given everyTick
     *
     * @param {number} tick
     * @returns {void}
     */
    static clearEveryTick(tick: number): void;
    /**
     * Convert given value to event name
     * e.g: myAwesomeEvent => my:awesome:event
     *
     * @param {string} value
     * @returns {string}
     */
    static convertToEventName(value: string): string;
    /**
     * Convert given value to camelCase
     *
     * @param {string} value
     * @returns {string}
     */
    static convertToCamelCase(value: string): string;
    /**
     * Add message to console
     *
     * @param messages
     */
    static log(...messages: any[]): void;
    /**
     * Add warning to console
     *
     * @param messages
     */
    static logWarning(...messages: any[]): void;
    /**
     * Add error to console
     *
     * @param messages
     */
    static logError(...messages: any[]): void;
    /**
     * Add loaded message to console
     *
     * @param messages
     */
    static logLoaded(...messages: any[]): void;
    /**
     * Add unloaded message to console
     *
     * @param messages
     */
    static logUnloaded(...messages: any[]): void;
    /**
     * Receive on event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOn(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Receive once event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOnce(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe from event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOff(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Emit event helper
     *
     * @param {string} eventName
     * @param args
     */
    static eventEmit(eventName: string, ...args: any[]): void;
}

declare class LoggerService {
    /**
     * Add info to console
     *
     * @param messages
     */
    info(...messages: any[]): void;
    /**
     * Add warning to console
     *
     * @param messages
     */
    warning(...messages: any[]): void;
    /**
     * Add error to console
     * @param messages
     */
    error(...messages: any[]): void;
    /**
     * Add starting message to console
     *
     * @param message
     */
    starting(message: string): void;
    /**
     * Add started message to console
     *
     * @param message
     */
    started(message: string): void;
}

declare class CommandService {
    /**
     * Contains all commands
     *
     * @type {Map<string, CommandModel>}
     * @private
     */
    private commands;
    /**
     * Contains the arguments for command
     *
     * @type {string[]}
     * @private
     */
    private cmdArgs;
    /**
     * Contains the prefix for commands
     *
     * @type {string}
     * @private
     */
    private prefix;
    /**
     * Add new command to commands array
     *
     * @param {string} cmd
     * @param {string} methodName
     * @param {string} target
     */
    add(cmd: string, methodName: string, target: string): void;
    /**
     * Run the command if exists
     *
     * @param {string} cmd
     */
    run(cmd: string): void;
    /**
     * Set the command prefix if default does not fit your needs
     *
     * @param {string} prefix
     */
    setPrefix(prefix: string): void;
    /**
     * Start consoleCommand listening process
     */
    start(): void;
    /**
     * Autostart command service
     *
     * @param {Function} done
     */
    autoStart(done: CallableFunction): void;
    /**
     * Set arguments for current console command call
     *
     * @param args
     * @private
     */
    private setArguments;
    /**
     * Run consoleCommand
     *
     * @param {string} cmd
     * @param args
     * @private
     */
    private consoleCommand;
}

declare class BaseEventService implements EventServiceInterface {
    /**
     * Contains all events
     *
     * @type {EventModel[]}
     */
    private events;
    /**
     * Contains all handlers for one time events
     *
     * @type {EntityHandleModel[]}
     * @private
     */
    private handlers;
    /**
     * Return all available listener types for handler decorators
     *
     * @returns {string[]}
     */
    protected get handlerTypes(): string[];
    /**
     * Return all available listener types for decorators
     *
     * @returns {string[]}
     * @private
     */
    private get availableDecoratorListenerTypes();
    /**
     * Autostart event service
     * @param {Function} done
     */
    autoStart(done: CallableFunction): void;
    /**
     * Add event to events array
     *
     * @param {string} type
     * @param {string} targetName
     * @param {string} methodName
     * @param options
     */
    add(type: string, targetName: string, methodName: string, options: ValidateOptionsModel): void;
    /**
     * Add new game entity handler to array
     *
     * @param {string} type
     * @param {string} targetName
     * @param {string} methodName
     * @param options
     * @private
     */
    addHandlerMethods(type: string, targetName: string, methodName: string, options: ValidateOptionsModel): void;
    /**
     * Receive event from server
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    on(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Receive once event from server
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    once(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe from server event
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    off(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Emit event inside server environment
     *
     * @param {string} eventName
     * @param args
     */
    emit(eventName: string, ...args: any[]): void;
    /**
     * Listen for game entity destroy
     *
     * @param {string} type
     * @param {EntityHandleModel[]} handlers
     * @private
     */
    protected listenHandlerForType<T>(type: string, handlers: EntityHandleModel[]): void;
    /**
     * Check and call given handlers
     *
     * @param {T} entity
     * @param {number} entityType
     * @param {EntityHandleModel[]} handlers
     * @param isMetaChange
     * @param {any[]} args
     * @private
     */
    protected handleMetaChangeMethods<T>(entity: T, entityType: number, handlers: EntityHandleModel[], isMetaChange?: boolean, ...args: any[]): void;
    /**
     * Check if given entity has given type
     *
     * @param {number} entityType
     * @param {string} type
     * @protected
     */
    protected isEntityType(entityType: number, type: number): boolean;
    /**
     * Start the entity handler
     *
     * @private
     */
    private startEntityHandle;
    /**
     * Return the handler for given type
     *
     * @param {string} type
     * @return {EntityHandleModel[]}
     * @private
     */
    private getHandler;
    /**
     * Start the base event service
     *
     * @private
     */
    private startBaseMethods;
}

declare abstract class BasePool<T, K = string | number> {
    /**
     * Contains the pool
     *
     * @type {Map<string|number, T>}
     * @protected
     */
    protected pool: Map<K, T>;
    /**
     * Return the pool size
     *
     * @return {number}
     */
    get size(): number;
    /**
     * Create new entity inside pool if not exists
     *
     * @param {K} identifier
     * @param {T} entity
     * @return {Map<string|number, T> | void}
     */
    add(identifier: K, entity: T): Map<K, T> | void;
    /**
     * Get entity from pool if exists
     *
     * @param {K} identifier
     * @return {T | void}
     */
    get(identifier: K): T | void;
    /**
     * Check if the pool has identifier
     *
     * @param {K} identifier
     * @return {boolean}
     */
    has(identifier: K): boolean;
    /**
     * Return all entries from pool
     *
     * @return {T[]}
     */
    entries(): T[];
    /**
     * Return all keys from pool
     *
     * @return {(K)[]}
     */
    keys(): (K)[];
    /**
     * Remove entity from pool if exists
     *
     * @param {K} identifier
     * @return {boolean}
     */
    remove(identifier: K): boolean;
    /**
     * Remove all entities from pool
     */
    removeAll(): void;
}

declare const FrameworkEvent: {
    EventService: {
        EmitGuiEvent: string;
        ServerEmitGui: string;
        GuiOn: string;
        GuiEmitServer: string;
    };
    Discord: {
        AuthDone: string;
    };
    Player: {
        SetRealTime: string;
    };
};

export { AccessTokenModel, After, AfterBootstrap, BaseEventService, BasePool, Before, Cast, Cmd, CommandModel, CommandService, DiscordConfigModel, DiscordEventModel, DiscordUserModel, EntityHandleModel, EventModel, EventServiceInterface, FrameworkEvent, HasMany, HasOne, JsonEntityModel, LoaderService, LoggerService, Module, ModuleOptionsDecoratorInterface, ModuleOptionsDecoratorModel, On, Once, QueueItemModel, QueueModel, StringResolver, UtilsService, ValidateOptionsModel, altLibRegister, castBooleanToString, castFromJson, castToBoolean, castToNumber, castToString, isNull, setDiscordApiServerPort, setupServerConfigPath, setupServerDatabaseEntities, setupWebviewRegistry, validateEventExistsAndPush };
