import { app } from '../di-container';
import { LoaderService } from '../services/loader.service';
import { getFrameworkMetaData, registerDescriptor } from './helpers';
import { LoaderConstant } from '../constants/loader.constant';
import { LoaderQueueItemModel } from '../models/loader-queue-item.model';

/**
 * Decorates a method that would be run before loader start to boot
 *
 * UseCases: Database Connection, Discord Bot Connection,...
 *
 * @return {PropertyDescriptor}
 * @constructor
 * @param {number} order
 */
export const Init = (order?: number) => (target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor =>
    createLoaderDecorator(
        target,
        propertyKey,
        descriptor,
        LoaderConstant.QUEUE_INIT,
        order
    );

/**
 * Decorates a method to run before after init decorators finished
 *
 * @param {Object} target
 * @param {PropertyKey} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 * @constructor
 */
export const Before = (target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor =>
    createLoaderDecorator(
        target,
        propertyKey,
        descriptor,
        LoaderConstant.QUEUE_BEFORE
    );

/**
 * Decorates a method to run after the before decorator finished
 *
 * @param {Object} target
 * @param {PropertyKey} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 * @constructor
 */
export const After = (target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor =>
    createLoaderDecorator(
        target,
        propertyKey,
        descriptor,
        LoaderConstant.QUEUE_AFTER
    );

/**
 * This decorator is only for plugins they want to load  method completely after all others
 *
 * @usage @Last - only for plugins, don't use in components or modules
 *
 * @param {Object} target
 * @param {PropertyKey} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @return {PropertyDescriptor}
 * @constructor
 */
export const Last = (target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor =>
    createLoaderDecorator(
        target,
        propertyKey,
        descriptor,
        LoaderConstant.QUEUE_LAST
    );

/**
 * Add new item to LoaderService
 *
 * @param {Omit<LoaderQueueItemModel, "cast">} config
 */
function addLoaderMetaData(config: Omit<LoaderQueueItemModel, 'cast'>): void {
  const loaderService = app.resolve(LoaderService);
  const queueItems = getFrameworkMetaData<LoaderQueueItemModel[]>(LoaderConstant.QUEUE_ITEM, loaderService);

  const item = new LoaderQueueItemModel().cast(config);
  queueItems.push(item);

  Reflect.defineMetadata<LoaderQueueItemModel[]>(LoaderConstant.QUEUE_ITEM, queueItems, loaderService);
}

/**
 * Helper to create loader decorator
 *
 * @param {Object} target
 * @param {PropertyKey} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @param {symbol} type
 * @param {number} order
 * @return {PropertyDescriptor}
 */
function createLoaderDecorator(target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor, type: symbol, order?: number) {
  addLoaderMetaData({
    type,
    target: target.constructor.name,
    methodName: propertyKey.toLocaleString(),
    targetHash: target.constructor,
    order
  });

  return registerDescriptor(descriptor);
}
