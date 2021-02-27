import { AutoloaderEnums, LoaderServiceEnum } from '../constants';
import { LoaderServiceQueueItemModel } from '../models/loader-service-queue-item.model';
import { LoaderService } from '../services/loader.service';
import { container } from 'tsyringe';

/**
 * Define options for autoloader decorator
 */
export interface AutoloadOptionsInterface {
  methodName?: string;
  doneCheckTimeout?: number
}

/**
 * Register @Autoload decorator to mark a class as autoload
 *
 * @param {AutoloaderEnums} type
 * @param {AutoloadOptionsInterface} options
 * @return {MethodDecorator}
 * @constructor
 */
export const Autoload = (
    type: AutoloaderEnums,
    options?: AutoloadOptionsInterface) => {
  return (target: any) => {
    const loaderService = container.resolve(LoaderService);
    const config: LoaderServiceQueueItemModel[] = Reflect.getMetadata(
        LoaderServiceEnum.QUEUE_ITEM,
        loaderService
    ) || [];

    const defaultOptions = {
      methodName: 'autoStart',
      doneCheckTimeout: 5000,
      ...options
    };

    const queueItemModel: LoaderServiceQueueItemModel = new LoaderServiceQueueItemModel().cast({
      type,
      target,
      ...defaultOptions
    });

    config.push(queueItemModel);

    Reflect.defineMetadata(LoaderServiceEnum.QUEUE_ITEM, config, loaderService);

    return target;
  };
};
