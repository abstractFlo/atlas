import { Player } from 'alt-server';
import { PlayerInterface } from './player.interface';
import { PlayerClass } from './player.class';

declare module 'alt-server' {
  export interface Player extends PlayerInterface {}
}

Player.prototype = new PlayerClass();

export default {}
