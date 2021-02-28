import { container, instanceCachingFactory } from 'tsyringe';
import { UtilsService } from '@abstractflo/atlas-shared';
import { LoaderService } from './services/loader.service';

/**
 * Register path to config file
 *
 * @param {string} path
 */
export function registerServerConfigPath(path: string): void {
  container.register<string>('server.config.path.file', { useValue: path });
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

export function setupSeverSide(): void {
  container.register('LoaderService', { useFactory: instanceCachingFactory(c => c.resolve(LoaderService)) });
}
