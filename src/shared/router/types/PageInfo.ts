import type { CreateRoute } from "./CreateRoute";

export type PageInfo<RouterContextType> = Omit<CreateRoute<RouterContextType>, 'children'> & {
  parentKey?: string;
  children?: PageInfo<RouterContextType>[]
};