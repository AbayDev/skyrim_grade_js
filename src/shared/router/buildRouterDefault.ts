import { PagePathAnalyzer } from "./path-analysis/PagePathAnalyzer";
import { Router } from "./core/Router";
import { RouterCurrentPages } from "./page-management/RouterCurrentPages";
import { RouterPageRendering } from "./rendering/RouterPageRendering";
import { RouterPagesStorage } from "./page-management/RouterPagesStorage";
import { RouterView } from "./rendering/RouterView";
import type { RouterInterface } from "./core/contracts/RouterInterface";

// Регистрируем RouterView как пользовательский элемент
if (!customElements.get('router-view')) {
  customElements.define('router-view', RouterView);
}

export const buildRouterDefault = <RouterContextType>(rootElement: HTMLElement): RouterInterface<RouterContextType> => {
  const currentPages = new RouterCurrentPages();
  return new Router<RouterContextType>(
    currentPages,
    new PagePathAnalyzer<RouterContextType>(),
    new RouterPagesStorage<RouterContextType>(),
    new RouterPageRendering<RouterContextType>(rootElement, currentPages)
  );
};
