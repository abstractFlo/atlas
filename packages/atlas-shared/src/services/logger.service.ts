import { injectable } from 'tsyringe';
import { UtilsService } from './utils.service';

@injectable()
export class LoggerService {
  /**
   * Add info to log
   *
   * @param messages
   */
  public info(...messages: any[]): void {
    UtilsService.log(messages);
  }

  /**
   * Add warning to log
   *
   * @param messages
   */
  public warning(...messages: any[]): void {
    UtilsService.logWarning(messages);
  }

  /**
   * Add error to log
   *
   * @param messages
   */
  public error(...messages: any[]): void {
    UtilsService.logError(messages);
  }

  /**
   * Add loaded message to log
   *
   * @param messages
   */
  public loaded(...messages: any[]): void {
    UtilsService.logLoaded(messages);
  }

  /**
   * Add unloaded message to log
   *
   * @param messages
   */
  public unloaded(...messages: any[]): void {
    UtilsService.logLoaded(messages);
  }
}
