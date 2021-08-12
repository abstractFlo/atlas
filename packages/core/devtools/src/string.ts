/**
 * Normalize given path
 *
 * @param path
 */
export function normalize(path: string) {
  if (path.indexOf('\\') == -1) return path;
  return path.replace(/\\/g, '/');
}

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
  snakeCase
} from 'change-case';
