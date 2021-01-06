import { container } from 'tsyringe';
import { Client } from 'discord.js';
import { DiscordBotService } from './services/discord-bot.service';

container.register<Client>('discord.client', { useValue: container.resolve(DiscordBotService).client });

export * from './services/discord.service';
export * from './services/discord-api.service';
export * from './services/discord-bot.service';
export * from './decorators/on-discord.decorator';
export * from './models';



