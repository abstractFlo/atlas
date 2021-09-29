import { Cast, JsonEntityModel } from '../libs/json-entity';

export class GameResourceConfigModel extends JsonEntityModel {
  /**
   * Name of the resource
   */
  @Cast()
  name: string = '';

  /**
   * Enable if is a game resource
   */
  @Cast()
  isGameResource: boolean = false;

  /**
   * Describe which modules can be convert to default imports
   */
  @Cast()
  convert: string[] = [];

  /**
   * Define which modules are externals
   */
  @Cast()
  externals: string[] = [];

  /**
   * Enable if the import should be default or all(*), default set to false
   */
  @Cast()
  useStarImport: boolean = false;

  @Cast()
  serverMain: string = 'server/index.ts';

  @Cast()
  clientMain: string = 'client/index.ts';

  @Cast()
  readonly path: string;
}
