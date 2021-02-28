import '@abraham/reflection';
import './setup';
import { container } from 'tsyringe';
import { ConfigService } from './services';


export * from './decorators';
export * from './services';
export * from './extends';


container.resolve(ConfigService);
