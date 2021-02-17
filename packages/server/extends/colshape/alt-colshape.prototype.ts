import { Colshape } from 'alt-server';
import { ColshapeClass } from './colShape.class';
import { ColshapeInterface } from './colShape.interface';

declare module 'alt-server' {
  export interface Colshape extends ColshapeInterface {}
}

Colshape.prototype = new ColshapeClass();
