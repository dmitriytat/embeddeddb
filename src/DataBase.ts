export interface DataBase<T> {
  read(): Promise<T[]>;
  write(items: T[]): Promise<void>;
}
