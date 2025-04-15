import fs from 'fs/promises';
import path from 'path';
import { IStorageEngine } from './storage.interface';
import dbConfig from '../config/db.config';

/**
 * In-memory storage implementation with optional file persistence
 */
export class InMemoryStorage<T extends { id: string }> implements IStorageEngine<T> {
  private data: Map<string, T>;
  private filename: string;
  private persistInterval: NodeJS.Timeout | null = null;
  private dataChanged = false;

  /**
   * Initialize the storage with optional data loading from file
   */
  constructor(entityName: string) {
    this.data = new Map<string, T>();
    
    // Set up file path from config
    const entityConfig = dbConfig.entities[entityName as keyof typeof dbConfig.entities];
    if (!entityConfig) {
      throw new Error(`Entity configuration not found for ${entityName}`);
    }
    
    this.filename = path.join(dbConfig.storage.dataDir, entityConfig.filename);
    
    // Set up persistence if enabled
    if (dbConfig.storage.persistenceEnabled) {
      this.persistInterval = setInterval(() => {
        this.persistToFile();
      }, dbConfig.storage.persistInterval);
    }
  }

  /**
   * Load data from file on startup
   */
  async initialize(): Promise<void> {
    try {
      const fileData = await fs.readFile(this.filename, 'utf-8');
      const items: T[] = JSON.parse(fileData);
      
      // Reset the map and add all items
      this.data.clear();
      items.forEach(item => {
        this.data.set(item.id, item);
      });
      
      console.log(`Loaded ${this.data.size} items from ${this.filename}`);
    } catch (error) {
      // It's okay if the file doesn't exist yet
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Error loading data from ${this.filename}:`, error);
      }
    }
  }

  /**
   * Persist data to file
   */
  async persistToFile(): Promise<void> {
    if (!dbConfig.storage.persistenceEnabled || !this.dataChanged) {
      return;
    }
    
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.filename), { recursive: true });
      
      // Write data to file
      const dataArray = Array.from(this.data.values());
      await fs.writeFile(this.filename, JSON.stringify(dataArray, null, 2));
      
      this.dataChanged = false;
      console.log(`Persisted ${dataArray.length} items to ${this.filename}`);
    } catch (error) {
      console.error(`Error persisting data to ${this.filename}:`, error);
    }
  }

  /**
   * Clean up resources
   */
  async close(): Promise<void> {
    if (this.persistInterval) {
      clearInterval(this.persistInterval);
      this.persistInterval = null;
    }
    
    // Final persistence
    await this.persistToFile();
  }

  /**
   * Get all items
   */
  async getAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  /**
   * Get item by id
   */
  async getById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  /**
   * Create new item
   */
  async create(item: T): Promise<T> {
    this.data.set(item.id, item);
    this.dataChanged = true;
    return item;
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
    this.dataChanged = true;
    
    return updatedItem;
  }

  /**
   * Delete item
   */
  async delete(id: string): Promise<boolean> {
    const result = this.data.delete(id);
    if (result) {
      this.dataChanged = true;
    }
    return result;
  }

  /**
   * Query items using a predicate function
   */
  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const allItems = Array.from(this.data.values());
    return allItems.filter(predicate);
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
}