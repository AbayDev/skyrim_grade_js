import type { RouterInterface } from "../core/contracts/RouterInterface";
import type { RouterContext } from "./RouterContext";

export interface PageInterface {
  key: string;
  mount(): HTMLElement | Promise<HTMLElement>;
  mounted?(): void;
  unmount?(): void;
}
export type PageProps<RouterContextType> = {
  router: RouterInterface<RouterContextType>
} & RouterContext

export type PageClass<RouterContextType> = new (props: PageProps<RouterContextType>) => PageInterface;
