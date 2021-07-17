import '@abraham/reflection';

export { unique } from './array';

export {
  findByMatching,
  hasFolder,
  fsJetpack,
  resolvePath,
  relativeId,
  renderTemplateFromPath,
  convertNameType,
  appendJsonToYaml,
  readYamlAsJson,
  writeJsonToYaml
} from './filesystem';

export { readEnvAsJson, writeToEnv, env } from './environment';

export {
  normalize,
  pascalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  camelCase,
  capitalCase,
  snakeCase,
  pathCase,
  sentenceCase
} from './string';

export { getResetScreen, stderr, handleError, isTTY, successMessage, errorMessage } from './terminal';

export { GameResourceModel } from './models/game-resource.model';

export {
  HasOne,
  HasMany,
  Cast,
  castFromJson,
  JsonEntityModel
} from './libs/json-entity';

export { ResourceManager, ResourceConfigCreator } from './libs/resources';

export { convertNamedImports } from './transformers/convertNamedImports';



