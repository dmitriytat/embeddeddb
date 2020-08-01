import { Item } from "./Item.ts";

export function one(name: string) {
  return function (
    target: any,
    property: string,
    descriptor?: TypedPropertyDescriptor<() => void>,
  ): any {
    const key = "_" + property;
    return {
      set: function (value: Item | Item["id"]) {
        if (value instanceof Item) {
          this[key] = value.id;
        } else {
          this[key] = value;
        }
      },
      get: function (): Item | null {
        return this.context.getCollection(name).findById(this[key]);
      },
      enumerable: true,
      configurable: true,
    } as any;
  };
}

export function many(name: string) {
  return function (
    target: any,
    property: string,
    descriptor?: TypedPropertyDescriptor<() => void>,
  ): any {
    const key = "_" + property;
    return {
      set: function (value: (Item | Item["id"])[]) {
        this[key] = value.map((item: Item | Item["id"]) => {
          if (item instanceof Item) {
            return item.id;
          } else {
            return item;
          }
        });
      },
      get: function (): Item[] {
        return this[key].map((id: Item["id"]) =>
          this.context.getCollection(name).find({ id })
        )
          .flat();
      },
      enumerable: true,
      configurable: true,
    } as any;
  };
}
