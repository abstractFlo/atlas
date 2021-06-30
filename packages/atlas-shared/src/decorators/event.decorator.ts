import { container } from 'tsyringe';
import { getAtlasMetaData, registerDescriptor } from './helpers';
import { EventEnum } from '../constants/event.contstant';
import { EventModel } from '../models/event.model';
import { EventServiceInterface } from '../interfaces/event-service.interface';
import { BaseEventService } from '../services/base-event.service';

/**
 * Register @On decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const On = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(EventEnum.ON, {
      type: 'on',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
      validateOptions: {
        name: eventName,
      },
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @Once decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const Once = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const eventName = name || propertyKey;

    setEventServiceReflectMetaData(EventEnum.ONCE, {
      type: 'once',
      eventName,
      methodName: propertyKey,
      targetName: target.constructor.name,
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register new console command
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const Cmd = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const commandName = name || propertyKey;
    const events = getAtlasMetaData<EventModel[]>(EventEnum.CONSOLE_COMMAND, eventServiceTarget());
    const alreadyExists = events.find((event: EventModel) => event.eventName === commandName);

    if (!alreadyExists) {
      setEventServiceReflectMetaData(EventEnum.CONSOLE_COMMAND, {
        type: 'consoleCommand',
        eventName: commandName,
        methodName: propertyKey,
        targetName: target.constructor.name,
        validateOptions: {
          name: commandName,
        },
      });
    }

    return registerDescriptor(descriptor);
  };
};

/**
 * Setup metaData
 *
 * @param {string} key
 * @param {Partial<EventModel>} data
 */
export function setEventServiceReflectMetaData(key: string, data: Partial<EventModel>): void {
  const target = eventServiceTarget();
  const events = getAtlasMetaData<EventModel[]>(key, target);
  const eventModel = new EventModel().cast(data);

  events.push(eventModel);

  Reflect.defineMetadata<EventModel[]>(key, events, target);
}

/**
 * Return the EventService
 *
 * @return {EventServiceInterface}
 */
export function eventServiceTarget(): EventServiceInterface {
  return container.resolve<EventServiceInterface>(BaseEventService);
}
