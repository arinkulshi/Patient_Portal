
export interface IRepository<T> {
    findAll(filters?: any): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(item: Partial<T>): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    count(filters?: any): Promise<number>;
  }
  
 
  export interface FilterOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    [key: string]: any;
  }
  

  export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }