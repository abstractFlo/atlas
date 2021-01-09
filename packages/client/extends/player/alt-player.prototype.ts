import { Player } from 'alt-client';
import { PlayerInterface } from './player.interface';
import { PlayerClass } from './player.class';

declare module 'alt-client' {
  export interface Player extends PlayerInterface {}
}

Player.prototype = new PlayerClass();
