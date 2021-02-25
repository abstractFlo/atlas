import { container, DependencyContainer } from 'tsyringe';

/**
 * Export a child container from tsyringe
 *
 * @type {DependencyContainer}
 */
export const atlasContainer: DependencyContainer = container.createChildContainer();

/**
 * Register all alt:V related functions from both sides in container for reuse from it
 *
 * @param lib
 */
export function registerAltLib(lib: any): void {
  // Timers
  container.register<CallableFunction>('alt.setTimeout', { useValue: lib.setTimeout });
  container.register<CallableFunction>('alt.clearTimeout', { useValue: lib.clearTimeout });
  container.register<CallableFunction>('alt.nextTick', { useValue: lib.nextTick });
  container.register<CallableFunction>('alt.clearNextTick', { useValue: lib.clearNextTick });
  container.register<CallableFunction>('alt.setInterval', { useValue: lib.setInterval });
  container.register<CallableFunction>('alt.clearInterval', { useValue: lib.clearInterval });
  container.register<CallableFunction>('alt.everyTick', { useValue: lib.everyTick });
  container.register<CallableFunction>('alt.clearEveryTick', { useValue: lib.clearEveryTick });

  // Logs
  container.register<CallableFunction>('alt.log', { useValue: lib.log });
  container.register<CallableFunction>('alt.logWarning', { useValue: lib.logWarning });
  container.register<CallableFunction>('alt.logError', { useValue: lib.logError });

  // EventEmitter
  container.register<CallableFunction>('alt.on', { useValue: lib.on });
  container.register<CallableFunction>('alt.once', { useValue: lib.once });
  container.register<CallableFunction>('alt.off', { useValue: lib.off });
  container.register<CallableFunction>('alt.emit', { useValue: lib.emit });
}
