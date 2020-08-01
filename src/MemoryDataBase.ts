import { DataBase } from "./DataBase.ts";

export class MemoryDataBase<T> implements DataBase<T> {
  file: T[] = [];

  read(): T[] {
    return this.file;
  }

  write(items: T[]): void {
    this.file = items;
  }
}
