import { app } from '@abstractflo/atlas-shared';
import { MongoDbService } from './services/mongo-db.service';
import { Session, SessionFactory } from 'hydrate-mongodb';

/**
 * Contains the session if first time resolved
 */
let mongoSession: Session;

/**
 * Get the mongo session
 *
 * @return {Session}
 */
export function getMongoSession(): Session {
  if (!mongoSession) {
    mongoSession = getMongoSessionFactory().createSession();
  }

  return mongoSession;
}

/**
 * Get the mongo session
 *
 * @return {Session}
 */
export function createMongoSession(): Session {
  return getMongoSessionFactory().createSession();
}

/**
 * Return the current session factory
 *
 * @return {SessionFactory}
 */
export function getMongoSessionFactory(): SessionFactory {
  const mongoDbService = app.resolve(MongoDbService);
  return mongoDbService.getClient();
}
