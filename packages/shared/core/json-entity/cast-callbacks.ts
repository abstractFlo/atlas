/**
 * get callback for easy null checks
 * @returns {(v: any) => boolean}
 */

export function isNull() {
  return (v: any): boolean => v === null;
}

/**
 * get callback for converting to boolean, accept bool or trueValue with default string '1'
 * @param {any} trueValue
 * @returns {(v: any) => boolean}
 */
export function castToBoolean(trueValue: any = '1') {
  return (v: any): boolean => v === true || v === trueValue;
}

/**
 * get callback for converting from boolean to string (default strings '0', '1')
 * @param {any} trueValue
 * @param {any} falseValue
 * @returns {(v: any) => string}
 */
export function castBooleanToString(trueValue: any = '1', falseValue: any = '0') {
  return (v: any): string => (true === v ? trueValue : falseValue);
}

/**
 * get callback for converting to number (float|int) or null
 * @param {boolean} keepNull
 * @returns {(v: any) => (number | null)}
 */
export function castToNumber(keepNull = true) {
  return (v: any): number | null => {
    if (keepNull && v === null) {
      return null;
    }
    if (typeof v === 'string') {
      v = v.replace(',', '.');
    }
    const number = Number(v);
    if (!Number.isNaN(number)) {
      return number;
    }
    return 0;
  };
}

/**
 * get callback for converting from json
 * @param {boolean} keepNull
 * @return {(v: any) => (object | null)}
 */
export function castFromJson(keepNull = true) {
  return (v: any): object | null => {
    if (keepNull && v === null) {
      return null;
    }
    try {
      if (typeof v === 'string') {
        return JSON.parse(v);
      } else if (typeof v === 'object' && v !== null) {
        return v;
      }
    } catch (e) {
      // will return {}
    }
    return {};
  };
}

/**
 * get callback for converting to string or null
 * @param {boolean} keepNull
 * @param {string} standard
 * @returns {(v: any) => (string | null)}
 */
export function castToString(keepNull = true, standard = '') {
  return (v: any): string | null => {
    if (keepNull && v === null) {
      return null;
    }
    if (v !== undefined && v !== null) {
      return String(v);
    }
    return standard;
  };
}
