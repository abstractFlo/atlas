import { UtilsService } from '@abstractflo/atlas-shared';

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
