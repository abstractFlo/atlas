import { injectable } from 'tsyringe';
import { UtilsService } from './utils.service';

@injectable()
export class LoggerService {

  /**
   * Add info to console
   *
   * @param messages
   */
  info(...messages: any[]): void {
    UtilsService.log(messages);
  }

  /**
   * Add warning to console
   *
   * @param messages
   */
  warning(...messages: any[]): void {
    UtilsService.logWarning(messages);
  }

  /**
   * Add error to console
   * @param messages
   */
  error(...messages: any[]): void {
    UtilsService.logError(messages);
  }

  /**
   * Add starting message to console
   *
   * @param message
   */
  starting(message: string): void {
    UtilsService.log(`Starting ~y~${message}~w~`);
  }

  /**
   * Add started message to console
   *
   * @param message
   */
  started(message: string): void {
    UtilsService.log(`Started ~lg~${message}~w~`);
  }


}
