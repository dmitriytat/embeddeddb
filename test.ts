import {Collection} from "./Collection.ts";

interface Task {
    title: string;
}

const TaskCollection = new Collection<Task>('Task');

const task1 =  await TaskCollection.create({ title: 'Create one' }).save();
const task2 = await TaskCollection.create({ title: 'Create another' }).save();

const taskOne = await TaskCollection.findById(task1.id);
const [taskTwo] = await TaskCollection.find({ title: task2.data.title });

if (!taskOne || !taskTwo) {
    Deno.exit();
}

console.log({
    taskOne: taskOne.serialise(),
    taskTwo: taskTwo.serialise(),
});

taskOne.data.title = 'Edit one';
await taskOne.save();

console.log({
    taskOne: taskOne.serialise(),
});

console.log({
    count: await TaskCollection.count()
});

const removeCountOne = await TaskCollection.removeById(taskOne.id);
const removeCountTwo = await TaskCollection.remove({ title: 'Create another' });

console.log({
    removeCountOne,
    removeCountTwo
});

console.log({
    count: await TaskCollection.count()
});
