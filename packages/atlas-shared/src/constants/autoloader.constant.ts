import { LoaderServiceQueueTypeEnum } from './loader-service.constant';

// Keys for reflection
export enum AutoloaderEnums {
  BEFORE_BOOT = LoaderServiceQueueTypeEnum.FRAMEWORK_BEFORE_BOOT,
  AFTER_BOOT = LoaderServiceQueueTypeEnum.FRAMEWORK_AFTER_BOOT,
}
