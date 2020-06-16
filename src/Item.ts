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
    this.assign(data);
  }

  assign(data?: object) {
    Object.assign(this, data);
  }
}
