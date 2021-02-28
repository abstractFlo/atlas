import './setup';
import { container } from 'tsyringe';
import { ConfigService, DatabaseService } from './services';


export * from './decorators';
export * from './services';
export * from './extends';


container.resolve(ConfigService);
container.resolve(DatabaseService);
