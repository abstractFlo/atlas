import { LoaderServiceQueueItemModel } from '../models/loader-service-queue-item.model';
import { BaseLoaderService } from '../services/base-loader.service';
import { container } from 'tsyringe';
import { getAtlasMetaData, registerDescriptor } from './helpers';
import { LoaderServiceEnum, LoaderServiceQueueTypeEnum } from '../constants/loader-service.constant';
import { AutoloaderEnums } from '../constants/autoloader.constant';

/**
 * Define options for autoloader decorator
 */
export interface AutoloadOptionsInterface {
  methodName?: string;
  doneCheckTimeout?: number;
}

/**
 * Register @Autoload decorator to mark a class as autoload
 *
 * @param {AutoloaderEnums} type
 * @param {AutoloadOptionsInterface} options
 * @return {MethodDecorator}
 * @constructor
 */
export const Autoload = (type: AutoloaderEnums, options?: AutoloadOptionsInterface) => {
  return (target: any) => {
    const defaultOptions = {
      methodName: 'autoStart',
      doneCheckTimeout: 5000,
      ...options,
    };

    addLoaderMetaData({ type, target, ...defaultOptions });

    return target;
  };
};

/**
 * Alias for @Autoload(AutoloaderEnums.BEFORE_BOOT)
 *
 * @param {AutoloadOptionsInterface} options
 * @return {(target: any) => any}
 * @constructor
 */
export const AutoloadBefore = (options?: AutoloadOptionsInterface) => Autoload(AutoloaderEnums.BEFORE_BOOT, options);

/**
 * Alias for @Autoload(AutoloaderEnums.AFTER_BOOT)
 *
 * @param {AutoloadOptionsInterface} options
 * @return {(target: any) => any}
 * @constructor
 */
export const AutoloadAfter = (options?: AutoloadOptionsInterface) => Autoload(AutoloaderEnums.AFTER_BOOT, options);

/**
 * Register @Before decorator
 *
 * @param {number} doneCheckTimeout
 * @return {MethodDecorator}
 * @constructor
 */
export const Before = (doneCheckTimeout?: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    addLoaderMetaData({
      type: LoaderServiceQueueTypeEnum.BEFORE,
      target: target.constructor.name,
      methodName: propertyKey,
      doneCheckTimeout,
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Register @After decorator
 *
 * @param {number} doneCheckTimeout
 * @return {MethodDecorator}
 * @constructor
 */
export const After = (doneCheckTimeout?: number): MethodDecorator => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
    addLoaderMetaData({
      type: LoaderServiceQueueTypeEnum.AFTER,
      target: target.constructor.name,
      methodName: propertyKey,
      doneCheckTimeout,
    });

    return registerDescriptor(descriptor);
  };
};

/**
 * Update LoaderMetaData
 *
 * @param {LoaderServiceQueueItemModel} config
 */
function addLoaderMetaData(config: Partial<LoaderServiceQueueItemModel>): void {
  const loaderService = container.resolve(BaseLoaderService);
  const queueItemModels = getAtlasMetaData<LoaderServiceQueueItemModel[]>(LoaderServiceEnum.QUEUE_ITEM, loaderService);

  const newQueueItem = new LoaderServiceQueueItemModel().cast(config);
  queueItemModels.push(newQueueItem);

  Reflect.defineMetadata<LoaderServiceQueueItemModel[]>(LoaderServiceEnum.QUEUE_ITEM, queueItemModels, loaderService);
}
