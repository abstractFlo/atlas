import '@abraham/reflection';

export { app, registerAltLib } from './di-container';
export { Internal } from './internal';
export type { constructor } from './interfaces/constructor.interface';

// Constants
export { LoaderConstant } from './constants/loader.constant';

// Services
export { LoaderService } from './services/loader.service';
export { UtilsService } from './services/utils.service';
export { CommandService } from './services/command.service';
export { LoggerService } from './services/logger.service';
export { TimerManagerService } from './services/timer-manager.service';
export { BaseEventService } from './services/base-event.service';

// Decorator
export { getFrameworkMetaData, registerDescriptor } from './decorators/helpers';
export { Singleton, Injectable, RegisterClassAsString } from './decorators/framework-di.decorator';
export { Init, Before, After, Last } from './decorators/loader.decorator';
export { Component, Module } from './decorators/module-loader.decorator';
export { EveryTick, Interval } from './decorators/timer.decorator';
export { On, Once, Off, Cmd, setEventServiceReflectMetaData, eventServiceTarget } from './decorators/event.decorator';

// Models
export { TimerModel } from './models/timer.model';
export { EventModel } from './models/event.model';
export { ValidateOptionsModel } from './models/validate-options.model';

// JSON Entity
export { HasOne, HasMany, Cast, castFromJson, JsonEntityModel } from './libs/json-entity';

// Base Pool
export { BasePool } from './pools/base.pool';

// Interfaces
export type { EventServiceInterface } from './interfaces/event-service.interface';
export type { ModuleOptionsDecoratorInterface } from './interfaces/module-loader-options.interfac';
export type { RunningTimerInterface } from './interfaces/running-timer.interface';
export type { CastConfig, CastCallback } from './libs/json-entity/decorators/cast';
