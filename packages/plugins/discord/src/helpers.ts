import { Client } from 'eris';
import { app } from '@abstractflo/atlas-shared';
import { DiscordBotService } from './services/discord-bot.service';
import { DiscordApiProvider } from './providers/discord-api.provider';

/**
 * Return the bot client
 * @return {Client}
 */
export function getDiscordBotClient() {
  const botService = app.resolve(DiscordBotService);
  return botService.getClient();
}

/**
 * Return the auth url
 *
 * @param {string} token
 * @return {string}
 */
export function getAuthUrl(token: string): string {
  const apiProvider = app.resolve(DiscordApiProvider);
  return apiProvider.getAuthUrl(token);
}
