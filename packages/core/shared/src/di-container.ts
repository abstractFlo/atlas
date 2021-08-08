import { container, DependencyContainer, InjectionToken, instanceCachingFactory } from 'tsyringe';
import { Internal } from './internal';

const app: DependencyContainer = container;

/**
 * Helper for register lib in di container
 *
 * @param container
 * @param token
 * @param fn
 */
function registerForContainer(container: DependencyContainer, token: InjectionToken, fn: CallableFunction): void {
  container.register(token, { useFactory: instanceCachingFactory(() => fn) });
}

/**
 * Register alt:V libs inside di container
 *
 * @param container
 * @param lib
 */
const registerAltLib = (container: DependencyContainer, lib: any): void => {
  // Timers
  registerForContainer(container, Internal.Alt_Set_Timeout, lib.setTimeout);
  registerForContainer(container, Internal.Alt_Clear_Timeout, lib.clearTimeout);
  registerForContainer(container, Internal.Alt_Next_Tick, lib.nextTick);
  registerForContainer(container, Internal.Alt_Clear_Next_Tick, lib.clearNextTick);
  registerForContainer(container, Internal.Alt_Set_Interval, lib.setInterval);
  registerForContainer(container, Internal.Alt_Clear_Interval, lib.clearInterval);
  registerForContainer(container, Internal.Alt_Every_Tick, lib.everyTick);
  registerForContainer(container, Internal.Alt_Clear_Every_Tick, lib.clearEveryTick);

  // Logs
  registerForContainer(container, Internal.Alt_Log, lib.log);
  registerForContainer(container, Internal.Alt_Log_Warning, lib.logWarning);
  registerForContainer(container, Internal.Alt_Log_Error, lib.logError);

  // Events
  registerForContainer(container, Internal.Alt_On, lib.on);
  registerForContainer(container, Internal.Alt_Once, lib.once);
  registerForContainer(container, Internal.Alt_Off, lib.off);
  registerForContainer(container, Internal.Alt_Emit, lib.emit);
};

export { app, registerAltLib };
