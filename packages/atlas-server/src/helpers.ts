import { container, InjectionToken } from 'tsyringe';

/**
 * Register path to config file
 *
 * @param {string} path
 */
export function registerServerConfigPath(path: string): void {
  container.register<string>('server.config.path.file', { useValue: path });
}

/**
 * Register database entities for typeorm
 *
 * @param {InjectionToken[]} entities
 */
export function registerDatabaseEntities(entities: InjectionToken[]): void {
  container.register<InjectionToken[]>('server.database.entities', { useValue: entities });
}

/**
 * Register the express server port
 *
 * @param {number} port
 */
export function registerDiscordApiServerPort(port: number) {
  container.register<number>('discord.express.port', { useValue: port });
}
