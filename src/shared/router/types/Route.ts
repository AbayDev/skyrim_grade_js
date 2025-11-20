import type { RouteParams } from "./RouteParams";
import type { RouteQuery } from "./RouteQuery";

export type Route = {
  path: string;
  name: string;
  params: RouteParams;
  query: RouteQuery;
};