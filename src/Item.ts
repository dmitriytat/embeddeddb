import { Context } from "./Context.ts";
import { Constructor } from "./Collection.ts";

export interface IItem {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
}

export class Item implements IItem {
  public id?: string;
  public createdAt?: number;
  public updatedAt?: number;

  constructor(data: Partial<IItem>, protected context: Context) {
    this.assign(data);
  }

  assign(data?: Partial<IItem>) {
    Object.assign(this, data);
  }

  save(): this {
    this.context.createCollection(this.constructor as Constructor<this>).save(
      this,
    );
    return this;
  }

  toJSON() {
    const { context, ...data } = this;
    return data;
  }
}
