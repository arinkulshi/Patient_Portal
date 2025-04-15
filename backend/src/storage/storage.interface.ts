/**
 * Interface for storage engine implementations
 */
export interface IStorageEngine<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  query(predicate: (item: T) => boolean): Promise<T[]>;
  count(predicate?: (item: T) => boolean): Promise<number>;
}