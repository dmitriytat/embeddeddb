import { Item, IItem, one } from "../mod.ts";

import { User } from "./User.ts";

export interface ITask extends IItem {
  title?: string;
  author?: User | null;
}

export class Task extends Item implements ITask {
  title: string = "";

  @one("User")
  author: User | null = null;
}
