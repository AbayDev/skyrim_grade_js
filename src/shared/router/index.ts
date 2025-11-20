import { PagePathAnalyzer } from "./path-analysis/PagePathAnalyzer";
import { Router } from "./core/Router";
import { RouterCurrentPages } from "./page-management/RouterCurrentPages";
import { RouterPageRendering } from "./rendering/RouterPageRendering";
import { RouterPagesStorage } from "./page-management/RouterPagesStorage";

export const buildRouterDefault = (rootElement: HTMLElement) => {
  const currentPages = new RouterCurrentPages();
  return new Router(
    currentPages,
    new PagePathAnalyzer(),
    new RouterPagesStorage(),
    new RouterPageRendering(rootElement, currentPages)
  );
};
