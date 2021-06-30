/**
 * Constructor Type
 */
declare type constructor<T> = {
  new (...args: any[]): T;
};
export { constructor };
