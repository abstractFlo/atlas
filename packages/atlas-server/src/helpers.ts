import { container } from 'tsyringe';
import { UtilsService } from '@abstractflo/atlas-shared';


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
