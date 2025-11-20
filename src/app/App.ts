import { buildRouterDefault } from "../shared/router";

export class App {
  constructor(private readonly rootElement: HTMLElement) {}

  public init(config: AppConfig) {
    this.initRouter(config);
  }

  private initRouter(config: AppConfig) {
    const router = buildRouterDefault<SkyrimGradeContext>(this.rootElement);
    router.initRouterContext({
      config,
    });
  }
}
