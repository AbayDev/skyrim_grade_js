import { RouterError } from "../errors/RouterError";
import type { CurrentPagesInterface } from "../page-management/contracts/RouterCurrentPagesInterface";
import type { PagePathAnalyzerInterface } from "../path-analysis/contracts/PagePathAnalyzerInterface";
import type { RouterPagesStorageInterface } from "../page-management/contracts/RouterPagesStorageInterface";
import type { RouterPageRenderingInterface } from "../rendering/contracts/RouterPageRenderingInterface";
import type { PageInfo } from "../types/PageInfo";
import type { RouteParams } from "../types/RouteParams";
import type { RouteQuery } from "../types/RouteQuery";
import type { Route } from "../types/Route";
import type { RouteLocation } from "../types/RouteLocation";
import type { RouterInterface } from "./contracts/RouterInterface";
import type { RouterContext } from "../types/RouterContext";

export class Router<RouterContextType>
  implements RouterInterface<RouterContextType>
{
  private currentRoute?: Route;
  private routerContext?: RouterContext;

  constructor(
    // @ts-ignore
    private readonly currentPages: CurrentPagesInterface,
    private readonly pagePathAnalyzer: PagePathAnalyzerInterface<RouterContextType>,
    private readonly pagesStorage: RouterPagesStorageInterface<RouterContextType>,
    private readonly pageRendering: RouterPageRenderingInterface<RouterContextType>
  ) {}

  public getCurrentRoute() {
    return this.currentRoute!;
  }

  async back(): Promise<void> {}

  public addPage(...pages: PageInfo<RouterContextType>[]) {
    this.pagesStorage.add(...pages);
    return this;
  }

  public removePage(key: string) {
    this.pagesStorage.remove(key);
    return this;
  }

  public startRender() {
    this.navigate(location.href);
    return this;
  }

  private generateCurrentRoute(
    pages: PageInfo<RouterContextType>[],
    params?: RouteParams,
    query?: RouteQuery
  ): Route {
    return {
      params: params || {},
      query: query || {},
      name: (pages.at(-1) as PageInfo<RouterContextType>)?.key,
      path: this.pagePathAnalyzer.generatePathByPages(pages, params, query),
    };
  }

  private navigateByStringPath(path: string) {
    // Извлекаем чистый путь из полного URL если передан
    const extractedPath = this.pagePathAnalyzer.extractOriginFromUrl(path);
    let correctPath = extractedPath;

    if (correctPath.endsWith("/")) {
      correctPath = correctPath.slice(0, correctPath.length - 1);
    }

    const query = this.pagePathAnalyzer.getPathQueryParams(correctPath);
    const founded = this.pagePathAnalyzer.findPagesByPath(
      correctPath,
      this.pagesStorage.getPages()
    );

    if (!founded.pages.length) {
      throw new RouterError(`Page by path ${correctPath} not found`);
    }

    this.currentRoute = this.generateCurrentRoute(
      founded.pages,
      founded.params,
      query
    );
    this.pageRendering.renderPages(founded.pages, {
      router: this,
    });
  }

  private navigateByRouteLocation(routeLocation: RouteLocation) {
    const pages = this.pagesStorage.findWithAncestors(routeLocation.name);

    if (!pages) {
      throw new RouterError("Page not found");
    }

    this.currentRoute = this.generateCurrentRoute(
      pages,
      routeLocation.params,
      routeLocation.query
    );
    this.pageRendering.renderPages(pages, {
      router: this,
      ...this.routerContext,
    });
  }

  public async navigate(to: string | RouteLocation): Promise<void> {
    if (typeof to === "string") {
      this.navigateByStringPath(to);
    } else if (typeof to === "object" && to !== null) {
      this.navigateByRouteLocation(to);
    }
  }

  public initRouterContext(context: RouterContext) {
    this.routerContext = context;
    return this;
  }
}
