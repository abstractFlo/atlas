import '@abraham/reflection';
import { container, injectable, singleton, instanceCachingFactory } from 'tsyringe';
import { Subject, of } from 'rxjs';
import { takeLast, filter, delay, mergeMap } from 'rxjs/operators';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

var KEYS;
(function (KEYS) {
    KEYS["CONFIG"] = "json-entity:casting:config";
    KEYS["RELATIONS"] = "json-entity:casting:relations";
})(KEYS || (KEYS = {}));
var RELATION;
(function (RELATION) {
    RELATION[RELATION["HAS_ONE"] = 0] = "HAS_ONE";
    RELATION[RELATION["HAS_MANY"] = 1] = "HAS_MANY";
})(RELATION || (RELATION = {}));

/**
 * allow casting json properties from and to object
 * @param {CastConfig} config
 * @returns {(t: any, p: (string)) => void}
 * @constructor
 */
function Cast(config = { trim: true }) {
    return function (target, propertyKey) {
        config.property = config.property || propertyKey;
        config.trim = false !== config.trim;
        const propertiesConfig = Reflect.getMetadata(KEYS.CONFIG, target) || {};
        propertiesConfig[propertyKey] = config;
        Reflect.defineMetadata(KEYS.CONFIG, propertiesConfig, target);
    };
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
function HasMany(model) {
    return function (target, propertyKey) {
        const config = {
            type: RELATION.HAS_MANY,
            model
        };
        Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
    };
}
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
function HasOne(model) {
    return function (target, propertyKey) {
        const config = {
            type: RELATION.HAS_ONE,
            model
        };
        Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
    };
}

/**
 * get callback for easy null checks
 * @returns {(v: any) => boolean}
 */
function isNull() {
    return (v) => v === null;
}
/**
 * get callback for converting to boolean, accept bool or trueValue with default string '1'
 * @param {any} trueValue
 * @returns {(v: any) => boolean}
 */
function castToBoolean(trueValue = '1') {
    return (v) => v === true || v === trueValue;
}
/**
 * get callback for converting from boolean to string (default strings '0', '1')
 * @param {any} trueValue
 * @param {any} falseValue
 * @returns {(v: any) => string}
 */
function castBooleanToString(trueValue = '1', falseValue = '0') {
    return (v) => (true === v ? trueValue : falseValue);
}
/**
 * get callback for converting to number (float|int) or null
 * @param {boolean} keepNull
 * @returns {(v: any) => (number | null)}
 */
function castToNumber(keepNull = true) {
    return (v) => {
        if (keepNull && v === null) {
            return null;
        }
        if (typeof v === 'string') {
            v = v.replace(',', '.');
        }
        const number = Number(v);
        if (!Number.isNaN(number)) {
            return number;
        }
        return 0;
    };
}
/**
 * get callback for converting from json
 * @param {boolean} keepNull
 * @return {(v: any) => (object | null)}
 */
function castFromJson(keepNull = true) {
    return (v) => {
        if (keepNull && v === null) {
            return null;
        }
        try {
            if (typeof v === 'string') {
                return JSON.parse(v);
            }
            else if (typeof v === 'object' && v !== null) {
                return v;
            }
        }
        catch (e) {
            // will return {}
        }
        return {};
    };
}
/**
 * get callback for converting to string or null
 * @param {boolean} keepNull
 * @param {string} standard
 * @returns {(v: any) => (string | null)}
 */
function castToString(keepNull = true, standard = '') {
    return (v) => {
        if (keepNull && v === null) {
            return null;
        }
        if (v !== undefined && v !== null) {
            return String(v);
        }
        return standard;
    };
}

/**
 * automatic cast json to entity model
 */
class JsonEntityModel {
    /**
     * create relations
     * @param {IRelationInfo} relationInfo
     * @param json
     * @param {boolean} mapping [default:true]
     * @returns {JsonEntityModel | JsonEntityModel[] | undefined}
     */
    static createRelations(relationInfo, json, mapping = true) {
        if (!json) {
            return undefined;
        }
        switch (relationInfo.type) {
            case RELATION.HAS_ONE:
                return new relationInfo.model().cast(json, mapping);
            case RELATION.HAS_MANY:
                const items = [];
                for (const key of Object.keys(json)) {
                    items.push(new relationInfo.model().cast(json[key], mapping));
                }
                return items;
        }
    }
    /**
     * parse json data to model class based on @Cast decorator
     * @param {object | null} json
     * @param {boolean} mapping [default:true]
     * @returns {this}
     */
    cast(json, mapping = true) {
        const self = this;
        const properties = Reflect.getMetadata(KEYS.CONFIG, this) || {};
        if (null !== json) {
            for (const propertyKey of Object.keys(properties)) {
                const castConfig = properties[propertyKey];
                let castValue = json[mapping ? castConfig.property : propertyKey];
                const relationInfo = Reflect.getMetadata(KEYS.RELATIONS, this, propertyKey);
                if (relationInfo) {
                    castValue = JsonEntityModel.createRelations(relationInfo, castValue, mapping);
                }
                if (castConfig.trim && typeof castValue === 'string') {
                    castValue = castValue.trim();
                }
                if (castValue !== undefined) {
                    self[propertyKey] = castValue;
                }
            }
        }
        return this;
    }
}

class ModuleOptionsDecoratorModel extends JsonEntityModel {
    constructor() {
        super(...arguments);
        this.imports = [];
    }
}
__decorate([
    Cast(),
    __metadata("design:type", Array)
], ModuleOptionsDecoratorModel.prototype, "imports", void 0);

class QueueModel extends JsonEntityModel {
    constructor() {
        super(...arguments);
        this.before = new Map();
        this.beforeCount = new Subject();
        this.after = new Map();
        this.afterCount = new Subject();
        this.afterBootstrap = new Map();
        this.afterBootstrapCount = new Subject();
    }
}
__decorate([
    Cast(),
    __metadata("design:type", Map)
], QueueModel.prototype, "before", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Subject)
], QueueModel.prototype, "beforeCount", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Map)
], QueueModel.prototype, "after", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Subject)
], QueueModel.prototype, "afterCount", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Map)
], QueueModel.prototype, "afterBootstrap", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Subject)
], QueueModel.prototype, "afterBootstrapCount", void 0);

class QueueItemModel extends JsonEntityModel {
    constructor() {
        super(...arguments);
        this.doneCheckIntervalTime = 5000;
    }
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], QueueItemModel.prototype, "target", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], QueueItemModel.prototype, "methodName", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], QueueItemModel.prototype, "doneCheckIntervalTime", void 0);

class EventModel extends JsonEntityModel {
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], EventModel.prototype, "type", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], EventModel.prototype, "eventName", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], EventModel.prototype, "methodName", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], EventModel.prototype, "targetName", void 0);

class CommandModel extends JsonEntityModel {
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], CommandModel.prototype, "target", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], CommandModel.prototype, "methodName", void 0);

var UtilsService_1;
let UtilsService = UtilsService_1 = class UtilsService {
    /**
     * Auto clear setTimeout
     *
     * @param {Function} listener
     * @param {number} duration
     */
    static setTimeout(listener, duration) {
        const setTimeoutFn = container.resolve('alt.setTimeout');
        const clearTimeoutFn = container.resolve('alt.clearTimeout');
        const timeout = setTimeoutFn(async () => {
            await listener();
            clearTimeoutFn(timeout);
        }, duration);
    }
    /**
     * Run an interval
     *
     * @param {Function} listener
     * @param {number} milliseconds
     * @returns {number}
     */
    static setInterval(listener, milliseconds) {
        const setIntervalFn = container.resolve('alt.setInterval');
        return setIntervalFn(listener, milliseconds);
    }
    /**
     * Run an everyTick Timer
     *
     * @param {Function} listener
     * @returns {number}
     */
    static everyTick(listener) {
        const everyTickFn = container.resolve('alt.everyTick');
        return everyTickFn(listener);
    }
    /**
     * Run an interval and clear after duration
     *
     * @param {Function} listener
     * @param {number} milliseconds
     * @param intervalDuration
     * @returns {number}
     */
    static autoClearInterval(listener, milliseconds, intervalDuration) {
        const setIntervalFn = container.resolve('alt.setInterval');
        const clearIntervalFn = container.resolve('alt.clearInterval');
        const interval = setIntervalFn(listener, milliseconds);
        UtilsService_1.setTimeout(() => {
            clearIntervalFn(interval);
        }, intervalDuration);
    }
    /**
     * Next tick
     * @param {Function} listener
     */
    static nextTick(listener) {
        const nextTickFn = container.resolve('alt.nextTick');
        nextTickFn(listener);
    }
    /**
     * Clear given interval
     *
     * @param {number} interval
     * @returns {void}
     */
    static clearInterval(interval) {
        const clearIntervalFn = container.resolve('alt.clearInterval');
        return clearIntervalFn(interval);
    }
    /**
     * Clear given timeout
     *
     * @param {number} timeout
     * @returns {void}
     */
    static clearTimeout(timeout) {
        const clearTimeoutFn = container.resolve('alt.clearTimeout');
        return clearTimeoutFn(timeout);
    }
    /**
     * Clear given nextTick
     *
     * @param {number} tick
     * @returns {void}
     */
    static clearNextTick(tick) {
        const clearNextTickFn = container.resolve('alt.clearNextTick');
        return clearNextTickFn(tick);
    }
    /**
     * Clear given everyTick
     *
     * @param {number} tick
     * @returns {void}
     */
    static clearEveryTick(tick) {
        const clearEveryTick = container.resolve('alt.clearEveryTick');
        return clearEveryTick(tick);
    }
    /**
     * Convert given value to event name
     * e.g: myAwesomeEvent => my:awesome:event
     *
     * @param {string} value
     * @returns {string}
     */
    static convertToEventName(value) {
        return value
            .replace(/([a-zA-Z])(?=[A-Z])/g, '$1:')
            .toLowerCase();
    }
    /**
     * Convert given value to camelCase
     *
     * @param {string} value
     * @returns {string}
     */
    static convertToCamelCase(value) {
        return value.replace(/[:]/g, ' ')
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0
            ? word.toLowerCase()
            : word.toUpperCase())
            .replace(/\s+/g, '');
    }
    /**
     * Add message to console
     *
     * @param messages
     */
    static log(...messages) {
        const log = container.resolve('alt.log');
        log(...messages);
    }
    /**
     * Add warning to console
     *
     * @param messages
     */
    static logWarning(...messages) {
        const log = container.resolve('alt.logWarning');
        log(...messages);
    }
    /**
     * Add error to console
     *
     * @param messages
     */
    static logError(...messages) {
        const log = container.resolve('alt.logError');
        log(...messages);
    }
    /**
     * Add loaded message to console
     *
     * @param messages
     */
    static logLoaded(...messages) {
        messages.forEach((message) => UtilsService_1.log(`Loaded ~lg~${message}~w~`));
    }
    /**
     * Add unloaded message to console
     *
     * @param messages
     */
    static logUnloaded(...messages) {
        messages.forEach((message) => UtilsService_1.log(`Unloaded ~lg~${message}~w~`));
    }
    /**
     * Receive on event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOn(eventName, listener) {
        const eventHandler = container.resolve('alt.on');
        eventHandler(eventName, listener);
    }
    /**
     * Receive once event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOnce(eventName, listener) {
        const eventHandler = container.resolve('alt.once');
        eventHandler(eventName, listener);
    }
    /**
     * Unsubscribe from event helper
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    static eventOff(eventName, listener) {
        const eventHandler = container.resolve('alt.off');
        eventHandler(eventName, listener);
    }
    /**
     * Emit event helper
     *
     * @param {string} eventName
     * @param args
     */
    static eventEmit(eventName, ...args) {
        const eventHandler = container.resolve('alt.emit');
        eventHandler(eventName, ...args);
    }
};
UtilsService = UtilsService_1 = __decorate([
    injectable()
], UtilsService);

let LoaderService = class LoaderService {
    constructor() {
        /**
         * Contains the complete loading queue
         *
         * @type {QueueModel}
         * @private
         */
        this.queue = new QueueModel();
        /**
         * Contains the beforeCount observable
         *
         * @type {Observable<number>}
         * @private
         */
        this.beforeCount$ = this.queue.beforeCount.asObservable();
        /**
         * Contains the afterCount observable
         *
         * @type {Observable<number>}
         * @private
         */
        this.afterCount$ = this.queue.afterCount.asObservable();
        /**
         * Contains the afterBootstrapCount observable
         *
         * @type {Observable<number>}
         * @private
         */
        this.afterBootstrapCount$ = this.queue.afterBootstrapCount.asObservable();
        /**
         * Contains the starting subject for booting
         *
         * @type {Subject<boolean>}
         * @private
         */
        this.startingSubject = new Subject();
        /**
         * Contains the starting observable with default pipe
         * @type {Observable<boolean>}
         * @private
         */
        this.startingSubject$ = this.startingSubject
            .asObservable()
            .pipe(takeLast(1), filter((value) => value));
        /**
         * Contains the finish subject to declare finish loading state
         *
         * @type {Subject<boolean>}
         * @private
         */
        this.finishSubject$ = new Subject();
        /**
         * Check if loader run on serverSide
         *
         * @type {boolean}
         * @private
         */
        this.isServerSide = typeof process !== 'undefined';
    }
    /**
     * Return the loader queue status
     *
     * @returns {string}
     */
    debug() {
        return JSON.stringify({
            loader: {
                beforeQueueWaiting: this.queue.before.size,
                afterQueueWaiting: this.queue.after.size,
                afterBootstrapQueueWaiting: this.queue.afterBootstrap.size
            }
        }, null, 4);
    }
    /**
     * Do something after finish booting
     *
     * @param {(...args: any[]) => void} callback
     */
    afterComplete(callback) {
        this.finishSubject$
            .asObservable()
            .pipe(filter((isFinished) => isFinished))
            .subscribe(callback);
    }
    /**
     * Add new resolver to queue
     *
     * @param {"before" | "after" | "afterBootstrap"} type
     * @param key
     * @param target
     * @param doneCheckIntervalTime
     */
    add(type, key, target, doneCheckIntervalTime) {
        const queueItemModel = new QueueItemModel().cast({ target, methodName: key, doneCheckIntervalTime });
        this.queue[type].set(`${target}_${key}`, queueItemModel);
    }
    /**
     * Bootstrap complete system
     *
     * @param {InjectionToken} target
     * @returns {LoaderService}
     */
    bootstrap(target) {
        container.afterResolution(target, (token, result) => {
            this.resolve();
            UtilsService.setTimeout(() => {
                this.startingSubject.next(true);
                this.startingSubject.complete();
            }, 0);
        }, { frequency: 'Once' });
        this.beforeCount$
            .pipe(takeLast(1))
            .subscribe(() => this.processWork(this.queue.after, this.queue.afterCount));
        this.afterCount$
            .pipe(takeLast(1))
            .subscribe(() => this.processWork(this.queue.afterBootstrap, this.queue.afterBootstrapCount));
        this.afterBootstrapCount$
            .pipe(takeLast(1))
            .subscribe(() => {
            this.finishSubject$.next(true);
            this.finishSubject$.complete();
        });
        // Workaround for server side
        if (this.isServerSide) {
            let entities;
            try {
                entities = container.resolve('server.database.entities');
            }
            catch {
                entities = [];
            }
            this.startingSubject$ = this.startingSubject$.pipe(delay(125), mergeMap(() => {
                if (entities.length) {
                    const dbService = container.resolve('DatabaseService');
                    return dbService.initialize();
                }
                return of(true);
            }));
        }
        this.startingSubject$.subscribe(() => this.processWork(this.queue.before, this.queue.beforeCount));
        container.resolve(target);
        return this;
    }
    /**
     * Resolve all from queue
     */
    resolve() {
        this.queue.beforeCount.next(this.queue.before.size);
        this.queue.afterCount.next(this.queue.after.size);
    }
    /**
     * Done callback handler for before and after methods
     *
     * @param {Map<string, QueueItemModel>} property
     * @param {Subject<number>} propertyCount
     * @param doneCheckIntervalId
     * @param {string | null} key
     * @private
     */
    doneCallback(property, propertyCount, key = null, doneCheckIntervalId) {
        if (doneCheckIntervalId) {
            UtilsService.clearInterval(doneCheckIntervalId);
        }
        if (key !== null) {
            property.delete(key);
        }
        propertyCount.next(property.size);
        if (property.size === 0) {
            propertyCount.complete();
        }
    }
    /**
     * Process the queue for given property
     *
     * @param {Map<string, any>} property
     * @param {Subject<number>} propertyCount
     * @private
     */
    processWork(property, propertyCount) {
        if (property.size === 0) {
            this.doneCallback(property, propertyCount);
        }
        else {
            propertyCount
                .pipe(filter((size) => size !== 0))
                .subscribe(() => this.processQueueItem(property, propertyCount));
            this.processQueueItem(property, propertyCount);
        }
    }
    /**
     * Process one item from queue
     *
     * @param {Map<string, QueueItemModel>} property
     * @param {Subject<number>} propertyCount
     * @return {Promise<void>}
     * @private
     */
    async processQueueItem(property, propertyCount) {
        const nextItem = property.values().next().value;
        const nextKey = property.keys().next().value;
        if (nextItem !== undefined) {
            const instance = container.resolve(nextItem.target);
            const doneCheckIntervalId = UtilsService.setInterval(() => {
                const [module, method] = nextKey.split('_');
                UtilsService.log(`~lb~[Module: ${module}]~y~{Method: ${method}}~w~ - ~r~Have you maybe forgotten the done callback?~w~`);
                UtilsService.log(`~y~If not, increase decorator runtime parameter ~w~[yours: ${nextItem.doneCheckIntervalTime}ms] ~lg~[default: 5000ms] ~w~`);
                UtilsService.clearInterval(doneCheckIntervalId);
            }, nextItem.doneCheckIntervalTime);
            const doneCallback = this.doneCallback.bind(this, property, propertyCount, nextKey, doneCheckIntervalId);
            const method = instance[nextItem.methodName].bind(instance, doneCallback);
            await method();
        }
    }
};
LoaderService = __decorate([
    singleton()
], LoaderService);

let LoggerService = class LoggerService {
    /**
     * Add info to console
     *
     * @param messages
     */
    info(...messages) {
        UtilsService.log(messages);
    }
    /**
     * Add warning to console
     *
     * @param messages
     */
    warning(...messages) {
        UtilsService.logWarning(messages);
    }
    /**
     * Add error to console
     * @param messages
     */
    error(...messages) {
        UtilsService.logError(messages);
    }
    /**
     * Add starting message to console
     *
     * @param message
     */
    starting(message) {
        UtilsService.log(`Starting ~y~${message}~w~`);
    }
    /**
     * Add started message to console
     *
     * @param message
     */
    started(message) {
        UtilsService.log(`Started ~lg~${message}~w~`);
    }
};
LoggerService = __decorate([
    injectable()
], LoggerService);

/**
 * Register class as string injection token
 *
 * @param {constructor<any>} constructor
 * @returns {constructor<any>}
 * @constructor
 */
const StringResolver = (constructor) => {
    container.register(constructor.name, { useFactory: instanceCachingFactory(c => c.resolve(constructor)) });
    return constructor;
};

class DiscordConfigModel extends JsonEntityModel {
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "client_id", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "client_secret", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "bot_secret", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "server_id", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "redirect_url", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "auth_url", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "auth_token_url", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordConfigModel.prototype, "user_me_url", void 0);
__decorate([
    Cast(),
    __metadata("design:type", Object)
], DiscordConfigModel.prototype, "presences", void 0);

class DiscordEventModel extends JsonEntityModel {
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordEventModel.prototype, "eventName", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordEventModel.prototype, "targetName", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordEventModel.prototype, "methodName", void 0);

class DiscordUserModel extends JsonEntityModel {
    constructor() {
        super(...arguments);
        this.avatarUrl = '/images/128.jpg';
    }
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "id", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "username", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "avatar", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "discriminator", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], DiscordUserModel.prototype, "public_flags", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], DiscordUserModel.prototype, "flags", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "locale", void 0);
__decorate([
    Cast({ from: castToBoolean() }),
    __metadata("design:type", Boolean)
], DiscordUserModel.prototype, "mfa_enabled", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], DiscordUserModel.prototype, "avatarUrl", void 0);

class AccessTokenModel extends JsonEntityModel {
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "access_token", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "token_type", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], AccessTokenModel.prototype, "expires_in", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "refresh_token", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "scope", void 0);

class ValidateOptionsModel extends JsonEntityModel {
    constructor() {
        super(...arguments);
        this.eventAddTo = 'base';
    }
}
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], ValidateOptionsModel.prototype, "eventAddTo", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], ValidateOptionsModel.prototype, "entity", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], ValidateOptionsModel.prototype, "metaKey", void 0);
__decorate([
    Cast({ from: castToNumber() }),
    __metadata("design:type", Number)
], ValidateOptionsModel.prototype, "colShapeType", void 0);
__decorate([
    Cast({ from: castToString() }),
    __metadata("design:type", String)
], ValidateOptionsModel.prototype, "name", void 0);

class EntityHandleModel extends EventModel {
}
__decorate([
    HasOne(ValidateOptionsModel),
    Cast(),
    __metadata("design:type", ValidateOptionsModel)
], EntityHandleModel.prototype, "options", void 0);

let BaseEventService = class BaseEventService {
    constructor() {
        /**
         * Contains all events
         *
         * @type {EventModel[]}
         */
        this.events = [];
        /**
         * Contains all handlers for one time events
         *
         * @type {EntityHandleModel[]}
         * @private
         */
        this.handlers = [];
    }
    /**
     * Return all available listener types for handler decorators
     *
     * @returns {string[]}
     */
    get handlerTypes() {
        return [
            'syncedMetaChange',
            'streamSyncedMetaChange',
            'gameEntityCreate',
            'gameEntityDestroy',
            'entityEnterColshape',
            'entityLeaveColshape'
        ];
    }
    /**
     * Return all available listener types for decorators
     *
     * @returns {string[]}
     * @private
     */
    get availableDecoratorListenerTypes() {
        return [
            'on',
            'once',
            'onGui',
            'onServer',
            'onClient',
            'onceServer',
            'onceClient'
        ];
    }
    /**
     * Autostart event service
     * @param {Function} done
     */
    autoStart(done) {
        if (this.events.length) {
            UtilsService.log('Starting ~y~EventService Decorator~w~');
            this.startBaseMethods();
            UtilsService.log('Started ~lg~EventService Decorator~w~');
        }
        if (this.handlers.length) {
            UtilsService.log('Starting ~y~EntityEvent Handle Decorator~w~');
            this.startEntityHandle();
            UtilsService.log('Started ~lg~EntityEvent Handle Decorator~w~');
        }
        done();
    }
    /**
     * Add event to events array
     *
     * @param {string} type
     * @param {string} targetName
     * @param {string} methodName
     * @param options
     */
    add(type, targetName, methodName, options) {
        if (this.availableDecoratorListenerTypes.includes(type)) {
            const event = new EventModel().cast({ type, eventName: options.name, targetName, methodName });
            this.events.push(event);
        }
    }
    /**
     * Add new game entity handler to array
     *
     * @param {string} type
     * @param {string} targetName
     * @param {string} methodName
     * @param options
     * @private
     */
    addHandlerMethods(type, targetName, methodName, options) {
        if (this.handlerTypes.includes(type)) {
            const entityHandle = new EntityHandleModel().cast({
                type,
                targetName,
                methodName,
                options
            });
            this.handlers.push(entityHandle);
        }
    }
    /**
     * Receive event from server
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    on(eventName, listener) {
        UtilsService.eventOn(eventName, listener);
    }
    /**
     * Receive once event from server
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    once(eventName, listener) {
        UtilsService.eventOnce(eventName, listener);
    }
    /**
     * Unsubscribe from server event
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    off(eventName, listener) {
        UtilsService.eventOff(eventName, listener);
    }
    /**
     * Emit event inside server environment
     *
     * @param {string} eventName
     * @param args
     */
    emit(eventName, ...args) {
        UtilsService.eventEmit(eventName, ...args);
    }
    /**
     * Listen for game entity destroy
     *
     * @param {string} type
     * @param {EntityHandleModel[]} handlers
     * @private
     */
    listenHandlerForType(type, handlers) { }
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
    handleMetaChangeMethods(entity, entityType, handlers, isMetaChange = false, ...args) {
        handlers.forEach((handler) => {
            // Stop it not the same type
            const hasSameType = this.isEntityType(entityType, handler.options.entity);
            if (!hasSameType)
                return;
            const hasMetaKey = handler.options.metaKey !== undefined && args[0] === handler.options.metaKey;
            const instances = container.resolveAll(handler.targetName);
            instances.forEach((instance) => {
                const method = instance[handler.methodName].bind(instance);
                if (isMetaChange && hasMetaKey) {
                    args.shift();
                }
                method(entity, ...args);
            });
        });
    }
    /**
     * Check if given entity has given type
     *
     * @param {number} entityType
     * @param {string} type
     * @protected
     */
    isEntityType(entityType, type) {
        return entityType === type;
    }
    /**
     * Start the entity handler
     *
     * @private
     */
    startEntityHandle() {
        this.handlerTypes.forEach((type) => {
            const handler = this.getHandler(type);
            if (handler.length) {
                this.listenHandlerForType(type, handler);
            }
        });
    }
    /**
     * Return the handler for given type
     *
     * @param {string} type
     * @return {EntityHandleModel[]}
     * @private
     */
    getHandler(type) {
        return this.handlers.filter((handle) => handle.type === type);
    }
    /**
     * Start the base event service
     *
     * @private
     */
    startBaseMethods() {
        this.events.forEach((event) => {
            const instances = container.resolveAll(event.targetName);
            // Need to be rewrite the typings
            //@ts-ignore
            const internalMethod = this[event.type];
            instances.forEach(async (instance) => {
                if (instance[event.methodName]) {
                    const method = internalMethod.bind(this, event.eventName, instance[event.methodName].bind(instance));
                    await method();
                }
            });
        });
    }
};
BaseEventService = __decorate([
    StringResolver,
    singleton()
], BaseEventService);

let CommandService = class CommandService {
    constructor() {
        /**
         * Contains all commands
         *
         * @type {Map<string, CommandModel>}
         * @private
         */
        this.commands = new Map();
        /**
         * Contains the arguments for command
         *
         * @type {string[]}
         * @private
         */
        this.cmdArgs = [];
        /**
         * Contains the prefix for commands
         *
         * @type {string}
         * @private
         */
        this.prefix = '/';
    }
    /**
     * Add new command to commands array
     *
     * @param {string} cmd
     * @param {string} methodName
     * @param {string} target
     */
    add(cmd, methodName, target) {
        if (this.commands.has(cmd)) {
            return;
        }
        const command = new CommandModel().cast({ methodName, target });
        this.commands.set(cmd, command);
    }
    /**
     * Run the command if exists
     *
     * @param {string} cmd
     */
    run(cmd) {
        let command = cmd.slice(this.prefix.length);
        if (cmd.startsWith(this.prefix) && this.commands.has(command)) {
            const commandEntry = this.commands.get(command);
            const instances = container.resolveAll(commandEntry.target);
            instances.forEach((instance) => {
                if (instance[commandEntry.methodName]) {
                    instance[commandEntry.methodName].bind(instance).apply(this, this.cmdArgs);
                }
            });
        }
    }
    /**
     * Set the command prefix if default does not fit your needs
     *
     * @param {string} prefix
     */
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    /**
     * Start consoleCommand listening process
     */
    start() {
        const eventService = container.resolve(BaseEventService);
        eventService.on('consoleCommand', this.consoleCommand.bind(this));
    }
    /**
     * Autostart command service
     *
     * @param {Function} done
     */
    autoStart(done) {
        if (this.commands.size > 0) {
            UtilsService.log('Starting ~y~CommandService Decorator~w~');
            this.start();
            UtilsService.log('Started ~lg~CommandService Decorator~w~');
        }
        done();
    }
    /**
     * Set arguments for current console command call
     *
     * @param args
     * @private
     */
    setArguments(args) {
        this.cmdArgs = args;
    }
    /**
     * Run consoleCommand
     *
     * @param {string} cmd
     * @param args
     * @private
     */
    consoleCommand(cmd, ...args) {
        this.setArguments(args);
        this.run(cmd);
    }
};
CommandService = __decorate([
    StringResolver,
    singleton()
], CommandService);

const loaderService = container.resolve(LoaderService);
container.afterResolution('EventService', () => {
    loaderService.add('afterBootstrap', 'autoStart', 'EventService');
}, { frequency: 'Once' });
container.afterResolution(CommandService, () => {
    loaderService.add('afterBootstrap', 'autoStart', 'CommandService');
}, { frequency: 'Once' });

function altLibRegister(lib) {
    // Timers
    container.register('alt.setTimeout', { useValue: lib.setTimeout });
    container.register('alt.clearTimeout', { useValue: lib.clearTimeout });
    container.register('alt.nextTick', { useValue: lib.nextTick });
    container.register('alt.clearNextTick', { useValue: lib.clearNextTick });
    container.register('alt.setInterval', { useValue: lib.setInterval });
    container.register('alt.clearInterval', { useValue: lib.clearInterval });
    container.register('alt.everyTick', { useValue: lib.everyTick });
    container.register('alt.clearEveryTick', { useValue: lib.clearEveryTick });
    // Logs
    container.register('alt.log', { useValue: lib.log });
    container.register('alt.logWarning', { useValue: lib.logWarning });
    container.register('alt.logError', { useValue: lib.logError });
    // EventEmitter
    container.register('alt.on', { useValue: lib.on });
    container.register('alt.once', { useValue: lib.once });
    container.register('alt.off', { useValue: lib.off });
    container.register('alt.emit', { useValue: lib.emit });
}
function setupServerConfigPath(path) {
    container.register('server.config.path.file', { useValue: path });
}
function setupServerDatabaseEntities(entities) {
    container.register('server.database.entities', { useValue: entities });
}
function setupWebviewRegistry(url, routeToEventName) {
    container.register('alt.webview.url', { useValue: url });
    container.register('alt.webview.routeTo.eventName', { useValue: routeToEventName });
}
function setDiscordApiServerPort(port) {
    container.register('discord.express.port', { useValue: port });
}

let ModuleLoaderService = class ModuleLoaderService {
    constructor() {
        /**
         * All entities added by module decorator
         *
         * @type {Map<string, string[]>}
         * @private
         */
        this.pool = new Map();
    }
    /**
     * Add new entity name to pool to prevent multiple load and register same script
     *
     * @param {constructor<any>} entity
     */
    add(entity) {
        this.addToPool(entity);
        this.registerIfNotExists(entity);
        this.resolve(entity);
    }
    /**
     * Add entity to pool
     *
     * @param {constructor<any>} entity
     * @private
     */
    addToPool(entity) {
        if (!this.pool.has(entity.name)) {
            this.pool.set(entity.name, [entity.name]);
            if (entity.name.endsWith('Module')) {
                UtilsService.logLoaded(entity.name);
            }
        }
        else {
            const poolEntry = this.pool.get(entity.name);
            this.pool.set(entity.name, [...poolEntry, entity.name]);
        }
    }
    /**
     * Register entity if not exists as string
     *
     * @param {constructor<any>} entity
     * @private
     */
    registerIfNotExists(entity) {
        if (container.isRegistered(entity.name))
            return;
        container.register(entity.name, { useFactory: instanceCachingFactory(c => c.resolve(entity)) });
    }
    /**
     * Resolve all files if they not module
     * @param {constructor<any>} entity
     * @private
     */
    resolve(entity) {
        if (entity.name.endsWith('Module'))
            return;
        container.resolve(entity.name);
    }
};
ModuleLoaderService = __decorate([
    singleton()
], ModuleLoaderService);

/**
 * Register class as string injection token and load all import dependencies
 *
 * @param {ModuleOptionsDecoratorInterface} options
 * @returns {ClassDecorator}
 * @constructor
 */
function Module(options) {
    const moduleLoaderService = container.resolve(ModuleLoaderService);
    // Load imports and Components
    if (options) {
        if (options.imports) {
            options.imports.forEach((m) => moduleLoaderService.add(m));
        }
        if (options.components) {
            options.components.forEach((m) => moduleLoaderService.add(m));
        }
    }
    return (constructor) => {
        moduleLoaderService.add(constructor);
        return constructor;
    };
}

/**
 * Add method to before queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
const Before = (doneCheckIntervalTime) => {
    return (target, propertyKey, descriptor) => {
        return validateLoaderAndPush(target, propertyKey, 'before', descriptor, doneCheckIntervalTime);
    };
};
/**
 * Add method to after queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
const After = (doneCheckIntervalTime) => {
    return (target, propertyKey, descriptor) => {
        return validateLoaderAndPush(target, propertyKey, 'after', descriptor, doneCheckIntervalTime);
    };
};
/**
 * Add method to afterBootstrap queue
 *
 * @returns {PropertyDescriptor | void}
 * @constructor
 * @param doneCheckIntervalTime
 */
const AfterBootstrap = (doneCheckIntervalTime) => {
    return (target, propertyKey, descriptor) => {
        return validateLoaderAndPush(target, propertyKey, 'afterBootstrap', descriptor, doneCheckIntervalTime);
    };
};
/**
 * Helper for adding method to specific queue
 *
 * @param {Object} target
 * @param {string} propertyKey
 * @param {"before" | "after" | "afterBootstrap"} type
 * @param {PropertyDescriptor} descriptor
 * @param doneCheckIntervalTime
 * @returns {PropertyDescriptor | void}
 */
function validateLoaderAndPush(target, propertyKey, type, descriptor, doneCheckIntervalTime) {
    const loaderService = container.resolve(LoaderService);
    const original = descriptor.value;
    descriptor.value = function (...args) {
        return original.apply(this, args);
    };
    loaderService.add(type, propertyKey, target.constructor.name, doneCheckIntervalTime);
    return descriptor;
}

/**
 * Add on event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
const On = (name) => {
    return (target, propertyKey, descriptor) => {
        const eventName = name || propertyKey;
        const options = new ValidateOptionsModel().cast({ name: eventName });
        return validateEventExistsAndPush(target, 'on', propertyKey, descriptor, options);
    };
};
/**
 * Add once event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
const Once = (name) => {
    return (target, propertyKey, descriptor) => {
        const eventName = name || propertyKey;
        const options = new ValidateOptionsModel().cast({ name: eventName });
        return validateEventExistsAndPush(target, 'once', propertyKey, descriptor, options);
    };
};
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
function validateEventExistsAndPush(target, type, propertyKey, descriptor, options) {
    const eventService = container.resolve('EventService');
    const original = descriptor.value;
    descriptor.value = function (...args) {
        return original.apply(this, args);
    };
    switch (options.eventAddTo) {
        case 'gameEntity':
        case 'metaChange':
        case 'colShape':
            eventService.addHandlerMethods(type, target.constructor.name, propertyKey, options);
            break;
        default:
            eventService.add(type, target.constructor.name, propertyKey, options);
            break;
    }
    return descriptor;
}

/**
 * Register command inside command.service
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
const Cmd = (name) => {
    return (target, propertyKey, descriptor) => {
        const commandName = name || propertyKey;
        const commandService = container.resolve(CommandService);
        const original = descriptor.value;
        descriptor.value = function (...args) {
            return original.apply(this, args);
        };
        commandService.add(commandName, propertyKey, target.constructor.name);
        return descriptor;
    };
};

class BasePool {
    constructor() {
        /**
         * Contains the pool
         *
         * @type {Map<string|number, T>}
         * @protected
         */
        this.pool = new Map();
    }
    /**
     * Return the pool size
     *
     * @return {number}
     */
    get size() {
        return this.pool.size;
    }
    /**
     * Create new entity inside pool if not exists
     *
     * @param {K} identifier
     * @param {T} entity
     * @return {Map<string|number, T> | void}
     */
    add(identifier, entity) {
        if (!this.has(identifier)) {
            this.pool.set(identifier, entity);
        }
    }
    /**
     * Get entity from pool if exists
     *
     * @param {K} identifier
     * @return {T | void}
     */
    get(identifier) {
        if (this.has(identifier)) {
            return this.pool.get(identifier);
        }
    }
    /**
     * Check if the pool has identifier
     *
     * @param {K} identifier
     * @return {boolean}
     */
    has(identifier) {
        return this.pool.has(identifier);
    }
    /**
     * Return all entries from pool
     *
     * @return {T[]}
     */
    entries() {
        return Array.from(this.pool.values());
    }
    /**
     * Return all keys from pool
     *
     * @return {(K)[]}
     */
    keys() {
        return Array.from(this.pool.keys());
    }
    /**
     * Remove entity from pool if exists
     *
     * @param {K} identifier
     * @return {boolean}
     */
    remove(identifier) {
        return this.pool.delete(identifier);
    }
    /**
     * Remove all entities from pool
     */
    removeAll() {
        this.pool.clear();
    }
}

const FrameworkEvent = {
    EventService: {
        EmitGuiEvent: 'event:emit:gui:event',
        ServerEmitGui: 'server:emit:gui',
        GuiOn: 'gui:on',
        GuiEmitServer: 'gui:emit:server'
    },
    Discord: {
        AuthDone: 'express:discordUser:accessDone'
    },
    Player: {
        SetRealTime: 'player:set:realtime'
    }
};

export { AccessTokenModel, After, AfterBootstrap, BaseEventService, BasePool, Before, Cast, Cmd, CommandModel, CommandService, DiscordConfigModel, DiscordEventModel, DiscordUserModel, EntityHandleModel, EventModel, FrameworkEvent, HasMany, HasOne, JsonEntityModel, LoaderService, LoggerService, Module, ModuleOptionsDecoratorModel, On, Once, QueueItemModel, QueueModel, StringResolver, UtilsService, ValidateOptionsModel, altLibRegister, castBooleanToString, castFromJson, castToBoolean, castToNumber, castToString, isNull, setDiscordApiServerPort, setupServerConfigPath, setupServerDatabaseEntities, setupWebviewRegistry, validateEventExistsAndPush };
