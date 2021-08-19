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
  resolveAndLoadFile,
  copy
} from './filesystem';

export type { DirAndFileInstaller } from './filesystem';

export { jsonToYaml, yamlToJson, writeJsonToYaml, appendJsonToYaml, readYamlAsJson } from './yaml';
export { createTempCfg, CfgValueType, readKeyFromCfg, readCfg, cfgFromObject, sanitizedCfg } from './cfg';

export { envToJson, jsonToEnv, env, appendToEnv } from './environment';

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

export {
  getResetScreen,
  stderr,
  handleError,
  isTTY,
  successMessage,
  errorMessage,
  createProgressBar,
  executeCommand
} from './terminal';

export { formatBytes } from './numbers';

export { GameResourceModel } from './models/game-resource.model';
export { GameResourceConfigModel } from './models/game-resource-config.model';
export { ResourceConfigModel } from './models/resource-config.model';
export { ResourceOutputModel } from './models/resource-output.model';

export { HasOne, HasMany, Cast, castFromJson, JsonEntityModel } from './libs/json-entity';

export type { CastCallback, CastConfig } from './libs/json-entity/decorators/cast';
export type { ResourceCreateConfigInterface, PrepareForCopyInterface } from './libs/resources';

export { AtlasRcInterface, AtlasHooksInterface } from './interfaces/atlas-rc.interface';

export { ResourceManager, ResourceConfigCreator } from './libs/resources';

export { convertNamedImports } from './transformers/convertNamedImports';

export { relativeId } from './relativeId';

// Atlas Helpers
export {
  projectPkgJson,
  writeProjectPkgJson,
  pluginFolderName,
  getHookByType,
  checkIfValidHook,
  runHook
} from './atlas';

export { FSJetpack } from 'fs-jetpack/types';

export { PackageJson } from './types';
export type { PackageJsonDep } from './types';
