import { AutoloadAfter, FrameworkEvent } from '@abstractflo/atlas-shared';
import { setMsPerGameMinute } from 'alt-client';
import { singleton } from 'tsyringe';
import { EventService } from '../services/event.service';

@AutoloadAfter({ methodName: 'load' })
@singleton()
export class PlayerWorker {

  constructor(
      private readonly eventService: EventService
  ) {}

  /**
   * Load up this method after framework boot
   * @param {Function} done
   */
  public load(done: CallableFunction): void {
    this.handleRealTime();
    done();
  }

  /**
   * Handle ms per game minute
   *
   * @private
   */
  private handleRealTime(): void {
    this.eventService.onServer(FrameworkEvent.Player.SetRealTime, (msPerGameMinute: number) => {
      setMsPerGameMinute(msPerGameMinute);
    });
  }

}
