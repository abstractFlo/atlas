import { Cast, HasOne, JsonEntityModel } from '../libs/json-entity';
import { Plugin, WatcherOptions } from 'rollup';
import { ResourceOutputModel } from './resource-output.model';


export class ResourceConfigModel extends JsonEntityModel {

  @Cast()
  input: string;

  @HasOne(ResourceOutputModel)
  @Cast()
  output: ResourceOutputModel = new ResourceOutputModel();

  @Cast()
  external: string[] = ['alt-shared'];

  @Cast()
  plugins: Plugin[] = [];

  @Cast()
  watch: Pick<WatcherOptions, 'clearScreen' | 'chokidar'> = {
    clearScreen: true,
    chokidar: {
      alwaysStat: true
    }
  };

}
