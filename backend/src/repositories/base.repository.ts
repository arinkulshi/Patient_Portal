/**
 * Generic Repository Interface for CRUD operations
 */
export interface IRepository<T> {
    findAll(filters?: any): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(item: Partial<T>): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    count(filters?: any): Promise<number>;
  }
  
  /**
   * Filter options for query operations
   */
  export interface FilterOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    [key: string]: any;
  }
  
  /**
   * Result with pagination
   */
  export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }