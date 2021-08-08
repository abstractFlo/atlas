import './extends/player/alt-player.prototype';
import './services/discord-bot.service';
import './api.server';

export { OnDiscord } from './decorators/on-discord.decorator';
export { getDiscordBotClient, getDiscordAuthUrl } from './helpers';
export { DiscordUserModel } from './models/discord-user.model';
export { PlayerInterface } from './extends/player/player.interface';
export { ClientEvents } from './interfaces/eris.interface';
