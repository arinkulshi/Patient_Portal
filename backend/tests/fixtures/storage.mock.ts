// backend/tests/fixtures/storage.mock.ts
import { IStorageEngine } from '../../src/storage/storage.interface';


export class MockStorage<T extends { id: string }> implements IStorageEngine<T> {
  private data: Map<string, T>;

  constructor(initialData: T[] = []) {
    this.data = new Map<string, T>();
    this.reset(initialData);
  }

 
  reset(items: T[] = []): void {
    this.data.clear();
    items.forEach(item => {
      if (item && item.id) {  
        this.data.set(item.id, { ...item }); 
      }
    });
  }

  
  async getAll(): Promise<T[]> {
    return Array.from(this.data.values()).map(item => ({ ...item }));
  }

  
  async getById(id: string): Promise<T | null> {
    const item = this.data.get(id);
    return item ? { ...item } : null;
  }

 
  async create(item: T): Promise<T> {
    if (!item || !item.id) {
      throw new Error('Item must have an id property');
    }
    const newItem = { ...item };
    this.data.set(newItem.id, newItem);
    return { ...newItem };
  }


  async update(id: string, item: Partial<T>): Promise<T | null> {
    const existingItem = this.data.get(id);
    if (!existingItem) {
      return null;
    }
    
    const updatedItem = { ...existingItem, ...item } as T;
    this.data.set(id, updatedItem);
    return { ...updatedItem };
  }


  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

 
  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const allItems = Array.from(this.data.values());
    return allItems.filter(predicate).map(item => ({ ...item }));
  }

  
  async count(predicate?: (item: T) => boolean): Promise<number> {
    if (!predicate) {
      return this.data.size;
    }
    
    const allItems = Array.from(this.data.values());
    return allItems.filter(predicate).length;
  }

 
  async initialize(): Promise<void> {
    return Promise.resolve();
  }


  async close(): Promise<void> {
    return Promise.resolve();
  }
}