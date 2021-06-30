import { CastConfig } from './decorators/cast';
import { IRelationInfo } from './decorators/relations';
import { KEYS, RELATION } from './json-entity.constants';

interface InternalCastConfig extends CastConfig {
  property: string;
  trim: boolean;
}

/**
 * automatic cast json to entity model
 */
export class JsonEntityModel {
  /**
   * create relations
   * @param {IRelationInfo} relationInfo
   * @param json
   * @param {boolean} mapping [default:true]
   * @returns {JsonEntityModel | JsonEntityModel[] | undefined}
   */
  private static createRelations(
    relationInfo: IRelationInfo,
    json: { [key: string]: any },
    mapping: boolean = true,
  ): JsonEntityModel | JsonEntityModel[] | undefined {
    if (!json) {
      return undefined;
    }

    switch (relationInfo.type) {
      case RELATION.HAS_ONE:
        return new relationInfo.model().cast(json, mapping);
      case RELATION.HAS_MANY:
        const items: JsonEntityModel[] = [];
        for (const key of Object.keys(json)) {
          items.push(new relationInfo.model().cast(json[key], mapping));
        }
        return items;
    }
  }

  /**
   * parse json data to model class based on @Cast decorator
   * @param {object | null} json
   * @param {boolean} mapping [default:true]
   * @returns {this}
   */
  public cast(json: { [key: string]: any } | null, mapping: boolean = true) {
    const self = this as unknown as JsonEntityModel & { [key: string]: string };

    const properties: { [key: string]: InternalCastConfig } = Reflect.getMetadata(KEYS.CONFIG, this) || {};

    if (null !== json) {
      for (const propertyKey of Object.keys(properties)) {
        const castConfig: InternalCastConfig = properties[propertyKey];
        let castValue = json[mapping ? castConfig.property : propertyKey];

        const relationInfo = Reflect.getMetadata(KEYS.RELATIONS, this, propertyKey) as IRelationInfo;
        if (relationInfo) {
          castValue = JsonEntityModel.createRelations(relationInfo, castValue, mapping);
        }

        if (castConfig.trim && typeof castValue === 'string') {
          castValue = castValue.trim();
        }

        if (castValue !== undefined) {
          self[propertyKey] = castValue;
        }
      }
    }

    return this;
  }
}
