import { Item, IItem, many } from "../../mod.ts";

import { Task } from "./Task.ts";

export interface IUser extends IItem {
  name?: string;
  tasks?: Task[];
}

export class User extends Item implements IUser {
  name: string = "default 2";

  @many("Task")
  tasks: Task[] = [];
}
