import { DataBase } from "./DataBase.ts";
import { existsSync } from "../dep.ts";

export class JSONFileDataBase<T> implements DataBase<T> {
  constructor(private file: string) {
    if (!existsSync(file)) {
      this.write([]);
    }
  }

  read(): T[] {
    const data = Deno.readTextFileSync(this.file);
    return JSON.parse(data);
  }

  write(items: T[]): void {
    const data = JSON.stringify(items);
    Deno.writeTextFileSync(this.file, data);
  }
}
