import type { PageInterface } from "../../types/PageInterface";

export interface CurrentPagesInterface {
  /**
   * Размонтировать все страницы
   */
  unmountPages(): void;
  /**
   * Указать что страница является текущей
   * @param page - страница
   */
  markCurrentPage(page: PageInterface): void;

  /**
   * Получить текущие отрендеренные страницы
   */
  getCurrentPages(): PageInterface[]
}
