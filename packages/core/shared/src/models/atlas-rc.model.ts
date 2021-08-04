import { Cast, JsonEntityModel } from '../libs/json-entity';

export class AtlasRcModel extends JsonEntityModel {

  @Cast()
  hooks: string[] = [];

  @Cast()
  autoload: string[] = [];
}
