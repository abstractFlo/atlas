import { Colshape } from 'alt-server';
import { ColShapeClass } from './colshape.class';
import { ColShapeInterface } from './colshape.interface';

declare module 'alt-server' {
	export interface Colshape extends ColShapeInterface {}
}

Colshape.prototype = new ColShapeClass();
