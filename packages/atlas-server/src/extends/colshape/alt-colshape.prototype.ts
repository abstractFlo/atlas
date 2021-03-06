import { Colshape } from 'alt-server';
import { ColShapeClass } from './col -shape.class';
import { ColShapeInterface } from './col-shape.interface';

declare module 'alt-server' {
  export interface Colshape extends ColShapeInterface {}
}

Colshape.prototype = new ColShapeClass();
