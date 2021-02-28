import { container, InjectionToken } from 'tsyringe';

// @ts-ignore
import { isProduction as setProductionMode } from '@abstractflo/atlas-shared/helpers';
import { UtilsService } from '@abstractflo/atlas-shared';


export { setProductionMode };


/**
 * Register path to config file
 *
 * @param {string} path
 */
export function registerServerConfigPath(path: string): void {
  container.register<string>('server.config.path.file', { useValue: path });
}

/**
 * Register database entities for typeorm
 *
 * @param {InjectionToken[]} entities
 */
export function registerDatabaseEntities(entities: InjectionToken[]): void {
  container.register<InjectionToken[]>('server.database.entities', { useValue: entities });
}

/**
 * Register the express server port
 *
 * @param {number} port
 */
export function registerDiscordApiServerPort(port: number) {
  container.register<number>('discord.express.port', { useValue: port });
}

/**
 * Global Error Handler
 */
export function defaultErrorHandling(): void {
  process.on('uncaughtException', (err) => {
    UtilsService.logError(err.stack);
    UtilsService.logError(err.message);
    UtilsService.logError(err.name);
    UtilsService.log('~r~Please close the server and fix the problem~w~');
  });
}
