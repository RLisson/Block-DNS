export interface DatabaseConnection {
  query: (text: string, params?: any[]) => Promise<any>;
  release: () => void;
  lastQuery?: any[];
}

export interface PoolClient extends DatabaseConnection {
  connect: () => Promise<DatabaseConnection>;
  end: () => Promise<void>;
  on: (event: string, listener: (...args: any[]) => void) => void;
}