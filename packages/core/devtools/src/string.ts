/**
 * Normalize given path
 *
 * @param path
 */
export function normalize(path: string) {
  if (path.indexOf('\\') == -1) return path;
  return path.replace(/\\/g, '/');
}

/**
 * Return given value as PascalCase
 * @param {string} value
 * @return {string}
 */
/*export function pascalCase(value: string): string {
  return value.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}*/


export {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from 'change-case';
