import { app, constructor, getFrameworkMetaData, Injectable } from '@abstractflo/atlas-shared';
import { MongoDbService } from '../services/mongo-db.service';
import { Internals } from '../internals';


/**
 * AutoAdd Decorator for autoload db entities
 *
 * @param {constructor<any>} target
 * @constructor
 */
export function AutoAdd(target: constructor<any>): void {
  const dbService = app.resolve(MongoDbService);
  const entities = getFrameworkMetaData<constructor<any>[]>(Internals.DATABASE_ENTITIES, dbService);
  const alreadyExists = entities.find((entity: constructor<any>) => entity === target);

  if (alreadyExists) return;

  Injectable(target);

  entities.push(target);
  Reflect.defineMetadata<constructor<any>[]>(Internals.DATABASE_ENTITIES, entities, dbService);
}
