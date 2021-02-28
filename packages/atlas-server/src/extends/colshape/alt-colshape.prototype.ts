import { Colshape } from 'alt-server';
import { ColshapeClass } from './colshape.class';
import { ColshapeInterface } from './colshape.interface';

declare module 'alt-server' {
  export interface Colshape extends ColshapeInterface {}
}

Colshape.prototype = new ColshapeClass();
