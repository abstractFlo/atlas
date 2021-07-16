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
  const env = readEnvAsJson();

  return env[key] || defaultValue;
}

/**
 * Convert given object to string version and write to .env
 *
 * @param data
 */
export function writeToEnv(data: Record<string, any>): void {
  const mapped = Object.keys(data)
      .map((k: string) => `${constantCase(k)}=${data[k]}`)
      .join('\n');

  fsJetpack().write('.env', mapped);
}

/**
 * Return .env as json object
 */
export function readEnvAsJson(): Record<string, any> {
  const env = fsJetpack().read('.env');
  return parse(env);
}
