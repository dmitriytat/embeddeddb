import {uuid} from "./dep.ts";
import {IItem} from "./Item.ts";

type Constructor<T> = new (...args: any[]) => T;

export class Collection<T extends IItem> {
    private readonly file: string;
    private items: T[] = [];

    constructor(private creator: Constructor<T>, name?: string) {
        this.file = (name || creator.name) + '.json';
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

    async save(item: T): Promise<T> {
        await this.read();

        const itemIndex = this.items.findIndex(itm => itm.id === item.id);

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

    create(data?: T): T {
        const item = new this.creator({ id: this.genId() });
        return Object.assign(item, data);
    }

    async findById(id: IItem['id']): Promise<T | undefined> {
        await this.read();
        const item = this.items.find(itm => itm.id === id);

        return item && new this.creator(item);
    }

    async removeById(id: IItem['id']): Promise<number> {
        await this.read();
        const oldCount = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        const newCount = this.items.length;

        await this.write();

        return oldCount - newCount;
    }

    async find(condition: Partial<T>): Promise<T[]> {
        await this.read();

        return this.items.filter(item => {
            return Object.keys(condition).every((key: unknown) => {
                return item[key as keyof T] === condition[key as keyof T];
            });
        })
            .map((item: T) => new this.creator(item));
    }

    async remove(condition: Partial<T>): Promise<number> {
        await this.read();

        const oldCount = this.items.length;
        this.items = this.items.filter(item => {
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

        return this.items.filter(item => {
            return Object.keys(condition).every((key: unknown) => {
                return item[key as keyof T] === condition[key as keyof T];
            });
        }).length;
    }
}
