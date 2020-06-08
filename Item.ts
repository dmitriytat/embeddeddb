export interface IItem {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
}

export class Item implements IItem {
    public id?: string;
    public createdAt?: number;
    public updatedAt?: number;

    constructor(data: Partial<IItem>) {
        Object.keys(data).forEach((key) => {
            // @ts-ignore
            this[key] = data[key]
        });
    }
}
