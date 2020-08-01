import { uuid } from "../dep.ts";
import { IItem, Item } from "./Item.ts";
import { DataBase } from "./DataBase.ts";
import { JSONFileDataBase } from "./JSONFileDataBase.ts";
import { Context } from "./Context.ts";

export type Constructor<T> = new (...args: any[]) => T;

export class Collection<T extends IItem, K extends Item> {
  private items: T[] = [];

  constructor(
    private creator: Constructor<K>,
    private db: DataBase<T> = new JSONFileDataBase(creator.name + ".json"),
    private context?: Context,
  ) {}

  read() {
    this.items = this.db.read();
  }

  write() {
    this.db.write(this.items);
  }

  save(item: T): T {
    this.read();

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

    this.write();

    return item;
  }

  genId() {
    return uuid.generate();
  }

  create(data?: T): K {
    const item = new this.creator({ id: this.genId() }, this.context);

    item.assign(data);

    return item;
  }

  findById(id: IItem["id"]): K | null {
    this.read();
    const item = this.items.find((itm) => itm.id === id);

    return item ? this.create(item) : null;
  }

  removeById(id: IItem["id"]): number {
    this.read();
    const oldCount = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    const newCount = this.items.length;

    this.write();

    return oldCount - newCount;
  }

  findOne(condition: Partial<T> = {}): K | null {
    this.read();

    const itm = this.items.find((item) => {
      return Object.keys(condition).every((key: unknown) => {
        return item[key as keyof T] === condition[key as keyof T];
      });
    });

    return itm ? this.create(itm) : null;
  }

  find(condition: Partial<T> = {}): K[] {
    this.read();

    return this.items.filter((item) => {
      return Object.keys(condition).every((key: unknown) => {
        return item[key as keyof T] === condition[key as keyof T];
      });
    })
      .map((item: T) => this.create(item));
  }

  remove(condition: Partial<T>): number {
    if (!condition) {
      return 0;
    }

    this.read();

    const oldCount = this.items.length;
    this.items = this.items.filter((item) => {
      return Object.keys(condition).some((key: unknown) => {
        return item[key as keyof T] !== condition[key as keyof T];
      });
    });
    const newCount = this.items.length;

    this.write();

    return oldCount - newCount;
  }

  count(condition?: Partial<T>): number {
    this.read();

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
