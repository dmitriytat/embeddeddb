import { isObject } from "./utils/isObject.ts";

export const QueryTypes = {
  String: "",
  Number: 0,
  Boolean: false,
  Null: null,
};

export type OneResolver<T extends object = object> = (
  condition: Partial<T>,
) => T | null;
export type ManyResolver<T extends object = object> = (
  condition: Partial<T>,
) => T[];
export type Resolver = OneResolver | ManyResolver;
export type Resolvers = { [key: string]: Resolver };

export type Query = {
  [key: string]: {
    params?: object;
    body: any;
  };
};

export type Result<T extends Query> = {
  [key in keyof T]: T[key]["body"] extends Array<unknown> ? T[key]["body"]
    : (T[key]["body"] | null);
};

function resolve<T>(body: T, parent: any): T {
  if (Array.isArray(body)) {
    return parent.map((item: any) => resolve(body[0], item)) as T;
  }

  return Object.keys(body).reduce((resolved, key: unknown) => {
    let result;

    if (isObject(body[key as keyof T]) || Array.isArray(body[key as keyof T])) {
      // @ts-ignore
      result = resolve(body[key], parent[key]);
    } else {
      // @ts-ignore
      result = parent[key];
    }

    return {
      ...resolved,
      [key as keyof T]: result,
    };
  }, {} as T);
}

export function exec<T extends Query>(query: T, resolvers: Resolvers) {
  return Object.keys(query).reduce((result: Result<T>, key: keyof T) => {
    result[key] = resolve(
      query[key].body,
      resolvers[key as string](query.params),
    );

    return result;
  }, {} as Result<T>);
}
