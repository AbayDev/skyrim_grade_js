import { buildRouterDefault } from "../shared/router";

export class App {
  constructor(private readonly rootElement: HTMLElement) {}

  public init() {
    const router = buildRouterDefault(this.rootElement);
  }
}
