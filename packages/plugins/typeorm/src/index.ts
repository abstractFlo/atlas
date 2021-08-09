import './services/database.service';

export { AutoAdd } from './decorators/auto-add.decorator';
export { TypeOrmBaseRespository } from './typeorm-base.respository';
// Re-Export TypeORM to enable import from this plugin
export * from 'typeorm';
