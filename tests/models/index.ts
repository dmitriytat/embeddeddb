import { Collection, MemoryDataBase } from "../../mod.ts";
import { Context } from "../../mod.ts";

import { IUser, User } from "./User.ts";
import { ITask, Task } from "./Task.ts";

const context = new Context(MemoryDataBase);

export const UserCollection: Collection<IUser, User> = context.createCollection<
  IUser,
  User
>(User);
export const TaskCollection: Collection<ITask, Task> = context.createCollection<
  ITask,
  Task
>(Task);
