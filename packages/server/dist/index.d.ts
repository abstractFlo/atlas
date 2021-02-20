/// <reference types="types-server" />
/// <reference types="node" />
import { BaseEventService, EntityHandleModel, DiscordConfigModel, AccessTokenModel, DiscordUserModel } from '@abstractflo/shared';
import { Player, Colshape, Entity, ColShapeType, BaseObjectType } from 'alt-server';
import { URLSearchParams } from 'url';
import { Observable } from 'rxjs';
import { Client, Guild } from 'discord.js';

declare class ConfigService {
    /**
     * Name for config file
     *
     * @type {string}
     * @private
     */
    private file;
    /**
     * Path to config file
     *
     * @type {string}
     * @private
     */
    private path;
    /**
     * Contains the config object
     *
     * @type {{[p: string]: any}}
     * @private
     */
    private readonly config;
    /**
     * Variable for custom config
     *
     * @type {{[p: string]: any}}
     * @private
     */
    private customConfig;
    constructor();
    /**
     * Return config value
     *
     * e.g: this.configService.get('my.awesome.config.flag', 'myDefaultValue')
     *
     * @param {string} key
     * @param defaultValue
     * @returns {any}
     */
    get(key: string, defaultValue?: any): any;
    /**
     * Set a custom config key
     *
     * @param {string} key
     * @param value
     * @return {object}
     */
    set(key: string, value: any): void;
}

declare class EventService extends BaseEventService {
    /**
     * Emit event to client
     *
     * @param {Player | null} player
     * @param {string} eventName
     * @param args
     */
    emitClient(player: Player | null, eventName: string, ...args: any[]): void;
    /**
     * Emit event to gui use client as bridge
     *
     * @param {Player | null} player
     * @param {string} eventName
     * @param args
     */
    emitGui(player: Player | null, eventName: string, ...args: any[]): void;
    /**
     * Unsubscribe from client event
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    offClient(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Receive event from client
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    onClient(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Receive once event from client
     *
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     */
    onceClient(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Listen handlers for given type
     *
     * @param {string} type
     * @param {EntityHandleModel[]} handlers
     * @protected
     */
    protected listenHandlerForType(type: string, handlers: EntityHandleModel[]): void;
    /**
     * Handle all colShape events
     *
     * @param {Colshape} colShape
     * @param {EntityHandleModel[]} handlers
     * @param entity
     * @param args
     * @protected
     */
    protected handleColShapeMethods(colShape: Colshape, handlers: EntityHandleModel[], entity: Entity, ...args: any[]): void;
}

declare class EncryptionService {
    /**
     * Hash a string of data into a persistent SHA256 hash
     *
     * @param {string} data
     * @returns {string}
     */
    static sha256(data: string): string;
    /**
     * Hash a string of data into random SHA256 Hash
     *
     * @param {string} data
     * @returns {string}
     */
    static sha256Random(data: string): string;
}

/**
 * Add onClient event listener
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnClient: (name?: string) => MethodDecorator;
/**
 * Add onceClient event listencer
 *
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnceClient: (name?: string) => MethodDecorator;
/**
 * Add entityEnterColshape Listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
declare const EntityEnterColShape: (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType) => MethodDecorator;
/**
 * Add entityLeaveColshape listener
 *
 * @param {ColShapeType} colShapeType
 * @param {string} name
 * @param {BaseObjectType} entity
 * @return {MethodDecorator}
 * @constructor
 */
declare const EntityLeaveColShape: (colShapeType: ColShapeType, name?: string, entity?: BaseObjectType) => MethodDecorator;

declare class DiscordApiProvider {
    private readonly configService;
    readonly config: DiscordConfigModel;
    constructor(configService: ConfigService);
    /**
     * Return the auth url
     *
     * @param {string} state
     * @returns {string}
     */
    getAuthUrl(state: string): string;
    /**
     * Return the auth token params
     *
     * @param {string} code
     * @returns {URLSearchParams}
     */
    getAuthTokenParams(code: string): URLSearchParams;
    /**
     * Return auth url params
     *
     * @returns {URLSearchParams}
     * @private
     */
    private getAuthUrlParams;
    /**
     * Return URLSearchParams from given params
     *
     * @param params
     * @returns {URLSearchParams}
     * @private
     */
    private createSearchParams;
}

declare class DiscordApiService {
    private readonly discordApiProvider;
    constructor(discordApiProvider: DiscordApiProvider);
    /**
     * Return the token as observable
     *
     * @param {string} code
     * @returns {Observable<AccessTokenModel>}
     */
    getToken(code: string): Observable<AccessTokenModel>;
    /**
     * Return discord user data
     *
     * @param {string} tokenType
     * @param {string} accessToken
     * @returns {Observable<DiscordUserModel>}
     */
    getUserData(tokenType: string, accessToken: string): Observable<DiscordUserModel>;
    /**
     * Return the auth url
     *
     * @param {string} token
     * @returns {string}
     */
    getAuthUrl(token: string): string;
}

declare class DiscordBotService {
    private readonly configService;
    /**
     * Contains all discord event commands
     * @type {Map<any, any>}
     * @private
     */
    private events;
    /**
     * Contains the discord config
     *
     * @type {DiscordConfigModel}
     * @private
     */
    private readonly config;
    /**
     * Discord client
     *
     * @type {Client}
     * @private
     */
    readonly client: Client;
    /**
     * Contains the client observable
     *
     * @type {Observable<Client>}
     * @private
     */
    private serviceObservable$;
    /**
     * Internal property to set the created state
     *
     * @type {boolean}
     * @private
     */
    private created;
    constructor(configService: ConfigService);
    /**
     * Autostart the discord bot it class is first time resolved
     *
     * @param {Function} done
     */
    autoStart(done: CallableFunction): void;
    /**
     * Add event to events array
     *
     * @param eventName
     * @param targetName
     * @param {string} methodName
     */
    add(eventName: string, targetName: string, methodName: string): void;
    /**
     * Destroy/Logout the discord bot
     */
    destroy(): void;
    /**
     * Return the client service observable
     *
     * @returns {Observable<Client>}
     * @private
     */
    private initialize;
    /**
     * Start event loop
     *
     * @private
     */
    private start;
    /**
     * Add observable to serviceObservable
     *
     * @private
     */
    private connect;
    /**
     * Create new client login and share between all subscribers
     *
     * @returns {Observable<Client>}
     * @private
     */
    private login;
}

declare class GuildService {
    /**
     * The discord bot service
     *
     * @type {DiscordBotService}
     * @private
     */
    private guildBotService;
    /**
     * The config service
     *
     * @type {ConfigService}
     * @private
     */
    private guildConfigService;
    /**
     * Public guild variable
     *
     * @return {Guild}
     */
    get guild(): Guild;
}

/**
 * Add OnDiscord event listener
 *
 * @param {K} name
 * @returns {MethodDecorator}
 * @constructor
 */
declare const OnDiscord: <K extends "channelCreate" | "channelDelete" | "channelPinsUpdate" | "channelUpdate" | "debug" | "warn" | "disconnect" | "emojiCreate" | "emojiDelete" | "emojiUpdate" | "error" | "guildBanAdd" | "guildBanRemove" | "guildCreate" | "guildDelete" | "guildUnavailable" | "guildIntegrationsUpdate" | "guildMemberAdd" | "guildMemberAvailable" | "guildMemberRemove" | "guildMembersChunk" | "guildMemberSpeaking" | "guildMemberUpdate" | "guildUpdate" | "inviteCreate" | "inviteDelete" | "message" | "messageDelete" | "messageReactionRemoveAll" | "messageReactionRemoveEmoji" | "messageDeleteBulk" | "messageReactionAdd" | "messageReactionRemove" | "messageUpdate" | "presenceUpdate" | "rateLimit" | "ready" | "invalidated" | "roleCreate" | "roleDelete" | "roleUpdate" | "typingStart" | "userUpdate" | "voiceStateUpdate" | "webhookUpdate" | "shardDisconnect" | "shardError" | "shardReady" | "shardReconnecting" | "shardResume">(name?: K) => MethodDecorator;

interface PlayerInterface {
    /**
     * Set realtime for player
     *
     * @param {Date} date
     */
    setRealTime(date: Date): void;
    /**
     * Emit event directly to current player
     *
     * @param {string} eventName
     * @param args
     */
    emit(eventName: string, ...args: any[]): void;
    /**
     * Emit event directly to current player gui
     *
     * @param {string} eventName
     * @param args
     */
    emitGui(eventName: string, ...args: any[]): void;
    /**
     * Emit event on nextTick to current player gui
     *
     * @param {string} eventName
     * @param args
     */
    emitGuiNextTick(eventName: string, ...args: any[]): void;
}

declare module 'alt-server' {
    interface Player extends PlayerInterface {
    }
}

interface ColshapeInterface {
    /**
     * Colshape name for identification
     */
    name: string;
}

declare module 'alt-server' {
    interface Colshape extends ColshapeInterface {
    }
}

export { ConfigService, DiscordApiService, DiscordBotService, EncryptionService, EntityEnterColShape, EntityLeaveColShape, EventService, GuildService, OnClient, OnDiscord, OnceClient };
