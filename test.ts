import { IItem, Item, Collection } from "./mod.ts";

interface ITask extends IItem {
  title?: string;
}

class Task extends Item implements ITask {
  title?: string;
}

const TaskCollection = new Collection<ITask, Task>(Task);

const task1 = TaskCollection.create({ title: "Create one" });
const task2 = TaskCollection.create({ title: "Create another" });
const task3 = TaskCollection.create();

await TaskCollection.save(task1);
await TaskCollection.save(task2);
await TaskCollection.save(task3);

const taskOne = await TaskCollection.findById(task1.id);
const [taskTwo] = await TaskCollection.find({ title: task2.title });
const taskThree = await TaskCollection.findOne(task3);

if (!taskOne || !taskTwo) {
  Deno.exit();
}

console.log({
  taskOne: taskOne,
  taskTwo: taskTwo,
  taskThree: taskThree,
});

taskOne.title = "Edit one";
await TaskCollection.save(taskOne);

console.log({
  taskOne: taskOne,
});

console.log({
  count: await TaskCollection.count(),
});

const removeCountOne = await TaskCollection.removeById(taskOne.id);
const removeCountTwo = await TaskCollection.remove({ title: "Create another" });
const removeCountThree = await TaskCollection.remove(task3);

console.log({
  removeCountOne,
  removeCountTwo,
  removeCountThree,
});

console.log({
  count: await TaskCollection.count(),
});
