export abstract class BasePool<T, K = string | number> {

  /**
   * Contains the pool
   *
   * @type {Map<string|number, T>}
   * @protected
   */
  protected pool: Map<K, T> = new Map<K, T>();

  /**
   * Return the pool size
   *
   * @return {number}
   */
  public get size(): number {
    return this.pool.size;
  }

  /**
   * Create new entity inside pool if not exists
   *
   * @param {K} identifier
   * @param {T} entity
   * @return {Map<string|number, T> | void}
   */
  public add(identifier: K, entity: T): Map<K, T> | void {
    if (!this.has(identifier)) {
      this.pool.set(identifier, entity);
    }
  }

  /**
   * Get entity from pool if exists
   *
   * @param {K} identifier
   * @return {T | void}
   */
  public get(identifier: K): T | void {
    if (this.has(identifier)) {
      return this.pool.get(identifier);
    }
  }

  /**
   * Check if the pool has identifier
   *
   * @param {K} identifier
   * @return {boolean}
   */
  public has(identifier: K): boolean {
    return this.pool.has(identifier);
  }

  /**
   * Return all entries from pool
   *
   * @return {T[]}
   */
  public entries(): T[] {
    return Array.from(this.pool.values());
  }

  /**
   * Return all keys from pool
   *
   * @return {(K)[]}
   */
  public keys(): (K)[] {
    return Array.from(this.pool.keys());
  }

  /**
   * Remove entity from pool if exists
   *
   * @param {K} identifier
   * @return {boolean}
   */
  public remove(identifier: K): boolean {
    return this.pool.delete(identifier);
  }

  /**
   * Remove all entities from pool
   */
  public removeAll(): void {
    this.pool.clear();
  }

}
