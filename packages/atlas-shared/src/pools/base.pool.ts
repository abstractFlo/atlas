export abstract class BasePool<T, K = string | number> {
  /**
   * Contains the pool
   *
   * @type {Map<K, T>}
   * @protected
   */
  protected pool: Map<K, T> = new Map<K, T>();

  /**
   * Return the size of the pool
   *
   * @returns {number}
   */
  public get size(): number {
    return this.pool.size;
  }

  /**
   * Add new entry to pool if not exists
   *
   * @param {K} identifier
   * @param {T} entity
   * @returns {Map<K, T> | void}
   */
  public add(identifier: K, entity: T): Map<K, T> | void {
    if (this.has(identifier)) return;

    this.pool.set(identifier, entity);
  }

  /**
   * Return entry from pool
   *
   * @param {K} identifier
   * @returns {void | T}
   */
  public get(identifier: K): T | void {
    return this.pool.get(identifier);
  }

  /**
   * Check if pool has entry
   *
   * @param {K} identifier
   * @returns {boolean}
   */
  public has(identifier: K): boolean {
    return this.pool.has(identifier);
  }

  /**
   * Return pool values as array
   *
   * @returns {T[]}
   */
  public entriesAsArray(): T[] {
    return Array.from(this.pool.values());
  }

  /**
   * Return pool keys as array
   *
   * @returns {K[]}
   */
  public keysAsArray(): K[] {
    return Array.from(this.pool.keys());
  }

  /**
   * Remove entry from pool by given key
   *
   * @param {K} identifier
   * @returns {boolean}
   */
  public remove(identifier: K): boolean {
    return this.pool.delete(identifier);
  }

  /**
   * Clear the complete pool
   */
  public clear(): void {
    this.pool.clear();
  }
}
