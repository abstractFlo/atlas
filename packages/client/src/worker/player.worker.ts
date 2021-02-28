import { singleton } from 'tsyringe';
import { EventService } from '../services';
import { FrameworkEvent } from '@abstractflo/atlas-shared';
import { setMsPerGameMinute } from 'alt-client';

@singleton()
export class PlayerWorker {

  constructor(
      private readonly eventService: EventService
  ) {
    this.handleRealTime();
  }

  /**
   * Handle ms per game minute
   * @private
   */
  private handleRealTime(): void {
    this.eventService.onServer(FrameworkEvent.Player.SetRealTime, (msPerGameMinute: number) => {
      setMsPerGameMinute(msPerGameMinute);
    });
  }
}
