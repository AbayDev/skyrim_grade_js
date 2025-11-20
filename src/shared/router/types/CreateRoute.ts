import type { PageClass } from "./PageInterface";
import type { RouteLocation } from "./RouteLocation";

export type CreateRoute<RouterContextType> = {
  key: string;
  path: URLPattern;
  page: PageClass<RouterContextType> | { load: () => Promise<PageClass<RouterContextType>> };
  redirect?: string | RouteLocation;
  children?: CreateRoute<RouterContextType>[];
};
