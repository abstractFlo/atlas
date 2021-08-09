import './services/mongo-db.service';

export { AutoAdd } from './decorators/auto-add.decorator';
export { MongoDbBaseCollection } from './mongo-db-base.collection';
export { getMongoSessionFactory, getMongoSession, createMongoSession } from './helpers';

export * from 'hydrate-mongodb';
