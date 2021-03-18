import { AutoloadAfter, FrameworkEvent } from '@abstractflo/atlas-shared';
import { setMsPerGameMinute } from 'alt-client';
import { singleton } from 'tsyringe';
import { EventService } from '../services/event.service';
import { WebviewService } from '../services/webview.service';

@AutoloadAfter({ methodName: 'load' })
@singleton()
export class PlayerWorker {

  constructor(
      private readonly eventService: EventService,
      private readonly webviewService: WebviewService
  ) {}

  /**
   * Load up this method after framework boot
   * @param {Function} done
   */
  public load(done: CallableFunction): void {
    this.handleRealTime();
    this.listenGuiEvents();
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

  /**
   * Listen for all player gui events from serverSide
   * @private
   */
  private listenGuiEvents(): void {
    this.guiRouteTo();
    this.guiShowCursor();
    this.guiRemoveCursor();
    this.guiRemoveAllCursors();
    this.guiFocus();
    this.guiUnfocus();
  }

  /**
   * Change webview route
   *
   * @private
   */
  private guiRouteTo(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiChangeRoute, (routeName: string, ...args: any[]) => {
      this.webviewService.routeTo(routeName, args);
    });
  }

  /**
   * Show cursor
   *
   * @private
   */
  private guiShowCursor(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiShowCursor, () => {
      this.webviewService.showCursor();
    });
  }

  /**
   * Remove cursor
   *
   * @private
   */
  private guiRemoveCursor(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiRemoveCursor, () => {
      this.webviewService.removeCursor();
    });
  }

  /**
   * Remove all cursors
   *
   * @private
   */
  private guiRemoveAllCursors(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiRemoveAllCursors, () => {
      this.webviewService.removeAllCursors();
    });
  }

  /**
   * Focus the gui
   *
   * @private
   */
  private guiFocus(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiFocus, () => {
      this.webviewService.focus();
    });
  }

  /**
   * Unfocus the gui
   *
   * @private
   */
  private guiUnfocus(): void {
    this.eventService.onServer(FrameworkEvent.EventService.GuiUnfocus, () => {
      this.webviewService.unfocus();
    });
  }
}
