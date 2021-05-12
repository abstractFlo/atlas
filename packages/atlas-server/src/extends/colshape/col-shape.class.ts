import { Colshape } from 'alt-server';
import { ColShapeInterface } from './col-shape.interface';

/**
 * Custom colShape Class to extend base colShape class
 */
export class ColShapeClass extends Colshape implements ColShapeInterface {

  /**
   * ColShape name for identification
   *
   * @type {string}
   */
  name: string;

}
