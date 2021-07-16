import type { ModuleFormat } from 'rollup';
import { OutputOptions } from 'rollup';
import { Cast, JsonEntityModel } from '../libs/json-entity';

export class ResourceOutputModel extends JsonEntityModel implements OutputOptions {

  @Cast()
  format: ModuleFormat = 'esm';

  @Cast()
  inlineDynamicImports: boolean = true;

  @Cast()
  preserveModules: boolean = false;

  @Cast()
  file?: string;

  @Cast()
  dir?: string;
}
