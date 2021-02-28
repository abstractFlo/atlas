import { container, instanceCachingFactory } from 'tsyringe';
import { constructor } from './types/constructor';
import { StringResolver } from './decorators/helpers';


/**
 * Register all alt:V related functions from both sides in container for reuse from it
 *
 * @param lib
 */
export function registerAltLib(lib: any): void {
  // Timers
  container.register<CallableFunction>('alt.setTimeout', { useFactory: instanceCachingFactory(() => lib.setTimeout) });
  container.register<CallableFunction>(
      'alt.clearTimeout',
      { useFactory: instanceCachingFactory(() => lib.clearTimeout) }
  );
  container.register<CallableFunction>('alt.nextTick', { useFactory: instanceCachingFactory(() => lib.nextTick) });
  container.register<CallableFunction>(
      'alt.clearNextTick',
      { useFactory: instanceCachingFactory(() => lib.clearNextTick) }
  );
  container.register<CallableFunction>(
      'alt.setInterval',
      { useFactory: instanceCachingFactory(() => lib.setInterval) }
  );
  container.register<CallableFunction>(
      'alt.clearInterval',
      { useFactory: instanceCachingFactory(() => lib.clearInterval) }
  );
  container.register<CallableFunction>('alt.everyTick', { useFactory: instanceCachingFactory(() => lib.everyTick) });
  container.register<CallableFunction>(
      'alt.clearEveryTick',
      { useFactory: instanceCachingFactory(() => lib.clearEveryTick) }
  );

  // Logs
  container.register<CallableFunction>('alt.log', { useFactory: instanceCachingFactory(() => lib.log) });
  container.register<CallableFunction>('alt.logWarning', { useFactory: instanceCachingFactory(() => lib.logWarning) });
  container.register<CallableFunction>('alt.logError', { useFactory: instanceCachingFactory(() => lib.logError) });

  // EventEmitter
  container.register<CallableFunction>('alt.on', { useFactory: instanceCachingFactory(() => lib.on) });
  container.register<CallableFunction>('alt.once', { useFactory: instanceCachingFactory(() => lib.once) });
  container.register<CallableFunction>('alt.off', { useFactory: instanceCachingFactory(() => lib.off) });
  container.register<CallableFunction>('alt.emit', { useFactory: instanceCachingFactory(() => lib.emit) });
}

/**
 * Set the production mode
 *
 * If true, they prevent some debug logs like registeredHandlers for each eventListener
 *
 * @param {boolean} isProduction
 */
export function isProduction(isProduction: boolean): void {
  container.register<boolean>('isProductionMode', { useValue: isProduction });
}

export function registerLoaderService(target: constructor<any>): void {
  StringResolver(target);
}
