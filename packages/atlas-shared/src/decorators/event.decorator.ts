import { EventModel } from '../models';
import { container } from 'tsyringe';
import { EventEnum } from '../constants';
import { EventServiceInterface } from '../interfaces';
import { constructor } from '../types';

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
        name: eventName
      }
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
      targetName: target.constructor.name
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

    const events = getEventServiceReflectMetaData<EventModel[]>(EventEnum.CONSOLE_COMMAND, []);
    const alreadyExists = events.find((event: EventModel) => event.eventName === commandName);

    if (!alreadyExists) {
      setEventServiceReflectMetaData(EventEnum.CONSOLE_COMMAND, {
        type: 'consoleCommand',
        eventName: commandName,
        methodName: propertyKey,
        targetName: target.constructor.name,
        validateOptions: {
          name: commandName
        }
      });
    }

    return registerDescriptor(descriptor);
  };
};

/**
 * Register the override descriptor
 *
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 */
export function registerDescriptor(
    descriptor: PropertyDescriptor
): PropertyDescriptor {

  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return original.apply(this, args);
  };

  return descriptor;
}

/**
 * Setup metaData
 *
 * @param {string} key
 * @param {Partial<EventModel>} data
 */
export function setEventServiceReflectMetaData(key: string, data: Partial<EventModel>): void {
  const eventService = container.resolve<EventServiceInterface>('EventService');
  const config: EventModel[] = Reflect.getMetadata(key, eventService) || [];
  const eventModel = new EventModel().cast(data);

  config.push(eventModel);

  Reflect.defineMetadata(key, config, eventService);
}

/**
 * Return the MetaData for given target
 * @param {string} key
 * @param {constructor<any>} target
 * @param {T} defaultValue
 * @return {typeof defaultValue}
 */
export function getEventServiceReflectMetaData<T>(
    key: string,
    defaultValue: T
): typeof defaultValue {
  const target = container.resolve<EventServiceInterface>('EventService');
  return Reflect.getMetadata(key, target) || defaultValue;
}
