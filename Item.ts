import {Collection} from "./Collection.ts";

export interface IItem<T> {
    id: string;
    createdAt?: number;
    updatedAt?: number;
    data: T;
}

export class Item<T> implements IItem<T> {
    public readonly id: string;
    public createdAt?: number;
    public updatedAt?: number;
    public data: T;

    constructor(item: IItem<T>, private _collection: Collection<T>) {
        this.id = item.id;
        this.createdAt = item.createdAt;
        this.updatedAt = item.updatedAt;
        this.data = item.data;
    }

    serialise(): IItem<T> {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            data: this.data,
        }
    }

    async save() {
        if (!this.createdAt) {
            this.createdAt = Date.now();
        } else {
            this.updatedAt = Date.now();
        }

        return this._collection.save(this);
    }
}
