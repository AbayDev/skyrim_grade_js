import type { RouterInterface } from "../core/contracts/RouterInterface";

export interface PageInterface {
  key: string;
  mount(): HTMLElement | Promise<HTMLElement>;
  mounted?(): void;
  unmount?(): void;
}
export type PageProps = {
  router?: RouterInterface
}

export type PageClass = new (props: PageProps) => PageInterface;
