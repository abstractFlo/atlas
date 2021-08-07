import { env } from '@abstractflo/atlas-devtools';

/**
 * Return all files and folders they would preserved from remove
 *
 * @return {string[]}
 */
export function getDefinedPreserves(): string[] {
  const hasDefinedPreserves = env<string>('ATLAS_CLEAR_PRESERVE', '');

  const out = [
    'node_modules/**/*',
    'altv-server*',
    '.env',
    'start.sh',
    'cache/**/*',
    'data/**/*',
    'modules/**/*',
    'package-lock.json',
    'yarn.lock',
    'server.log',
    '.docker',
    'docker/**/*',
    'docker-compose.*'
    //'resources'
  ];

  if (hasDefinedPreserves) {
    const customerPreservedFiles = hasDefinedPreserves.split(',');
    out.push(...customerPreservedFiles);
  }

  return out;
}
