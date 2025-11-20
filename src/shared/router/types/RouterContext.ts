export type RouterContext<T = Record<string, unknown>> = T & {
  [key: string]: unknown;
};
