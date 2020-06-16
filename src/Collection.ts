import { uuid } from "../dep.ts";
import { IItem, Item } from "./Item.ts";

type Constructor<T> = new (...args: any[]) => T;

export class Collection<T extends IItem, K extends Item> {
  private readonly file: string;
  private items: T[] = [];

  constructor(private creator: Constructor<K>, name?: string) {
    this.file = (name || creator.name) + ".json";
  }

  async read() {
    let collection = [];
    try {
      const data = await Deno.readTextFile(this.file);
      collection = JSON.parse(data);
    } catch (e) {
    } finally {
      this.items = collection;
    }
  }

  async write() {
    const data = JSON.stringify(this.items);
    await Deno.writeTextFile(this.file, data);
  }

  async save(item: T): Promise<T> {
    await this.read();

    const itemIndex = this.items.findIndex((itm) => itm.id === item.id);

    if (!item.createdAt) {
      item.createdAt = Date.now();
    } else {
      item.updatedAt = Date.now();
    }

    if (itemIndex === -1) {
      this.items = this.items.concat(item);
    } else {
      this.items[itemIndex] = item;
    }

    await this.write();

    return item;
  }

  genId() {
    return uuid.generate();
  }

  create(data?: T): K {
    const item = new this.creator({ id: this.genId() });

    item.assign(data);

    return item;
  }

  async findById(id: IItem["id"]): Promise<K | null> {
    await this.read();
    const item = this.items.find((itm) => itm.id === id);

    return item ? this.create(item) : null;
  }

  async removeById(id: IItem["id"]): Promise<number> {
    await this.read();
    const oldCount = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    const newCount = this.items.length;

    await this.write();

    return oldCount - newCount;
  }

  async findOne(condition: Partial<T>): Promise<K | null> {
    await this.read();

    const itm = this.items.find((item) => {
      return Object.keys(condition).every((key: unknown) => {
        return item[key as keyof T] === condition[key as keyof T];
      });
    });

    return itm ? this.create(itm) : null;
  }

  async find(condition: Partial<T>): Promise<K[]> {
    await this.read();

    return this.items.filter((item) => {
      return Object.keys(condition).every((key: unknown) => {
        return item[key as keyof T] === condition[key as keyof T];
      });
    })
      .map((item: T) => this.create(item));
  }

  async remove(condition: Partial<T>): Promise<number> {
    await this.read();

    const oldCount = this.items.length;
    this.items = this.items.filter((item) => {
      return Object.keys(condition).some((key: unknown) => {
        return item[key as keyof T] !== condition[key as keyof T];
      });
    });
    const newCount = this.items.length;

    await this.write();

    return oldCount - newCount;
  }

  async count(condition?: Partial<T>): Promise<number> {
    await this.read();

    if (!condition) {
      return this.items.length;
    }

    return this.items.filter((item) => {
      return Object.keys(condition).every((key: unknown) => {
        return item[key as keyof T] === condition[key as keyof T];
      });
    }).length;
  }
}
