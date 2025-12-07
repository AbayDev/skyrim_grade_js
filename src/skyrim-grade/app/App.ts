import type { AppInterface } from "../../shared/app";
import { buildRouterDefault } from "../../shared/router/buildRouterDefault";

export class SkyrimGradeApp implements AppInterface<AppConfig> {
  constructor(private readonly rootElement: HTMLElement) {}

  public init(config: AppConfig) {
    this.initRouter(config);
  }

  private initRouter(config: AppConfig) {
    const router = buildRouterDefault<SkyrimGradeContext>(this.rootElement);
    router
      .initRouterContext({
        config,
      })
      .addPage({
        key: "TasksPage",
        page: {
          async load() {
            return (await import("../pages/tasks/ui/TasksPage")).default;
          },
        },
        path: new URLPattern({ pathname: "/tasks" }),
      })
      .startRender();
  }
}
