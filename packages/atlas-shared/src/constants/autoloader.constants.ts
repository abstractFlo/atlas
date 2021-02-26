import { LoaderServiceQueueType } from './loader-service.constants';

export enum AutoloaderConstants {
  BEFORE_BOOT = LoaderServiceQueueType.FRAMEWORK_BEFORE_BOOT,
  AFTER_BOOT = LoaderServiceQueueType.FRAMEWORK_AFTER_BOOT,
}
