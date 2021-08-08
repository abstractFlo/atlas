/**
 * Create unique array for given items
 *
 * @param items
 */
export function unique<T>(items: T[]): T[] {
  return items.filter((value: T, index: number, self: T[]) => self.indexOf(value) === index);
}
