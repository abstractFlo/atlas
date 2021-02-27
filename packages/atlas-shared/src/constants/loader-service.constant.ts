export enum LoaderServiceQueueTypeEnum {
  BEFORE = 'before',
  AFTER = 'after',
  FRAMEWORK_BEFORE_BOOT = 'frameworkBeforeBoot',
  FRAMEWORK_AFTER_BOOT = 'frameworkAfterBoot',
}

export enum LoaderServiceEnum {
  QUEUE_ITEM = 'atlas-shared:loaderService:queueItem'
}
