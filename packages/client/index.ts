import '@abraham/reflection';
import { PlayerWorker } from './worker/player.worker';
import { container } from 'tsyringe';


export * from './services';
export * from './decorators';
export * from './extends';


container.resolve(PlayerWorker);
