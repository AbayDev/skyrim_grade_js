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

export class Router implements RouterInterface {
  private currentRoute?: Route;
  private currentPages: CurrentPagesInterface;
  private pagePathAnalyzer: PagePathAnalyzerInterface;
  private pagesStorage: RouterPagesStorageInterface;
  private pageRendering: RouterPageRenderingInterface;

  constructor(
    currentPages: CurrentPagesInterface,
    pagePathAnalyzer: PagePathAnalyzerInterface,
    pagesStorage: RouterPagesStorageInterface,
    pageRendering: RouterPageRenderingInterface
  ) {
    this.currentPages = currentPages;
    this.pagePathAnalyzer = pagePathAnalyzer;
    this.pagesStorage = pagesStorage;
    this.pageRendering = pageRendering;
  }

  public getCurrentRoute() {
    return this.currentRoute!;
  }

  async back(): Promise<void> {}

  public addPage(...pages: PageInfo[]) {
    this.pagesStorage.add(...pages);
  }

  public removePage(key: string) {
    this.pagesStorage.remove(key);
  }

  private generateCurrentRoute(
    pages: PageInfo[],
    params?: RouteParams,
    query?: RouteQuery
  ): Route {
    return {
      params: params || {},
      query: query || {},
      name: (pages.at(-1) as PageInfo)?.key,
      path: this.pagePathAnalyzer.generatePathByPages(pages, params, query),
    };
  }

  private navigateByStringPath(path: string) {
    let correctPath = path;

    if (path.endsWith("/")) {
      correctPath = path.slice(0, path.length - 1);
    }

    const query = this.pagePathAnalyzer.getPathQueryParams(path);
    const founded = this.pagePathAnalyzer.findPagesByPath(
      correctPath,
      this.pagesStorage.getPages()
    );

    if (!founded.pages.length) {
      throw new RouterError(`Page by path ${path} not found`);
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
    });
  }

  public async navigate(to: string | RouteLocation): Promise<void> {
    if (typeof to === "string") {
      this.navigateByStringPath(to);
    } else if (typeof to === "object" && to !== null) {
      this.navigateByRouteLocation(to);
    }
  }
}
