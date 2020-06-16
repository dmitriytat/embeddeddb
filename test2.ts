import { IItem, Item, Collection } from "./mod.ts";

interface ITask extends IItem {
  title?: string;
  isDone?: boolean;
}

class Task extends Item implements ITask {
  title: string = "default 2";
  isDone: boolean = false;

  get upper() {
    return this.title?.toUpperCase();
  }

  get created() {
    return this.createdAt ? new Date(this.createdAt) : null;
  }

  toggle() {
    this.isDone = !this.isDone;
  }
}

const TaskCollection = new Collection<ITask, Task>(Task);

const task = await TaskCollection.create({ title: "improve file structure" });
await TaskCollection.save(task);
console.log(`created`, task);

const taskOne = await TaskCollection.findById(task.id);
if (!taskOne) {
  console.log(`not found`);
  Deno.exit();
}

console.log(`found`, taskOne, taskOne.upper, taskOne.created);

taskOne.toggle();
await TaskCollection.save(taskOne);
console.log(`edited`, taskOne, taskOne.upper, taskOne.created);

const removeCount = await TaskCollection.remove(taskOne);
console.log(`removed: ${removeCount}`);
