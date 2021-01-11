import { container, InjectionToken } from 'tsyringe';

export function altLibRegister(lib: any): void {
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

export function setupServerConfigPath(path: string): void {
  container.register<string>('server.config.path.file', { useValue: path });
}

export function setupServerDatabaseEntities(entities: InjectionToken[]): void {
  container.register<InjectionToken[]>('server.database.entities', { useValue: entities });
}

export function setupWebviewRegistry(url: string, routeToEventName: string): void {
  container.register<string>('alt.webview.url', { useValue: url });
  container.register<string>('alt.webview.routeTo.eventName', { useValue: routeToEventName });

}
