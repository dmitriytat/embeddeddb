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

const task =  TaskCollection.create({ title: "Create one" });

 TaskCollection.save(task);

console.log(`created`, task);

const taskOne =  TaskCollection.findById(task.id);

if (taskOne) {
  console.log(`founded`, taskOne);
} else {
  console.log(`not found`);
  Deno.exit();
}

const removeCount =  TaskCollection.remove(taskOne);

console.log(`removed: ${removeCount}`);
```
