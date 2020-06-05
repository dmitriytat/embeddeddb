import {uuid} from "./dep.ts";
import {Item, IItem} from "./Item.ts";

export class Collection<T> {
    private readonly file: string;
    private items: IItem<T>[] = [];

    constructor(name: string) {
        this.file = name + '.json';
    }

    async read() {
        let collection = [];
        try {
            const data = await Deno.readTextFile(this.file);
            collection = JSON.parse(data);
        } catch (e) {
        } finally {
            this.items = collection
        }
    }

    async write() {
        const data = JSON.stringify(this.items);
        await Deno.writeTextFile(this.file, data);
    }

    async save(item: Item<T>) {
        await this.read();

        const itemIndex = this.items.findIndex(itm => itm.id === item.id);

        if (itemIndex === -1) {
            this.items = this.items.concat(item.serialise());
        } else {
            this.items[itemIndex] = item.serialise();
        }

        await this.write();

        return item;
    }

    genId() {
        return uuid.generate();
    }

    create(data: T) {
        return new Item<T>({id: this.genId(), data}, this);
    }

    async findById(id: Item<T>['id']): Promise<Item<T> | undefined> {
        await this.read();
        const item = this.items.find(itm => itm.id === id);

        return item && new Item<T>(item, this);
    }

    async removeById(id: Item<T>['id']): Promise<number> {
        await this.read();
        const oldCount = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        const newCount = this.items.length;

        await this.write();

        return oldCount - newCount;
    }

    async find(condition: Partial<T>): Promise<Item<T>[]> {
        await this.read();

        return this.items.filter(item => {
            return Object.keys(condition).every((key: unknown) => {
                return item.data[key as keyof T] === condition[key as keyof T];
            });
        })
            .map((item: IItem<T>) => new Item<T>(item, this));
    }

    async remove(condition: Partial<T>): Promise<number> {
        await this.read();

        const oldCount = this.items.length;
        this.items = this.items.filter(item => {
            return Object.keys(condition).some((key: unknown) => {
                return item.data[key as keyof T] !== condition[key as keyof T];
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

        return this.items.filter(item => {
            return Object.keys(condition).every((key: unknown) => {
                return item.data[key as keyof T] === condition[key as keyof T];
            });
        }).length;
    }
}
