import { buildRouterDefault } from "../../shared/router/buildRouterDefault";

interface AppInterface<Config extends Record<string, unknown>> {
  init(config: Config): void;
}

export class App implements AppInterface<AppConfig> {
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
