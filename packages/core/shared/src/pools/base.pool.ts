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
   * Add or update map entry with key
   *
   * @param {K} identifier
   * @param {T} entity
   * @returns {Map<K, T> | void}
   */
  public upsert(identifier: K, entity: T): Map<K, T> | void {
    this.pool.set(identifier, entity);
  }

  /**
   * Add many items to map as bulk
   *
   * @param {any} items
   */
  public upsertMany(...items: [K, T][]): void {
    items.forEach((item: [K, T]) => this.upsert(item[0], item[1]));
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
