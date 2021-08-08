import * as alt from 'alt-client';
import { app, constructor } from '@abstractflo/atlas-shared';
import { WebviewService } from './services/webview.service';

/**
 * Contains the cursor count
 *
 * @type {number}
 */
let cursorCount: number = 0;

/**
 * Show ui cursor and increase cursor count
 */
export function showCursor(): void {
  alt.showCursor(true);
  cursorCount++;
}

/**
 * Remove a cursor if count greater then 0
 */
export function removeCursor(): void {
  if (cursorCount > 0) {
    alt.showCursor(false);
    cursorCount--;
  }
}

/**
 * Remove all cursors based on cursorCount
 */
export function removeAllCursors(): void {
  for (let i = 0; i < cursorCount; i++) {
    alt.showCursor(false);
  }
  cursorCount = 0;
}

/**
 * Return the webviewService Instance
 *
 * @param {constructor<any>} instance
 * @return {WebviewService}
 */
export function getWebviewInstance(instance: constructor<any>): WebviewService {
  return app.resolve(instance);
}

