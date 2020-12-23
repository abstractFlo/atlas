import { Cast, JsonEntityModel } from '../json-entity';

export class ModuleOptionsDecoratorModel extends JsonEntityModel {

  @Cast()
  imports: any[] = [];

}
