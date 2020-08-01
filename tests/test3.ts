import { exec, QueryTypes, Resolvers } from "../mod.ts";

import { TaskCollection, UserCollection } from "./models/index.ts";
import { User } from "./models/User.ts";
import { Task } from "./models/Task.ts";

const author: User = UserCollection.create({ name: "User #1" }).save();
const task1: Task = TaskCollection.create({ title: "#1", author }).save();
const task2: Task = TaskCollection.create({ title: "#2", author }).save();
const task3: Task = TaskCollection.create({ title: "#3", author }).save();

author.tasks = [task1, task2, task3];
author.save();

const resolvers: Resolvers = {
  users: (condition: Partial<User>) => UserCollection.find(condition),
  user: (condition: Partial<User>) => UserCollection.findOne(condition),
  tasks: (condition: Partial<Task>) => TaskCollection.find(condition),
  task: (condition: Partial<Task>) => TaskCollection.findOne(condition),
};

const query = {
  user: {
    params: {
      id: author.id,
    },
    body: {
      name: QueryTypes.String,
      tasks: [{
        title: QueryTypes.String,
        author: {
          id: QueryTypes.String,
        },
      }],
    },
  },
  users: {
    params: {
      id: author.id,
    },
    body: [{
      name: QueryTypes.String,
      tasks: [{
        title: QueryTypes.String,
        author: {
          id: QueryTypes.String,
        },
      }],
    }],
  },
  task: {
    params: {
      id: task2.id,
    },
    body: {
      title: QueryTypes.String,
      author: {
        name: QueryTypes.String,
      },
    },
  },
};

const result = exec(query, resolvers);

console.log(JSON.stringify(result, null, 2));
