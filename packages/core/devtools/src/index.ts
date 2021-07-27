import '@abraham/reflection';

export { unique } from './array';

export {
  findByMatching,
  hasFolder,
  fsJetpack,
  resolvePath,
  renderTemplateFromPath,
  convertNameType,
  dirAndFileInstaller,
  renderTemplateFromString,
  copy
} from './filesystem';

export type { DirAndFileInstaller } from './filesystem';

export { jsonToYaml, yamlToJson, writeJsonToYaml, appendJsonToYaml, readYamlAsJson } from './yaml';
export { createTempCfg, CfgValueType, readKeyFromCfg, readCfg, cfgFromObject, sanitizedCfg } from './cfg';

export { envToJson, jsonToEnv, env } from './environment';

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
export type { ResourceCreateConfigInterface, PrepareForCopyInterface } from './libs/resources';

export { convertNamedImports } from './transformers/convertNamedImports';

export { relativeId } from './relativeId';

