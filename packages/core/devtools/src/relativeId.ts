import { isAbsolute, relative, resolve } from 'path';

/**
 * Get the relativeId for given id
 *
 * @param {string} id
 * @return {string}
 */
export function relativeId(id: string) {
  if (!isAbsolute(id)) return id;
  return relative(resolve(), id);
}
