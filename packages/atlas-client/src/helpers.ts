import { container } from 'tsyringe';
import { Player } from 'alt-client';
import * as alt from 'alt-client'

// @ts-ignore
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';
registerAltLib(alt);

/**
 * Register webview url and routeToEventName
 *
 * @param {string} url
 * @param {string} routeToEventName
 */
export function registerWebview(url: string, routeToEventName: string): void {
  container.register<string>('alt.webview.url', { useValue: url });
  container.register<string>('alt.webview.routeTo.eventName', { useValue: routeToEventName });
}

/**
 * Helper to get local player
 *
 * @return {Player}
 */
export const localPlayer: Player = Player.local;
