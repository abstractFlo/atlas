import { Client } from 'eris';
import { app } from '@abstractflo/atlas-shared';
import { DiscordBotService } from './services/discord-bot.service';

/**
 * Return the bot client
 * @return {Client}
 */
export function getDiscordBotClient() {
  const botService = app.resolve(DiscordBotService);
  return botService.getClient();
}
