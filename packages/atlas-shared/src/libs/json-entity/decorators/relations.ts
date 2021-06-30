import { KEYS, RELATION } from '../json-entity.constants';
import { JsonEntityModel } from '../json-entity.model';

export interface IRelationInfo {
  type: RELATION;
  model: typeof JsonEntityModel;
}

/**
 * Allows to automatically cast sub models to array of related Model class instances
 *
 * ```typescript
 *  class Author extends BaseModel {
 *      // ...
 *      ＠HasMany(Book)
 *      ＠Cast() books: Book[];
 *      // ...
 *  }
 * ```
 *
 * @param model ModelClass
 */
export function HasMany(model: typeof JsonEntityModel) {
  return function (target: any, propertyKey: string | symbol) {
    const config: IRelationInfo = {
      type: RELATION.HAS_MANY,
      model,
    };
    Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
  };
}

/**
 * Allows to automatically cast sub models to related Model class instance
 *
 * ```typescript
 *  class Book extends BaseModel {
 *      // ...
 *      ＠HasOne(Author)
 *      ＠Cast() author: Author;
 *      // ...
 *  }
 *  ```
 *
 * @param model ModelClass
 */
export function HasOne(model: typeof JsonEntityModel) {
  return function (target: any, propertyKey: string | symbol) {
    const config: IRelationInfo = {
      type: RELATION.HAS_ONE,
      model,
    };
    Reflect.defineMetadata(KEYS.RELATIONS, config, target, propertyKey);
  };
}
