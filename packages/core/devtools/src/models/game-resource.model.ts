import { Cast, HasOne, JsonEntityModel } from '../libs/json-entity';
import { GameResourceConfigModel } from './game-resource-config.model';

export class GameResourceModel extends JsonEntityModel {

  /**
   * Config for gameresource
   * @type {GameResourceModel}
   */
  @HasOne(GameResourceConfigModel)
  @Cast()
  config: GameResourceConfigModel = new GameResourceConfigModel();

  /**
   * Resource Foldername
   * @type {string}
   */
  @Cast()
  source: string;

  /**
   * Resource output path
   * @type {string}
   */
  @Cast()
  output: string;

  @Cast()
  isServer: boolean = false;

  @Cast()
  isClient: boolean = false;

  @Cast()
  hasAssets: boolean = false;
}
