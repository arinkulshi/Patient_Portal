// backend/tests/fixtures/storage.mock.ts
import { IStorageEngine } from '../../src/storage/storage.interface';

/**
 * Mock storage implementation for testing
 */
export class MockStorage<T extends { id: string }> implements IStorageEngine<T> {
  private data: Map<string, T>;

  constructor(initialData: T[] = []) {
    this.data = new Map<string, T>();
    this.reset(initialData);
  }

  /**
   * Reset the mock data
   */
  reset(items: T[] = []): void {
    this.data.clear();
    items.forEach(item => {
      if (item && item.id) {  // Make sure item and id are valid
        this.data.set(item.id, { ...item }); // Clone to avoid reference issues
      }
    });
  }

  /**
   * Get all items
   */
  async getAll(): Promise<T[]> {
    return Array.from(this.data.values()).map(item => ({ ...item }));
  }

  /**
   * Get item by id
   */
  async getById(id: string): Promise<T | null> {
    const item = this.data.get(id);
    return item ? { ...item } : null;
  }

  /**
   * Create new item
   */
  async create(item: T): Promise<T> {
    if (!item || !item.id) {
      throw new Error('Item must have an id property');
    }
    const newItem = { ...item };
    this.data.set(newItem.id, newItem);
    return { ...newItem };
  }

  /**
   * Update existing item
   */
  async update(id: string, item: Partial<T>): Promise<T | null> {
    const existingItem = this.data.get(id);
    if (!existingItem) {
      return null;
    }
    
    const updatedItem = { ...existingItem, ...item } as T;
    this.data.set(id, updatedItem);
    return { ...updatedItem };
  }

  /**
   * Delete item
   */
  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  /**
   * Query items using a predicate function
   */
  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const allItems = Array.from(this.data.values());
    return allItems.filter(predicate).map(item => ({ ...item }));
  }

  /**
   * Count items, optionally filtered by predicate
   */
  async count(predicate?: (item: T) => boolean): Promise<number> {
    if (!predicate) {
      return this.data.size;
    }
    
    const allItems = Array.from(this.data.values());
    return allItems.filter(predicate).length;
  }

  /**
   * Initialize mock storage (no-op for mock)
   */
  async initialize(): Promise<void> {
    // No-op for mock
    return Promise.resolve();
  }

  /**
   * Close mock storage (no-op for mock)
   */
  async close(): Promise<void> {
    // No-op for mock
    return Promise.resolve();
  }
}