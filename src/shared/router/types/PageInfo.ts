import type { CreateRoute } from "./CreateRoute";

export type PageInfo = Omit<CreateRoute, 'children'> & {
  parentKey?: string;
  children?: PageInfo[]
};