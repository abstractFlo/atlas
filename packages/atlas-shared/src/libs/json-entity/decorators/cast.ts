import { KEYS } from '../json-entity.constants';

export type CastCallback = (currentValue: any, jsonObject: any) => any;

export interface CastConfig {
  property?: string;
  from?: CastCallback;
  to?: CastCallback;
  readOnly?: CastCallback | boolean;
  trim?: boolean; // default:true
}

/**
 * allow casting json properties from and to object
 * @param {CastConfig} config
 * @returns {(t: any, p: (string)) => void}
 * @constructor
 */
export function Cast(config: CastConfig = { trim: true }): (t: any, p: string | symbol) => void {
  return (target: any, propertyKey: string): void => {
    config.property = config.property || (propertyKey as string);
    // eslint-disable-next-line no-self-assign
    config.trim = config.trim;

    const propertiesConfig: { [key: string]: any } = Reflect.getMetadata(KEYS.CONFIG, target) || {};

    propertiesConfig[propertyKey] = config;

    Reflect.defineMetadata(KEYS.CONFIG, propertiesConfig, target);
  };
}
