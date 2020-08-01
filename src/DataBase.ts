export interface DataBase<T> {
  read(): T[];
  write(items: T[]): void;
}
