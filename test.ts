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

TaskCollection.save(task1);
TaskCollection.save(task2);
TaskCollection.save(task3);

const taskOne = TaskCollection.findById(task1.id);
const [taskTwo] = TaskCollection.find({ title: task2.title });
const taskThree = TaskCollection.findOne(task3);

if (!taskOne || !taskTwo) {
  Deno.exit();
}

console.log({
  taskOne: taskOne,
  taskTwo: taskTwo,
  taskThree: taskThree,
});

taskOne.title = "Edit one";
TaskCollection.save(taskOne);

console.log({
  taskOne: taskOne,
});

console.log({
  count: TaskCollection.count(),
});

const removeCountOne = TaskCollection.removeById(taskOne.id);
const removeCountTwo = TaskCollection.remove({ title: "Create another" });
const removeCountThree = TaskCollection.remove(task3);

console.log({
  removeCountOne,
  removeCountTwo,
  removeCountThree,
});

console.log({
  count: TaskCollection.count(),
});
