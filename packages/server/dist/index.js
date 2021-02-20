import '@abraham/reflection';
import { container, singleton, injectable } from 'tsyringe';
import { BaseEventService, FrameworkEvent, StringResolver, AccessTokenModel, DiscordUserModel, DiscordConfigModel, UtilsService, DiscordEventModel, LoggerService, LoaderService, ValidateOptionsModel, validateEventExistsAndPush } from '@abstractflo/shared';
import { emitClient, offClient, onClient, onceClient, Player, Colshape } from 'alt-server';
import { join } from 'path';
import { get, set } from 'lodash';
import { readJSONSync } from 'fs-extra';
import sjcl from 'sjcl';
import { URLSearchParams } from 'url';
import { from, Observable, defer } from 'rxjs';
import axios from 'axios';
import { map, share, filter, mergeMap, tap } from 'rxjs/operators';
import { Client } from 'discord.js';
import { Get, Controller, ClassMiddleware, Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';

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

let EventService = class EventService extends BaseEventService {
    /**
     * Emit event to client
     *
     * @param {Player | null} player
     * @param {string} eventName
     * @param args
     */
    emitClient(player, eventName, ...args) {
        emitClient(player, eventName, ...args);
    }
    /**
     * Emit event to gui use client as bridge
     *
     * @param {Player | null} player
     * @param {string} eventName
     * @param args
     */
    emitGui(player, eventName, ...args) {
        emitClient(player, FrameworkEvent.EventService.ServerEmitGui, eventName, ...args);
    }
    /**
     * Unsubscribe from client event
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    offClient(eventName, listener) {
        offClient(eventName, listener);
    }
    /**
     * Receive event from client
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    onClient(eventName, listener) {
        onClient(eventName, listener);
    }
    /**
     * Receive once event from client
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    onceClient(eventName, listener) {
        onceClient(eventName, listener);
    }
    /**
     * Listen handlers for given type
     *
     * @param {string} type
     * @param {EntityHandleModel[]} handlers
     * @protected
     */
    listenHandlerForType(type, handlers) {
        this.on(type, (...args) => {
            const entity = args.shift();
            switch (true) {
                case ['syncedMetaChange', 'streamSyncedMetaChange'].includes(type):
                    this.handleMetaChangeMethods(entity, entity.type, handlers, true, ...args);
                    break;
                case ['entityEnterColshape', 'entityLeaveColshape'].includes(type):
                    this.handleColShapeMethods(entity, handlers, args.shift(), ...args);
                    break;
            }
        });
    }
    /**
     * Handle all colShape events
     *
     * @param {Colshape} colShape
     * @param {EntityHandleModel[]} handlers
     * @param entity
     * @param args
     * @protected
     */
    handleColShapeMethods(colShape, handlers, entity, ...args) {
        handlers.forEach((handler) => {
            // Stop if not the same colshape type
            const hasSameType = colShape.colshapeType === handler.options.colShapeType;
            if (!hasSameType)
                return;
            // Stop if name is set and not the same
            const hasSameName = handler.options.name !== undefined && colShape.name === handler.options.name;
            if (!hasSameName)
                return;
            // Stop if entity is set and not the same
            const hasSameEntity = handler.options.entity !== undefined && this.isEntityType(entity.type, handler.options.entity);
            if (!hasSameEntity)
                return;
            const instances = container.resolveAll(handler.targetName);
            instances.forEach((instance) => {
                const method = instance[handler.methodName].bind(instance);
                method(entity, ...args);
            });
        });
    }
};
EventService = __decorate([
    StringResolver,
    singleton()
], EventService);

let ConfigService = class ConfigService {
    constructor() {
        /**
         * Name for config file
         *
         * @type {string}
         * @private
         */
        this.file = 'environment.json';
        /**
         * Path to config file
         *
         * @type {string}
         * @private
         */
        this.path = join(container.resolve('server.config.path.file'), this.file);
        /**
         * Variable for custom config
         *
         * @type {{[p: string]: any}}
         * @private
         */
        this.customConfig = {};
        this.config = readJSONSync(this.path);
    }
    /**
     * Return config value
     *
     * e.g: this.configService.get('my.awesome.config.flag', 'myDefaultValue')
     *
     * @param {string} key
     * @param defaultValue
     * @returns {any}
     */
    get(key, defaultValue = null) {
        const config = { ...this.customConfig, ...this.config };
        return get(config, key, defaultValue);
    }
    /**
     * Set a custom config key
     *
     * @param {string} key
     * @param value
     * @return {object}
     */
    set(key, value) {
        this.customConfig = set(this.customConfig, key, value);
    }
};
ConfigService = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], ConfigService);

let EncryptionService = class EncryptionService {
    /**
     * Hash a string of data into a persistent SHA256 hash
     *
     * @param {string} data
     * @returns {string}
     */
    static sha256(data) {
        const hashBits = sjcl.hash.sha256.hash(data);
        return sjcl.codec.hex.fromBits(hashBits);
    }
    /**
     * Hash a string of data into random SHA256 Hash
     *
     * @param {string} data
     * @returns {string}
     */
    static sha256Random(data) {
        return this.sha256(`${data} + ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`);
    }
};
EncryptionService = __decorate([
    injectable()
], EncryptionService);

let DiscordApiProvider = class DiscordApiProvider {
    constructor(configService) {
        this.configService = configService;
        this.config = this.configService.get('discord');
    }
    /**
     * Return the auth url
     *
     * @param {string} state
     * @returns {string}
     */
    getAuthUrl(state) {
        const url = this.config.auth_url;
        const params = this.getAuthUrlParams(state);
        return `${url}?${params}`;
    }
    /**
     * Return the auth token params
     *
     * @param {string} code
     * @returns {URLSearchParams}
     */
    getAuthTokenParams(code) {
        return this.createSearchParams({
            client_id: this.config.client_id,
            client_secret: this.config.client_secret,
            grant_type: 'authorization_code',
            code,
            scope: 'identify',
            redirect_uri: encodeURI(this.config.redirect_url)
        });
    }
    /**
     * Return auth url params
     *
     * @returns {URLSearchParams}
     * @private
     */
    getAuthUrlParams(state) {
        return this.createSearchParams({
            prompt: 'none',
            response_type: 'code',
            scope: 'identify',
            client_id: this.config.client_id,
            redirect_uri: encodeURI(this.config.redirect_url),
            state
        });
    }
    /**
     * Return URLSearchParams from given params
     *
     * @param params
     * @returns {URLSearchParams}
     * @private
     */
    createSearchParams(params) {
        return new URLSearchParams(params);
    }
};
DiscordApiProvider = __decorate([
    injectable(),
    __metadata("design:paramtypes", [ConfigService])
], DiscordApiProvider);

let DiscordApiService = class DiscordApiService {
    constructor(discordApiProvider) {
        this.discordApiProvider = discordApiProvider;
    }
    /**
     * Return the token as observable
     *
     * @param {string} code
     * @returns {Observable<AccessTokenModel>}
     */
    getToken(code) {
        return from(axios.post(this.discordApiProvider.config.auth_token_url, this.discordApiProvider.getAuthTokenParams(code), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })).pipe(map((response) => new AccessTokenModel().cast(response.data)));
    }
    /**
     * Return discord user data
     *
     * @param {string} tokenType
     * @param {string} accessToken
     * @returns {Observable<DiscordUserModel>}
     */
    getUserData(tokenType, accessToken) {
        return from(axios.get(this.discordApiProvider.config.user_me_url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `${tokenType} ${accessToken}`
            }
        })).pipe(map((response) => new DiscordUserModel().cast(response.data)));
    }
    /**
     * Return the auth url
     *
     * @param {string} token
     * @returns {string}
     */
    getAuthUrl(token) {
        return this.discordApiProvider.getAuthUrl(token);
    }
};
DiscordApiService = __decorate([
    StringResolver,
    injectable(),
    __metadata("design:paramtypes", [DiscordApiProvider])
], DiscordApiService);

let DiscordBotService = class DiscordBotService {
    constructor(configService) {
        this.configService = configService;
        /**
         * Contains all discord event commands
         * @type {Map<any, any>}
         * @private
         */
        this.events = [];
        /**
         * Contains the discord config
         *
         * @type {DiscordConfigModel}
         * @private
         */
        this.config = new DiscordConfigModel().cast(this.configService.get('discord'));
        /**
         * Discord client
         *
         * @type {Client}
         * @private
         */
        this.client = new Client(this.config.presences);
        /**
         * Contains the client observable
         *
         * @type {Observable<Client>}
         * @private
         */
        this.serviceObservable$ = new Observable();
        /**
         * Internal property to set the created state
         *
         * @type {boolean}
         * @private
         */
        this.created = false;
        this.connect();
    }
    /**
     * Autostart the discord bot it class is first time resolved
     *
     * @param {Function} done
     */
    autoStart(done) {
        UtilsService.log('Starting ~y~DiscordBot~w~');
        this.initialize()
            .subscribe(() => {
            container.register('discord.client', { useValue: this.client });
            this.start();
            UtilsService.log('Started ~lg~DiscordBot~w~');
            done();
        });
    }
    /**
     * Add event to events array
     *
     * @param eventName
     * @param targetName
     * @param {string} methodName
     */
    add(eventName, targetName, methodName) {
        const event = new DiscordEventModel().cast({ eventName, targetName, methodName });
        this.events.push(event);
    }
    /**
     * Destroy/Logout the discord bot
     */
    destroy() {
        this.client.destroy();
    }
    /**
     * Return the client service observable
     *
     * @returns {Observable<Client>}
     * @private
     */
    initialize() {
        return this.serviceObservable$;
    }
    /**
     * Start event loop
     *
     * @private
     */
    start() {
        if (this.events.length) {
            UtilsService.log('Starting ~y~DiscordBot Decorators~w~');
            this.events.forEach((event) => {
                const instances = container.resolveAll(event.targetName);
                instances.forEach((instance) => {
                    const method = instance[event.methodName].bind(instance);
                    this.client.on(event.eventName, method);
                });
            });
            UtilsService.log('Started ~lg~DiscordBot Decorators~w~');
        }
    }
    /**
     * Add observable to serviceObservable
     *
     * @private
     */
    connect() {
        this.serviceObservable$ = this.created
            ? this.initialize()
            : this.login();
    }
    /**
     * Create new client login and share between all subscribers
     *
     * @returns {Observable<Client>}
     * @private
     */
    login() {
        this.created = true;
        return defer(() => from(this.client.login(this.config.bot_secret)))
            .pipe(map(() => this.client), share());
    }
};
DiscordBotService = __decorate([
    StringResolver,
    singleton(),
    __metadata("design:paramtypes", [ConfigService])
], DiscordBotService);

let GuildService = class GuildService {
    constructor() {
        /**
         * The discord bot service
         *
         * @type {DiscordBotService}
         * @private
         */
        this.guildBotService = container.resolve(DiscordBotService);
        /**
         * The config service
         *
         * @type {ConfigService}
         * @private
         */
        this.guildConfigService = container.resolve(ConfigService);
    }
    /**
     * Public guild variable
     *
     * @return {Guild}
     */
    get guild() {
        const serverId = this.guildConfigService.get('discord.server_id');
        return this.guildBotService.client.guilds.cache.get(serverId);
    }
};
GuildService = __decorate([
    StringResolver,
    singleton()
], GuildService);

/**
 * Add OnDiscord event listener
 *
 * @param {K} name
 * @returns {MethodDecorator}
 * @constructor
 */
const OnDiscord = (name) => {
    return (target, propertyKey, descriptor) => {
        const eventName = name || propertyKey;
        const discordBotService = container.resolve(DiscordBotService);
        const original = descriptor.value;
        descriptor.value = function (...args) {
            return original.apply(this, args);
        };
        discordBotService.add(eventName, target.constructor.name, propertyKey);
        return descriptor;
    };
};

let AuthenticationController = class AuthenticationController {
    constructor(discordApiService, eventService, loggerService) {
        this.discordApiService = discordApiService;
        this.eventService = eventService;
        this.loggerService = loggerService;
    }
    done(req, res) {
        res.send('Authentication done, you can now close this window').end();
    }
    /**
     * Route to authenticate the user
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @private
     */
    info(req, res) {
        const bearerToken = req.query.code;
        const discordToken = req.query.state;
        if (!bearerToken || !discordToken) {
            return res.redirect('done');
        }
        this.discordApiService
            .getToken(bearerToken)
            .pipe(filter((model) => !!model.access_token), mergeMap((model) => this.discordApiService.getUserData(model.token_type, model.access_token)), filter((discordUser) => !!discordUser.id && !!discordUser.username))
            .subscribe((discordUser) => {
            // @Todo Remove and use the user.avatarURL({ format: 'jpg', dynamic: false, size: 128 }); from Bot!!!
            discordUser = discordUser.cast({
                avatarUrl: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.jpg`
            });
            this.eventService.emit(FrameworkEvent.Discord.AuthDone, discordToken, discordUser);
            res.redirect('done');
        }, (err) => this.loggerService.error(err.message, err.stack));
    }
};
__decorate([
    Get('done'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "done", null);
__decorate([
    Get('discord'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "info", null);
AuthenticationController = __decorate([
    injectable(),
    Controller('auth'),
    ClassMiddleware([cors()]),
    __metadata("design:paramtypes", [DiscordApiService,
        EventService,
        LoggerService])
], AuthenticationController);

let ExpressServer = class ExpressServer extends Server {
    constructor() {
        super();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        const discordController = container.resolve(AuthenticationController);
        super.addControllers([discordController]);
    }
    /**
     * Start the express server on given port
     *
     * @param {number} port
     * @param callback
     */
    start(port, callback) {
        this.app.listen(port, () => {
            callback(port);
        });
    }
    /**
     * Autostart method
     * @param {Function} done
     */
    autoStart(done) {
        UtilsService.log('Starting ~y~DiscordApiServer~w~');
        try {
            this.port = container.resolve('discord.express.port');
        }
        catch (e) {
            this.port = 1337;
        }
        this.start(this.port, () => {
            UtilsService.log(`Started ~lg~DiscordApiServer~w~ on port ~y~${this.port}~w~`);
            done();
        });
    }
};
ExpressServer = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], ExpressServer);

const loader = container.resolve(LoaderService);
container.register('EventService', { useValue: container.resolve(EventService) });
container.register('ExpressServer', { useValue: container.resolve(ExpressServer) });
container.afterResolution(DiscordBotService, () => {
    loader.add('before', 'autoStart', 'DiscordBotService');
}, { frequency: 'Once' });
container.afterResolution(DiscordApiService, () => {
    loader.add('after', 'autoStart', 'ExpressServer');
}, { frequency: 'Once' });

let DatabaseService = class DatabaseService {
    constructor(configService, loggerService) {
        this.configService = configService;
        this.loggerService = loggerService;
        /**
         * Contains db connection options
         *
         * @type {ConnectionOptions}
         */
        this.config = {
            ...this.configService.get('database'),
            entities: []
        };
        /**
         * Contains the connection observable
         *
         * @type {Observable<Connection>}
         * @private
         */
        this.serviceObservable$ = new Observable();
        /**
         * Internal variable to set the create state
         *
         * @type {boolean}
         * @private
         */
        this.created = false;
        this.setupEntities();
        this.connect();
    }
    /**
     * Return the service observable
     *
     * @returns {Observable<Connection>}
     * @private
     */
    initialize() {
        return this.serviceObservable$;
    }
    /**
     * Autostart the service
     *
     * @param {Function} done
     */
    /**
     * Create the database connection observable
     *
     * @private
     */
    connect() {
        this.serviceObservable$ = this.created
            ? this.initialize()
            : this.create();
    }
    /**
     * Create new database connection and share between each subscriber
     *
     * @returns {Observable<Connection>}
     * @private
     */
    create() {
        this.created = true;
        return defer(() => {
            this.loggerService.starting('DatabaseService');
            return from(createConnection(this.config));
        }).pipe(share(), tap(() => this.loggerService.started('DatabaseService')));
    }
    /**
     * Setup entities for database
     *
     * @private
     */
    setupEntities() {
        try {
            this.entities = container.resolve('server.database.entities');
        }
        catch (e) {
            this.entities = [];
        }
        this.config.entities.push(...this.entities);
    }
};
DatabaseService = __decorate([
    StringResolver,
    singleton(),
    __metadata("design:paramtypes", [ConfigService,
        LoggerService])
], DatabaseService);

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
const OnClient = (name) => {
    return (target, propertyKey, descriptor) => {
        const eventName = name || propertyKey;
        const options = new ValidateOptionsModel().cast({ name: eventName });
        return validateEventExistsAndPush(target, 'onClient', propertyKey, descriptor, options);
    };
};
/**
 * Add onceClient event listencer
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
const OnceClient = (name) => {
    return (target, propertyKey, descriptor) => {
        const eventName = name || propertyKey;
        const options = new ValidateOptionsModel().cast({ name: eventName });
        return validateEventExistsAndPush(target, 'onceClient', propertyKey, descriptor, options);
    };
};
/**
 * Add entityEnterColshape Listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
const EntityEnterColShape = (colShapeType, name, entity) => {
    return (target, propertyKey, descriptor) => {
        const options = new ValidateOptionsModel().cast({ colShapeType, name, entity, eventAddTo: 'colShape' });
        return validateEventExistsAndPush(target, 'entityEnterColshape', propertyKey, descriptor, options);
    };
};
/**
 * Add entityLeaveColshape listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
const EntityLeaveColShape = (colShapeType, name, entity) => {
    return (target, propertyKey, descriptor) => {
        const options = new ValidateOptionsModel().cast({ colShapeType, name, entity, eventAddTo: 'colShape' });
        return validateEventExistsAndPush(target, 'entityLeaveColshape', propertyKey, descriptor, options);
    };
};

class PlayerClass extends Player {
    /**
     * Emit event directly to current player
     *
     * @param {string} eventName
     * @param args
     */
    emit(eventName, ...args) {
        const eventService = container.resolve(EventService);
        eventService.emitClient(this, eventName, ...args);
    }
    /**
     * Emit event directly to current player gui
     *
     * @param {string} eventName
     * @param args
     */
    emitGui(eventName, ...args) {
        const eventService = container.resolve(EventService);
        eventService.emitGui(this, eventName, ...args);
    }
    /**
     * Emit event on nextTick to current player gui
     *
     * @param {string} eventName
     * @param args
     */
    emitGuiNextTick(eventName, ...args) {
        UtilsService.setTimeout(() => this.emitGui(eventName, args), 25);
    }
    /**
     * Set realtime for player
     *
     * @param {Date} date
     */
    setRealTime(date) {
        this.setDateTime(date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds());
        this.emit(FrameworkEvent.Player.SetRealTime, 60000);
    }
}

Player.prototype = new PlayerClass();

class ColshapeClass extends Colshape {
}

Colshape.prototype = new ColshapeClass();

export { ConfigService, DiscordApiService, DiscordBotService, EncryptionService, EntityEnterColShape, EntityLeaveColShape, EventService, GuildService, OnClient, OnDiscord, OnceClient };
