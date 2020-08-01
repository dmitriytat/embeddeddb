import { DataBase } from "./DataBase.ts";
import { JSONFileDataBase } from "./JSONFileDataBase.ts";
import { Collection, Constructor } from "./Collection.ts";
import { IItem } from "./Item.ts";
import { Item } from "./Item.ts";

export class Context {
  private collections: { [key: string]: Collection<any, any> } = {};

  constructor(private DB: Constructor<DataBase<any>> = JSONFileDataBase) {}

  createCollection<T extends IItem, K extends Item>(
    creator: Constructor<K>,
    db: DataBase<T> = new this.DB("./" + creator.name + ".json"),
  ): Collection<T, K> {
    if (!this.collections[creator.name]) {
      this.collections[creator.name] = new Collection<T, K>(creator, db, this);
    }

    return this.collections[creator.name];
  }

  getCollection<T extends IItem, K extends Item>(
    name: string,
  ): Collection<T, K> {
    return this.collections[name];
  }
}
