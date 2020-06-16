import { DataBase } from "./DataBase.ts";

export class JSONFileDataBase<T> implements DataBase<T> {
  constructor(private file: string) {}

  async read(): Promise<T[]> {
    try {
      const data = await Deno.readTextFile(this.file);
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`Can\'t read file: ${this.file}`);
    }
  }

  async write(items: T[]): Promise<void> {
    const data = JSON.stringify(items);
    await Deno.writeTextFile(this.file, data);
  }
}
