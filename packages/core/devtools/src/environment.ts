import { parse } from 'dotenv';
import { fsJetpack } from './filesystem';
import { constantCase } from './string';

/**
 * Get specific key from env or defaultValue
 *
 * @param {string} key
 * @param defaultValue
 * @return {string}
 */
export function env<T = string>(key: string, defaultValue: T = null): T {
  const env = envToJson();
  const envVar = env[key];

  return envVar !== undefined && envVar !== null && envVar !== ''
      ? envVar
      : defaultValue;
}

/**
 * Map
 * @param {Record<string, any>} data
 * @return {string}
 */
export function jsonToEnv(data: Record<string, any>): string {
  return Object.keys(data)
      .map((k: string) => `${constantCase(k)}=${data[k]}`)
      .join('\n');
}

/**
 * Return .env as json object
 */
export function envToJson(): Record<string, any> {
  const env = fsJetpack().read('.env');
  return parse(env);
}

/**
 * Return if atlas is running as production
 *
 * @type {boolean}
 */
export const isProduction: boolean = env<string>('ATLAS_PRODUCTION', 'false') === 'true';

