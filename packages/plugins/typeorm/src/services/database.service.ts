import { Init, Singleton, UtilsService } from '@abstractflo/atlas-shared';
import { createConnection } from 'typeorm';

@Singleton
export class DatabaseService {

  /**
   * Contains if database already conntected
   *
   * @type {boolean}
   * @private
   */
  private connected: boolean = false;

  /**
   * Setup database connection
   *
   * @return {Promise<void>}
   * @protected
   */
  @Init(-1)
  protected async connect(): Promise<void> {
    if (this.connected) return;

    await createConnection();
    UtilsService.logLoaded('DatabaseService');
    this.connected = true;
  }

}

