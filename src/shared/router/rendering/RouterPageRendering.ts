import type { CurrentPagesInterface } from "../page-management/contracts/RouterCurrentPagesInterface";
import type { PageClass, PageProps } from "../types/PageInterface";
import type { RouterPageRenderingInterface } from "./contracts/RouterPageRenderingInterface";
import { RouterError } from "../errors/RouterError";
import type { RouterView } from "./RouterView";
import type { PageInfo } from "../types/PageInfo";

export class RouterPageRendering implements RouterPageRenderingInterface {
  constructor(
    private readonly rootElement: HTMLElement,
    private readonly currentPages: CurrentPagesInterface
  ) {
    this.currentPages = currentPages;
  }

  /**
   * Рендеринг страницы
   * @param page - страница
   * @param element - элемент где будет рендерится
   */
  private async renderPage(page: PageInfo, pageProps: PageProps) {
    const routerView = this.rootElement.getElementsByTagName(
      "router-view"
    ) as HTMLCollectionOf<RouterView>;

    // ищем не занятый RouterView
    const freeRouterView = Array.from(routerView).find((rv) => !rv.isBusy());

    if (!freeRouterView) {
      return null;
    }

    let pageClass: PageClass | undefined = undefined;
    try {
      // импортируем класс страницы
      if (
        typeof page.page === "object" &&
        typeof page.page !== null &&
        "load" in page.page
      ) {
        pageClass = await page.page.load();
      } else if (typeof page.page === "function") {
        pageClass = page.page;
      }
    } catch (e) {
      console.error("Page load error", e);
      throw new RouterError("Page not loaded");
    }

    if (!pageClass) {
      throw new RouterError(`PageInterface by ${page.key} not found`);
    }

    const pageInstance = new pageClass(pageProps);
    await freeRouterView.use(pageInstance);

    this.currentPages.markCurrentPage(pageInstance);
    pageInstance.mounted?.();
  }

  public async renderPages(pages: PageInfo[], pageProps: PageProps) {
    if (!pages?.length) {
      throw new RouterError("Page not found");
    }

    this.currentPages.unmountPages();

    const routerView = this.rootElement.getElementsByTagName(
      "router-view"
    ) as HTMLCollectionOf<RouterView>;
    Array.from(routerView).forEach((routerView) => {
      routerView.resetApplied();
    });

    try {
      for (let i = 0; i < pages.length; i++) {
        await this.renderPage(pages[i], pageProps);
      }
    } catch (e) {
      console.error("renderPage error", e);
      throw new RouterError("renderPage error");
    }
  }
}
