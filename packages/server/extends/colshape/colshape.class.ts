import { Colshape } from 'alt-server';
import { ColshapeInterface } from './colShape.interface';

export class ColshapeClass extends Colshape implements ColshapeInterface {

  /**
   * Colshape name for identification
   *
   * @type {string}
   */
  name: string;

}
