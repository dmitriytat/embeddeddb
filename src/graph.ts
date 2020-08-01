export type Resolver = ({}: any) => any;
export type Resolvers = { [key: string]: Resolver };

export type QueryField = { [key: string]: QueryField | any };

export interface QueryItem {
  params?: object;
  body: QueryField;
}

export interface Query {
  [key: string]: QueryItem;
}

const isObject = (o: any): boolean => !!o && o.constructor === Object;

const resolve = (body: QueryField, parent: any = {}): any | any[] => {
  if (Array.isArray(parent)) {
    return parent.map((item) => resolve(body, item));
  }

  return Object.keys(body).reduce((resolved, key) => {
    let result;

    if (isObject(body[key])) {
      // @ts-ignore
      result = resolve(body[key], parent[key]);
    } else {
      // @ts-ignore
      result = parent[key] || body[key];
    }

    return {
      ...resolved,
      [key]: result,
    };
  }, {});
};

export const exec = (query: Query, resolvers: Resolvers) => {
  return Object.keys(query).reduce((response, key) => {
    const result = resolve(
      query[key].body,
      resolvers[key](query[key]?.params || {}),
    );

    return {
      ...response,
      [key]: result,
    };
  }, {});
};
