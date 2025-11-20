import type { RouteParams } from "./RouteParams";
import type { RouteQuery } from "./RouteQuery";

export type RouteLocation = {
  name: string;
  params: RouteParams;
  query: RouteQuery;
};