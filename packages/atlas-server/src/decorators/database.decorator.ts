import { constructor, getAtlasMetaData } from '@abstractflo/atlas-shared';
import { container } from 'tsyringe';
import { DatabaseService } from '../services/database.service';
import { DatabaseEnums } from '../constants/database.constants';

/**
 * Register @AutoAdd decorator for auto add db entities
 *
 * @return {(target: constructor<any>) => void}
 * @constructor
 */
export const AutoAdd = () => {
  return (target: constructor<any>) => {
    const dbService = container.resolve(DatabaseService);

    const entities = getAtlasMetaData<constructor<any>[]>(DatabaseEnums.ENTITY_ADD, dbService);
    const alreadyExists = entities.find((entity: constructor<any>) => entity === target);

    if (alreadyExists) return;

    entities.push(target);
    Reflect.defineMetadata(DatabaseEnums.ENTITY_ADD, entities, dbService);
  };
};
