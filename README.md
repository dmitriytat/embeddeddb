### EmbeddedDB

Simple embedded data base for small projects. 

### Usage

```ts
import { IItem, Item, Collection } from "./mod.ts";

interface ITask extends IItem {
  title?: string;
}

class Task extends Item implements ITask {}

const TaskCollection = new Collection<ITask>(Task);

const task = await TaskCollection.create({ title: "Create one" });

await TaskCollection.save(task);

console.log(`created`, task);

const taskOne = await TaskCollection.findById(task.id);

if (taskOne) {
  console.log(`founded`, taskOne);
} else {
  console.log(`not found`);
  Deno.exit();
}

const removeCount = await TaskCollection.remove(taskOne);

console.log(`removed: ${removeCount}`);
```
