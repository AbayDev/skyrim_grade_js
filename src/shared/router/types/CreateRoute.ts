import type { PageClass } from "./PageInterface";
import type { RouteLocation } from "./RouteLocation";

export type CreateRoute = {
  key: string;
  path: URLPattern;
  page: PageClass | { load: () => Promise<PageClass> };
  redirect?: string | RouteLocation;
  children?: CreateRoute[];
};
