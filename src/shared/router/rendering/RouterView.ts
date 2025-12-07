import type { PageInterface } from "../types/PageInterface";
import { RouterError } from "../errors/RouterError";

export class RouterView extends HTMLElement {
  private _applied?: boolean;

  constructor() {
    super();
    this.style.display = 'contents'
  }

  /**
   * Пометить RouterView как уже используемой
   */
  private markUsed() {
    this._applied = true;
  }

  /**
   * Сбросить использование
   */
  public resetApplied() {
    this._applied = false;
  }

  /**
   * RouterView занят
   */
  public isBusy() {
    return this._applied;
  }

  /**
   * Использовать RouterView как страницу
   * @param page - страница
   */
  public async use(page: PageInterface) {
    if (this._applied) {
      throw new RouterError("RouterView is busy");
    }

    let element: HTMLElement;
    try {
      element = await page.mount();
    } catch (e) {
      console.warn("Page mount error", e);
      throw new RouterError("Page not mounted");
    }

    this.append(element);
    this.markUsed();
  }
}
