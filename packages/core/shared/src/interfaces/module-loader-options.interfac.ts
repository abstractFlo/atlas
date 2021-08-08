import { constructor } from './constructor.interface';

export interface ModuleOptionsDecoratorInterface {
  imports?: constructor<any>[],
  components?: constructor<any>[],
}
